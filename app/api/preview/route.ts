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
  if (!sameOrigin) return failure(403, "PREVIEW_ORIGIN_REFUSED", "Preview origin not allowed")
  const body = await request.json().catch(() => ({}))
  const token = typeof body?.token === "string" && body.token.length <= 4096 ? body.token : null
  if (!token) return failure(401, "PREVIEW_INVALID", "Temporary access is missing. Open a new preview from Studio.")
  let response: Response
  try {
    const headers: Record<string, string> = { ...getStorefrontHeaders(), "X-Store-Preview-Token": token }
    const domain = request.headers.get("x-yovo-domain")
    if (domain) headers["X-Store-Domain"] = domain
    if (process.env.STOREFRONT_PROXY_SECRET) headers["X-Store-Proxy-Key"] = process.env.STOREFRONT_PROXY_SECRET
    response = await fetch(`${getApiBaseUrl()}/storefront/studio/preview`, { headers, cache: "no-store", redirect: "manual", signal: AbortSignal.timeout(20_000) })
  } catch (error) {
    if ((error as { code?: string }).code === "STORE_CONFIGURATION") return failure(503, "STORE_CONFIGURATION", "Preview is not configured correctly. Contact your administrator.")
    const mapped = previewFailure((error as Error).name === "TimeoutError" ? 504 : 503)
    return failure(mapped.status, mapped.code, mapped.error, { retryable: true })
  }
  const document = await response.json().catch(() => null)
  if (!response.ok) {
    const mapped = previewFailure(response.status, document)
    return failure(mapped.status, mapped.code, mapped.error, { upstream_status: response.status, retryable: mapped.retryable })
  }
  if (document?.preview !== true || document?.manifest?.template_id !== "savage-rise" || !document.studio) return failure(502, "PREVIEW_CONTRACT_INVALID", "Preview returned an incompatible response. Contact your administrator.")
  if (!validPreviewContext(document.preview_context)) return failure(502, "PREVIEW_CONTRACT_INVALID", "Open a new preview after the services have been updated.")
  const maxAge = verifiedPreviewLifetime(token)
  if (!maxAge) return failure(401, "PREVIEW_EXPIRED", "Your temporary access has expired. Open a new preview from Studio.", { retryable: true })
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
  return present ? NextResponse.json({ready:true}, {headers:privateHeaders}) : failure(401, "PREVIEW_COOKIE_UNAVAILABLE", "Your browser cannot retain private access in this preview. Open the saved draft in a new tab.")
}
