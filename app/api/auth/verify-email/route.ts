import { getApiBaseUrl, getStorefrontHeaders } from "@/lib/api/gateway-config.mjs"

export const dynamic = "force-dynamic"

// A top-level browser navigation cannot attach X-Store-Domain. Relay only this
// operation server-side, keeping the verification token out of logs.
export async function GET(request: Request) {
  const incoming = new URL(request.url)
  const token = incoming.searchParams.get("token")
  const failure = () => Response.redirect(new URL("/email-verification-failed", incoming), 303)
  if (!token) return failure()
  try {
    const target = new URL(`${getApiBaseUrl()}/auth/verify-email`)
    target.searchParams.set("token", token)
    const response = await fetch(target, {
      headers: getStorefrontHeaders(), redirect: "manual", cache: "no-store",
    })
    const location = response.headers.get("location")
    if (![302, 303].includes(response.status) || !location) return failure()
    const redirect = new URL(location)
    const store = getStorefrontHeaders()["X-Store-Domain"]
    if (redirect.protocol !== "https:" || redirect.hostname !== store || redirect.port ||
        redirect.username || redirect.password ||
        !["/verify-success", "/email-verification-failed"].includes(redirect.pathname)) return failure()
    return new Response(null, { status: 303, headers: {
      Location: new URL(redirect.pathname + redirect.search, incoming).href,
      "Cache-Control": "no-store", "Referrer-Policy": "no-referrer",
    } })
  } catch { return failure() }
}
