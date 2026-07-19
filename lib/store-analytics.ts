"use client"

import { api } from "@/lib/api"
import { createEventId, getAnalyticsContext, hasDeduplicationKeyBeenSent, initializeAnalytics, markDeduplicationKeySent } from "./analytics-context"
import type { StoreAnalyticsEventName, StoreAnalyticsEventPayload } from "@/types/api"

type TrackOptions = Omit<StoreAnalyticsEventPayload, "event_name"> & {
  items?: unknown[]
  include_checkout_id?: boolean
  skip_page_view_id?: boolean
  use_beacon?: boolean
}

function deviceType() {
  if (typeof window === "undefined") return null
  if (window.innerWidth < 768) return "mobile"
  if (window.innerWidth < 1024) return "tablet"
  return "desktop"
}

function buildPayload(eventName: StoreAnalyticsEventName | string, options: TrackOptions = {}): StoreAnalyticsEventPayload {
  const context = getAnalyticsContext()
  const eventId = options.event_id ?? createEventId()
  return {
    ...context,
    ...options,
    event_name: eventName,
    event_id: eventId,
    event_version: 1,
    event_source: "storefront",
    occurred_at: new Date().toISOString(),
    page_view_id: options.skip_page_view_id ? null : options.page_view_id ?? context.page_view_id ?? null,
    checkout_id: options.include_checkout_id ? options.checkout_id ?? context.checkout_id ?? null : options.checkout_id ?? null,
    device_type: options.device_type ?? deviceType(),
    metadata: {
      ...(options.metadata ?? {}),
      ...(options.items ? { items: options.items } : {}),
    },
  }
}

export function trackStoreEvent(eventName: StoreAnalyticsEventName | string, options: TrackOptions = {}) {
  if (typeof window === "undefined") return { eventId: options.event_id ?? null, payload: null }
  initializeAnalytics()
  if (options.deduplication_key && hasDeduplicationKeyBeenSent(options.deduplication_key)) {
    return { eventId: options.event_id ?? null, payload: null }
  }
  const payload = buildPayload(eventName, options)
  if (options.deduplication_key) markDeduplicationKeySent(options.deduplication_key)
  api.trackAnalyticsEvent(payload).catch(() => undefined)
  return { eventId: payload.event_id ?? null, payload }
}

export const trackEvent = trackStoreEvent

