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
  if (code === "PREVIEW_EXPIRED" || value?.detail === "Preview token expired") return { status: 401, code: "PREVIEW_EXPIRED", error: "Votre accès temporaire a expiré. Renouvelez l’aperçu depuis Studio.", retryable: true }
  if (status === 401 || code === "PREVIEW_INVALID") return { status, code: "PREVIEW_INVALID", error: "Cet accès d’aperçu n’est pas valide. Ouvrez un nouvel aperçu depuis Studio.", retryable: true }
  if (code === "STORE_NOT_INITIALIZED" || code === "TENANT_CORE_NOT_INITIALIZED") return { status: 409, code: "STORE_NOT_INITIALIZED", error: "La boutique doit être préparée dans Studio avant de pouvoir être prévisualisée.", retryable: false }
  if (code === "STORE_CONTEXT_MISMATCH") return { status: 409, code, error: "Cette adresse ne correspond pas à la boutique de l’aperçu.", retryable: false }
  if (status === 403) return { status, code: "PREVIEW_FORBIDDEN", error: "L’accès à l’aperçu de cette entreprise est refusé.", retryable: false }
  if (status === 404 && code === "STORE_ID_UNKNOWN") return { status, code, error: "La boutique associée à cet aperçu est introuvable.", retryable: false }
  if (status === 404) return { status: 502, code: "PREVIEW_ROUTE_MISSING", error: "Le service d’aperçu est mal configuré. Signalez ce problème à votre administrateur.", retryable: false }
  if (status === 409 || status === 422) return { status, code: "PREVIEW_CONTENT_INVALID", error: "La configuration ou le contenu de la boutique doit être vérifié dans Studio.", retryable: false }
  if (status === 423) return { status, code: "PREVIEW_STORE_LOCKED", error: "Le service refuse l’accès au brouillon de cette boutique fermée. Contactez votre administrateur.", retryable: false }
  return { status: status === 504 ? 504 : 503, code: "PREVIEW_UNAVAILABLE", error: "Le service d’aperçu est temporairement indisponible. Réessayez dans un instant.", retryable: true }
}

// Only called after Core authenticated the signature and tenant. Never replaces
// Core validation: the claim merely caps the browser cookie's lifetime.
export function verifiedPreviewLifetime(token: string, now = Date.now()): number {
  try {
    const claims = JSON.parse(Buffer.from(token.split(".")[0], "base64url").toString("utf8"))
    return Number.isFinite(claims.exp) ? Math.max(0, Math.min(1800, Math.floor(claims.exp - now / 1000))) : 0
  } catch { return 0 }
}
