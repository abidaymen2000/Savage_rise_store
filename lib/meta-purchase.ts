"use client"

import { trackMetaPixelEvent } from "@/lib/meta-pixel"

const META_PURCHASE_PREFIX = "meta_purchase_sent:"

function getPurchaseStorageKey(orderId: string) {
  return `${META_PURCHASE_PREFIX}${orderId}`
}

export function hasMetaPurchaseBeenSent(orderId: string): boolean {
  if (typeof window === "undefined") return false
  return window.sessionStorage.getItem(getPurchaseStorageKey(orderId)) === "1"
}

export function markMetaPurchaseSent(orderId: string): void {
  if (typeof window === "undefined") return
  window.sessionStorage.setItem(getPurchaseStorageKey(orderId), "1")
}

export function trackPurchasePixelOnce(params: {
  orderId: string
  value: number
  currency: string
  content_ids: string[]
  contents: Array<Record<string, unknown>>
  num_items: number
}): boolean {
  if (hasMetaPurchaseBeenSent(params.orderId)) return false

  trackMetaPixelEvent(
    "Purchase",
    {
      value: params.value,
      currency: params.currency,
      order_id: params.orderId,
      content_ids: params.content_ids,
      contents: params.contents,
      num_items: params.num_items,
    },
    {
      eventID: `purchase:${params.orderId}`,
    },
  )
  markMetaPurchaseSent(params.orderId)
  return true
}
