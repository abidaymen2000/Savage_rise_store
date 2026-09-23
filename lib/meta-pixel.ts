"use client"

type MetaPixelEventParams = Record<string, unknown>
type MetaPixelTrackOptions = { eventID?: string }

const META_PIXEL_CURRENCY = "TND"

const STANDARD_META_PIXEL_EVENTS = new Set([
  "AddPaymentInfo",
  "AddToCart",
  "AddToWishlist",
  "CompleteRegistration",
  "Contact",
  "InitiateCheckout",
  "Lead",
  "PageView",
  "Purchase",
  "Search",
  "Subscribe",
  "ViewContent",
])

const ECOMMERCE_META_PIXEL_EVENTS = new Set([
  "AddToCart",
  "InitiateCheckout",
  "Purchase",
  "ViewContent",
])

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

function toMetaNumericValue(value: unknown) {
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined
  if (typeof value !== "string") return undefined
  const normalized = value.replace(",", ".").match(/-?\d+(?:\.\d+)?/)
  if (!normalized) return undefined
  const parsed = Number(normalized[0])
  return Number.isFinite(parsed) ? parsed : undefined
}

function sanitizeMetaPixelParams(eventName: string, params?: MetaPixelEventParams) {
  if (!params) return {}
  const sanitized: MetaPixelEventParams = { ...params }

  if (ECOMMERCE_META_PIXEL_EVENTS.has(eventName) && ("currency" in sanitized || "value" in sanitized)) {
    sanitized.currency = META_PIXEL_CURRENCY
  }

  if ("value" in sanitized) {
    const value = toMetaNumericValue(sanitized.value)
    if (value === undefined) {
      delete sanitized.value
    } else {
      sanitized.value = value
    }
  }

  return sanitized
}

export function trackMetaPixelEvent(eventName: string, params?: MetaPixelEventParams, options?: MetaPixelTrackOptions) {
  if (typeof window === "undefined" || !window.fbq) return
  const method = STANDARD_META_PIXEL_EVENTS.has(eventName) ? "track" : "trackCustom"
  const sanitizedParams = sanitizeMetaPixelParams(eventName, params)
  try {
    options ? window.fbq(method, eventName, sanitizedParams, options) : window.fbq(method, eventName, sanitizedParams)
  } catch { /* Analytics cannot prevent cart updates or order confirmation. */ }
}

export function trackMetaPixelCustomEvent(eventName: string, params?: MetaPixelEventParams) {
  if (typeof window === "undefined" || !window.fbq) return
  try { window.fbq("trackCustom", eventName, params ?? {}) } catch { /* optional analytics */ }
}
