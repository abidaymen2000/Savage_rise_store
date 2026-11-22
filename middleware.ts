import { NextRequest, NextResponse } from "next/server"
import { getApiBaseUrl, getStorefrontHeaders } from "@/lib/api/gateway-config.mjs"
import { hiddenPath } from "@/lib/studio-contract"
import { previewFrameAncestors } from "@/lib/preview-access"

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const token = request.cookies.get("yovo_studio_preview")?.value
  const result = NextResponse.next()
  result.headers.set("Cache-Control", "private, no-store")
  if (token || path === "/preview") {
    result.headers.set("Content-Security-Policy", previewFrameAncestors())
    result.headers.set("Referrer-Policy", "no-referrer")
    result.headers.set("X-Robots-Tag", "noindex, nofollow")
  }
  if (path.startsWith("/api/") || path === "/preview") return result
  // Required commerce pages are never hideable. Read only the published
  // visibility for optional routes; errors must not expose a hidden page.
  if (/^\/(packs|about|vlog|contact|help|size-guide|shipping|returns|pages)(\/|$)/.test(path)) {
    try {
      const response = await fetch(getApiBaseUrl() + "/storefront/studio/visibility", {headers:{...getStorefrontHeaders(),...(token?{"X-Store-Preview-Token":token}:{})},cache:"no-store",signal:AbortSignal.timeout(15000)})
      if (response.status === 423 && !token) return result
      if (!response.ok) throw Error("visibility")
      const document = await response.json()
      if (!Array.isArray(document.hidden_paths)) throw Error("contract")
      if (hiddenPath(path,document.hidden_paths)) return new NextResponse("Cette page n’est pas disponible.",{status:404,headers:{"Cache-Control":"private, no-store","X-Robots-Tag":"noindex, nofollow"}})
    } catch { return new NextResponse("Cette page est momentanément indisponible.",{status:503,headers:{"Cache-Control":"private, no-store"}}) }
  }
  return result
}
export const config = {matcher:["/((?!_next|favicon.ico|icon.svg|robots.txt|.*\\.(?:svg|png|jpg|jpeg|webp|avif|woff2|mp4|webm)$).*)"]}
