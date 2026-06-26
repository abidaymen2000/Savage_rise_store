"use client"

type MetaPixelEventParams = Record<string, unknown>
type MetaPixelTrackOptions = {
  eventID?: string
}

const STANDARD_META_PIXEL_EVENTS = new Set([
  "AddPaymentInfo",
  "AddToCart",
  "AddToWishlist",
  "CompleteRegistration",
  "Contact",
  "CustomizeProduct",
  "Donate",
  "FindLocation",
  "InitiateCheckout",
  "Lead",
  "PageView",
  "Purchase",
  "Schedule",
  "Search",
  "StartTrial",
  "SubmitApplication",
  "Subscribe",
  "ViewContent",
])

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

export function trackMetaPixelEvent(eventName: string, params?: MetaPixelEventParams, options?: MetaPixelTrackOptions) {
  if (typeof window === "undefined" || !window.fbq) return
  const method = STANDARD_META_PIXEL_EVENTS.has(eventName) ? "track" : "trackCustom"
  if (options) {
    window.fbq(method, eventName, params ?? {}, options)
    return
  }
  window.fbq(method, eventName, params ?? {})
}

export function trackMetaPixelCustomEvent(eventName: string, params?: MetaPixelEventParams) {
  if (typeof window === "undefined" || !window.fbq) return
  window.fbq("trackCustom", eventName, params ?? {})
}
