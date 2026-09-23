export const GATEWAY_ORIGIN = "https://yovo-api-gateway-a8da1d8e66a3.herokuapp.com"
export const CORE_PREFIX = "/api/core"
export const CORE_SCHEMA_URL = `${GATEWAY_ORIGIN}/docs/schemas/core.json`

// Accept the gateway origin or its Core base, but never duplicate the prefix.
export function normalizeCoreBaseUrl(value = GATEWAY_ORIGIN) {
  const url = new URL(value)
  const pathname = url.pathname.replace(/\/+$/, "")
  if (!/^https?:$/.test(url.protocol) || url.username || url.password || url.search || url.hash ||
      (pathname !== "" && pathname !== CORE_PREFIX)) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL must be a gateway origin or end with /api/core")
  }
  return `${url.origin}${CORE_PREFIX}`
}

export function getApiBaseUrl() {
  return normalizeCoreBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL || GATEWAY_ORIGIN)
}

export function getStorefrontHeaders() {
  // Public store selection on both browser and SSR calls; never authorization.
  const value = process.env.NEXT_PUBLIC_STOREFRONT_DOMAIN || "savagerise.com"
  const url = new URL(value.includes("://") ? value : `https://${value}`)
  return { "X-Store-Domain": url.hostname.toLowerCase() }
}
