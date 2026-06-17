"use client"

type MetaPixelEventParams = Record<string, unknown>

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

export function trackMetaPixelEvent(eventName: string, params?: MetaPixelEventParams) {
  if (typeof window === "undefined" || !window.fbq) return
  window.fbq("track", eventName, params ?? {})
}

export function trackMetaPixelCustomEvent(eventName: string, params?: MetaPixelEventParams) {
  if (typeof window === "undefined" || !window.fbq) return
  window.fbq("trackCustom", eventName, params ?? {})
}
