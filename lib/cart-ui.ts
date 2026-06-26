"use client"

export const OPEN_CART_DRAWER_EVENT = "savage-rise:open-cart-drawer"

export function requestOpenCartDrawer(): void {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent(OPEN_CART_DRAWER_EVENT))
}
