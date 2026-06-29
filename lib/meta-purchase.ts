"use client"

import { trackMetaPixelEvent } from "./meta-pixel"

const META_PURCHASE_PREFIX = "meta_purchase_sent:"

function getPurchaseStorageKey(orderId: string, metaEventId: string) {
  return `${META_PURCHASE_PREFIX}${orderId}:${metaEventId}`
}

export function hasMetaPurchaseBeenSent(orderId: string, metaEventId: string): boolean {
  if (typeof window === "undefined") return false
  return window.localStorage.getItem(getPurchaseStorageKey(orderId, metaEventId)) === "1"
}

export function markMetaPurchaseSent(orderId: string, metaEventId: string): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(getPurchaseStorageKey(orderId, metaEventId), "1")
}

export function trackPurchasePixelOnce(params: {
  orderId: string
  metaEventId: string
  value: number
  currency: string
  content_ids: string[]
  contents: Array<Record<string, unknown>>
  num_items: number
}): boolean {
  if (hasMetaPurchaseBeenSent(params.orderId, params.metaEventId)) return false

  trackMetaPixelEvent(
    "Purchase",
    {
      value: params.value,
      currency: params.currency,
      order_id: params.orderId,
      content_ids: params.content_ids,
      contents: params.contents,
      content_type: "product",
      num_items: params.num_items,
    },
    {
      eventID: params.metaEventId,
    },
  )

  markMetaPurchaseSent(params.orderId, params.metaEventId)
  return true
}
