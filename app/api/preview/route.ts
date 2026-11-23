import { NextRequest, NextResponse } from "next/server"
import { getApiBaseUrl, getStorefrontHeaders } from "@/lib/api/gateway-config.mjs"
import { validPreviewContext } from "@/lib/studio-preview-protocol"
import { previewCookieHeader } from "@/lib/preview-access"
import { previewFailure, verifiedPreviewLifetime } from "@/lib/preview-access"

const privateHeaders = { "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer", "X-Robots-Tag": "noindex, nofollow" }
function failure(status: number, code: string, error: string, extra: Record<string, unknown> = {}) {
  return NextResponse.json({ error, code, stage: "exchange", ...extra }, { status, headers: privateHeaders })
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin")
  // NextURL normalizes loopback addresses to localhost. Compare the actual Host
  // (including its port) and protocol; never accept a caller's forwarded host.
  let sameOrigin = false
  try {
    const source = new URL(origin || "")
    sameOrigin = source.origin === origin && source.host === request.headers.get("host") && source.protocol === request.nextUrl.protocol
  } catch { /* Missing or opaque origins cannot exchange a preview credential. */ }
  if (!sameOrigin) return failure(403, "PREVIEW_ORIGIN_REFUSED", "Origine de l’aperçu refusée")
  const body = await request.json().catch(() => ({}))
  const token = typeof body?.token === "string" && body.token.length <= 4096 ? body.token : null
  if (!token) return failure(401, "PREVIEW_INVALID", "Accès temporaire manquant. Ouvrez un nouvel aperçu depuis Studio.")
  let response: Response
  try {
    const headers: Record<string, string> = { ...getStorefrontHeaders(), "X-Store-Preview-Token": token }
    const domain = request.headers.get("x-yovo-domain")
    if (domain) headers["X-Store-Domain"] = domain
    if (process.env.STOREFRONT_PROXY_SECRET) headers["X-Store-Proxy-Key"] = process.env.STOREFRONT_PROXY_SECRET
    response = await fetch(`${getApiBaseUrl()}/storefront/studio/preview`, { headers, cache: "no-store", redirect: "manual", signal: AbortSignal.timeout(20_000) })
  } catch (error) {
    if ((error as { code?: string }).code === "STORE_CONFIGURATION") return failure(503, "STORE_CONFIGURATION", "Le service d’aperçu est mal configuré. Contactez votre administrateur.")
    const mapped = previewFailure((error as Error).name === "TimeoutError" ? 504 : 503)
    return failure(mapped.status, mapped.code, mapped.error, { retryable: true })
  }
  const document = await response.json().catch(() => null)
  if (!response.ok) {
    const mapped = previewFailure(response.status, document)
    return failure(mapped.status, mapped.code, mapped.error, { upstream_status: response.status, retryable: mapped.retryable })
  }
  if (document?.preview !== true || document?.manifest?.template_id !== "savage-rise" || !document.studio) return failure(502, "PREVIEW_CONTRACT_INVALID", "Le service d’aperçu a renvoyé une réponse incompatible. Contactez votre administrateur.")
  if (!validPreviewContext(document.preview_context)) return failure(502, "PREVIEW_CONTRACT_INVALID", "Renouvelez l’aperçu après la mise à jour des services.")
  const maxAge = verifiedPreviewLifetime(token)
  if (!maxAge) return failure(401, "PREVIEW_EXPIRED", "Votre accès temporaire a expiré. Renouvelez l’aperçu depuis Studio.", { retryable: true })
  const base = ""
  const path = typeof body.path === "string" ? body.path : "/"
  const safePath = /^\/(?:pages\/[a-z0-9-]+)?$/.test(path) ? path : "/"
  const result = NextResponse.json({ location: base + safePath }, { headers: privateHeaders })
  // Custom domains are cross-site to the ERP. Partition the short-lived cookie
  // to the embedding Studio site; it cannot expose drafts to ordinary visitors.
  const secure = request.nextUrl.protocol === "https:"
  result.headers.append("Set-Cookie", previewCookieHeader("yovo_studio_preview", token, secure, maxAge))
  return result
}

// A same-origin probe verifies that this browser actually sends the HttpOnly
// cookie inside the iframe. Never fall back to a public document or JS storage.
export function GET(request: NextRequest) {
  const present = Boolean(request.cookies.get("yovo_studio_preview")?.value)
  return present ? NextResponse.json({ready:true}, {headers:privateHeaders}) : failure(401, "PREVIEW_COOKIE_UNAVAILABLE", "Le navigateur ne conserve pas l’accès privé dans cet aperçu. Ouvrez le brouillon enregistré dans un onglet.")
}
