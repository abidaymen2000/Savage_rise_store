const CHECKOUT_IDEMPOTENCY_KEY = "savage-rise-checkout-idempotency-key"
const CHECKOUT_IDEMPOTENCY_FINGERPRINT = "savage-rise-checkout-idempotency-fingerprint"

function canUseSessionStorage() {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined"
}

function createKey() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }

  return `checkout_${Date.now()}_${Math.random().toString(36).slice(2)}`
}

export function getStoredCheckoutIdempotencyKey(): string | null {
  if (!canUseSessionStorage()) return null
  return window.sessionStorage.getItem(CHECKOUT_IDEMPOTENCY_KEY)
}

export function getStoredCheckoutFingerprint(): string | null {
  if (!canUseSessionStorage()) return null
  return window.sessionStorage.getItem(CHECKOUT_IDEMPOTENCY_FINGERPRINT)
}

export function getOrCreateCheckoutIdempotencyKey(fingerprint?: string): string {
  const existing = getStoredCheckoutIdempotencyKey()
  const existingFingerprint = getStoredCheckoutFingerprint()
  if (existing && (!fingerprint || !existingFingerprint || existingFingerprint === fingerprint)) {
    return existing
  }

  if (existing && fingerprint && existingFingerprint && existingFingerprint !== fingerprint) {
    clearCheckoutIdempotencyKey()
  }

  const refreshed = getStoredCheckoutIdempotencyKey()
  if (refreshed) return refreshed

  const key = createKey()
  if (canUseSessionStorage()) {
    window.sessionStorage.setItem(CHECKOUT_IDEMPOTENCY_KEY, key)
    if (fingerprint) {
      window.sessionStorage.setItem(CHECKOUT_IDEMPOTENCY_FINGERPRINT, fingerprint)
    } else {
      window.sessionStorage.removeItem(CHECKOUT_IDEMPOTENCY_FINGERPRINT)
    }
  }
  return key
}

export function clearCheckoutIdempotencyKey(): void {
  if (!canUseSessionStorage()) return
  window.sessionStorage.removeItem(CHECKOUT_IDEMPOTENCY_KEY)
  window.sessionStorage.removeItem(CHECKOUT_IDEMPOTENCY_FINGERPRINT)
}
