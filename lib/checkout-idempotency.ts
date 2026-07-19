const KEY = "savage-rise-checkout-idempotency-key"
const FINGERPRINT_KEY = "savage-rise-checkout-fingerprint"

export function createCheckoutIdempotencyKey() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function getStoredCheckoutIdempotencyKey() {
  if (typeof window === "undefined") return null
  return window.sessionStorage.getItem(KEY)
}

export function getStoredCheckoutFingerprint() {
  if (typeof window === "undefined") return null
  return window.sessionStorage.getItem(FINGERPRINT_KEY)
}

export function getOrCreateCheckoutIdempotencyKey(fingerprint?: string | null) {
  if (typeof window === "undefined") return createCheckoutIdempotencyKey()
  const storedFingerprint = window.sessionStorage.getItem(FINGERPRINT_KEY)
  if (fingerprint && storedFingerprint !== fingerprint) {
    const next = createCheckoutIdempotencyKey()
    window.sessionStorage.setItem(KEY, next)
    window.sessionStorage.setItem(FINGERPRINT_KEY, fingerprint)
    return next
  }
  const current = window.sessionStorage.getItem(KEY)
  if (current) return current
  const next = createCheckoutIdempotencyKey()
  window.sessionStorage.setItem(KEY, next)
  if (fingerprint) window.sessionStorage.setItem(FINGERPRINT_KEY, fingerprint)
  return next
}

export function clearCheckoutIdempotencyKey() {
  if (typeof window !== "undefined") window.sessionStorage.removeItem(KEY)
}
