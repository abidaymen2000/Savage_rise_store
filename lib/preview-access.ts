export function studioOrigin(value = process.env.NEXT_PUBLIC_STUDIO_ORIGIN): string | null {
  if (!value) return null
  try {
    const url = new URL(value)
    const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
    if (url.username || url.password || url.search || url.hash || url.pathname !== "/" || (url.protocol !== "https:" && !(local && url.protocol === "http:"))) return null
    return url.origin
  } catch { return null }
}

export function previewFrameAncestors() {
  const origin = studioOrigin()
  return `frame-ancestors 'self'${origin ? ` ${origin}` : ""}`
}

export type PreviewFailure = { status: number; code: string; error: string; retryable: boolean }
export function previewFailure(status: number, body?: unknown): PreviewFailure {
  const value = body as { code?: string; detail?: string | { code?: string }; message?: string } | null
  const code = value?.code || (typeof value?.detail === "object" ? value.detail?.code : "")
  if (code === "PREVIEW_EXPIRED" || value?.detail === "Preview token expired") return { status: 401, code: "PREVIEW_EXPIRED", error: "Your temporary access has expired. Open a new preview from Studio.", retryable: true }
  if (status === 401 || code === "PREVIEW_INVALID") return { status, code: "PREVIEW_INVALID", error: "This preview access is invalid. Open a new preview from Studio.", retryable: true }
  if (code === "STORE_NOT_INITIALIZED" || code === "TENANT_CORE_NOT_INITIALIZED") return { status: 409, code: "STORE_NOT_INITIALIZED", error: "Set up the store in Studio before opening a preview.", retryable: false }
  if (code === "STORE_CONTEXT_MISMATCH") return { status: 409, code, error: "This address does not match the preview store.", retryable: false }
  if (status === 403) return { status, code: "PREVIEW_FORBIDDEN", error: "Access to this business preview is denied.", retryable: false }
  if (status === 404 && code === "STORE_ID_UNKNOWN") return { status, code, error: "The store for this preview could not be found.", retryable: false }
  if (status === 404) return { status: 502, code: "PREVIEW_ROUTE_MISSING", error: "Preview is not configured correctly. Report this issue to your administrator.", retryable: false }
  if (status === 409 || status === 422) return { status, code: "PREVIEW_CONTENT_INVALID", error: "Review the store configuration or content in Studio.", retryable: false }
  if (status === 423) return { status, code: "PREVIEW_STORE_LOCKED", error: "Access to this closed store's draft is denied. Contact your administrator.", retryable: false }
  return { status: status === 504 ? 504 : 503, code: "PREVIEW_UNAVAILABLE", error: "Preview is temporarily unavailable. Please try again shortly.", retryable: true }
}

// Only called after Core authenticated the signature and tenant. Never replaces
// Core validation: the claim merely caps the browser cookie's lifetime.
export function verifiedPreviewLifetime(token: string, now = Date.now()): number {
  try {
    const claims = JSON.parse(Buffer.from(token.split(".")[0], "base64url").toString("utf8"))
    return Number.isFinite(claims.exp) ? Math.max(0, Math.min(1800, Math.floor(claims.exp - now / 1000))) : 0
  } catch { return 0 }
}

export function previewCookieHeader(name: string, token: string, secure: boolean, maxAge: number) {
  return name + '=' + encodeURIComponent(token) + '; Path=/; Max-Age=' + maxAge + '; HttpOnly; ' + (secure ? 'Secure; SameSite=None; Partitioned' : 'SameSite=Lax')
}
