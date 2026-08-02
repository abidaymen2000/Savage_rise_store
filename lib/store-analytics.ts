"use client"

import { api } from "@/lib/api"
import { createEventId, getAnalyticsContext, hasDeduplicationKeyBeenSent, initializeAnalytics, markDeduplicationKeySent } from "./analytics-context"
import type { StoreAnalyticsEventName, StoreAnalyticsEventPayload } from "@/types/api"

const SUPPORTED_INTERNAL_EVENTS: ReadonlySet<string> = new Set([
  "session_started",
  "page_view",
  "product_view",
  "add_to_cart",
  "checkout_started",
  "purchase",
])

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
    event_time: new Date().toISOString(),
    occurred_at: new Date().toISOString(),
    page_view_id: options.skip_page_view_id ? null : options.page_view_id ?? context.page_view_id ?? null,
    checkout_id: options.include_checkout_id ? options.checkout_id ?? context.checkout_id ?? null : options.checkout_id ?? null,
    device_type: options.device_type ?? deviceType(),
    user_id: options.user_id ?? null,
    revenue: options.revenue ?? options.value ?? null,
    metadata: {
      ...(options.metadata ?? {}),
      ...(options.items ? { items: options.items } : {}),
    },
  }
}

export function trackStoreEvent(eventName: StoreAnalyticsEventName | string, options: TrackOptions = {}) {
  if (typeof window === "undefined") return { eventId: options.event_id ?? null, payload: null }
  initializeAnalytics()
  if (!SUPPORTED_INTERNAL_EVENTS.has(eventName)) {
    return { eventId: options.event_id ?? null, payload: null }
  }
  if (options.deduplication_key && hasDeduplicationKeyBeenSent(options.deduplication_key)) {
    return { eventId: options.event_id ?? null, payload: null }
  }
  const payload = buildPayload(eventName, options)
  if (options.deduplication_key) markDeduplicationKeySent(options.deduplication_key)
  api.trackAnalyticsEvent(payload).catch((error) => {
    if (process.env.NODE_ENV !== "production") {
      const status = typeof error === "object" && error && "status" in error ? (error as { status?: unknown }).status : null
      const message = error instanceof Error ? error.message : "Analytics request failed"
      console.warn("Store analytics event failed", {
        event_name: payload.event_name,
        status,
        message,
      })
    }
  })
  return { eventId: payload.event_id ?? null, payload }
}

export const trackEvent = trackStoreEvent
