"use client"

import {
  createEventId,
  getAnalyticsContext,
  hasDeduplicationKeyBeenSent,
  initializeAnalytics,
  markDeduplicationKeySent,
} from "./analytics-context"
import type { AnalyticsItem, StoreAnalyticsEventName, StoreAnalyticsEventPayload } from "@/types/api"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  (process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://savage-rise-backend-8f0f0a23c13f.herokuapp.com")

const RECENT_EVENT_DEDUPE_MS = 1200
const recentEventMap = new Map<string, number>()

type TrackStoreEventOptions = Omit<
  StoreAnalyticsEventPayload,
  | "event_name"
  | "event_id"
  | "event_version"
  | "event_source"
  | "occurred_at"
  | "anonymous_id"
  | "session_id"
  | "page_view_id"
  | "checkout_id"
  | "referrer"
  | "source"
  | "channel_group"
  | "utm_source"
  | "utm_medium"
  | "utm_campaign"
  | "utm_content"
  | "utm_term"
  | "fbclid"
  | "fbp"
  | "fbc"
  | "has_account"
> & {
  deduplication_key?: string | null
  items?: AnalyticsItem[]
  event_id?: string | null
  include_checkout_id?: boolean
  skip_page_view_id?: boolean
  use_beacon?: boolean
}

function getDeviceType() {
  const width = window.innerWidth
  if (width < 768) return "mobile"
  if (width < 1024) return "tablet"
  return "desktop"
}

function getConnectionMetadata() {
  const nav = navigator as Navigator & {
    connection?: {
      effectiveType?: string
      downlink?: number
      saveData?: boolean
    }
  }

  return {
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    screen: {
      width: window.screen.width,
      height: window.screen.height,
    },
    connection: nav.connection
      ? {
          effective_type: nav.connection.effectiveType,
          downlink: nav.connection.downlink,
          save_data: nav.connection.saveData,
        }
      : null,
  }
}

function getDefaultEventCategory(eventName: string) {
  if (eventName.startsWith("session_")) return "session"
  if (eventName.startsWith("page_")) return "navigation"
  if (eventName.startsWith("user_")) return "engagement"
  if (eventName.includes("cart") || eventName.includes("checkout") || eventName.includes("order")) return "commerce"
  if (eventName.includes("product") || eventName.includes("collection") || eventName.includes("wishlist")) return "catalog"
  if (eventName.includes("form")) return "form"
  if (eventName.includes("button") || eventName.includes("clicked") || eventName.includes("selected")) return "interaction"
  return "custom"
}

function shouldSkipRecentDuplicate(eventName: string, options: TrackStoreEventOptions) {
  const key = JSON.stringify({
    eventName,
    event_category: options.event_category ?? null,
    product_id: options.product_id ?? null,
    variant_id: options.variant_id ?? null,
    order_id: options.order_id ?? null,
    action_target: options.action_target ?? null,
    page_path: options.page_path ?? null,
    deduplication_key: options.deduplication_key ?? null,
  })

  const now = Date.now()
  const previous = recentEventMap.get(key)
  recentEventMap.set(key, now)

  return typeof previous === "number" && now - previous < RECENT_EVENT_DEDUPE_MS
}

function buildPayload(eventName: StoreAnalyticsEventName | string, options: TrackStoreEventOptions = {}) {
  initializeAnalytics()

  const token = localStorage.getItem("savage_rise_token")
  const occurredAt = new Date().toISOString()
  const eventId = options.event_id ?? createEventId()
  const context = getAnalyticsContext({
    includeCheckoutId: options.include_checkout_id,
    eventId,
    pageViewId: options.skip_page_view_id ? null : undefined,
  })
  const pagePath = context.page_path ?? `${window.location.pathname}${window.location.search}`
  const items = options.items ?? []

  const payload: StoreAnalyticsEventPayload = {
    event_name: eventName,
    event_id: eventId,
    event_version: 1,
    event_source: "web",
    occurred_at: occurredAt,
    anonymous_id: context.anonymous_id,
    session_id: context.session_id,
    page_view_id: context.page_view_id,
    checkout_id: context.checkout_id,
    event_category: options.event_category ?? getDefaultEventCategory(eventName),
    product_id: options.product_id ?? null,
    variant_id: options.variant_id ?? null,
    order_id: options.order_id ?? null,
    page_path: options.page_path ?? pagePath,
    page_title: options.page_title ?? document.title,
    action_target: options.action_target ?? null,
    device_type: options.device_type ?? getDeviceType(),
    currency: options.currency ?? null,
    value: options.value ?? null,
    referrer: context.referrer,
    source: context.source,
    channel_group: context.channel_group,
    utm_source: context.utm_source,
    utm_medium: context.utm_medium,
    utm_campaign: context.utm_campaign,
    utm_content: context.utm_content,
    utm_term: context.utm_term,
    fbclid: context.fbclid,
    fbp: context.fbp,
    fbc: context.fbc,
    deduplication_key: options.deduplication_key ?? null,
    has_account: Boolean(token),
    properties: {
      items,
      landing_page: context.landing_page,
      landing_url: context.landing_url,
      first_touch_attribution: context.first_touch_attribution,
      last_touch_attribution: context.last_touch_attribution,
      session_attribution: context.session_attribution,
      medium: context.medium,
      ...options.properties,
    },
    metadata: {
      page_path: pagePath,
      path: window.location.pathname,
      search: window.location.search,
      title: document.title,
      url: context.page_url,
      landing_page: context.landing_page,
      landing_url: context.landing_url,
      first_touch_attribution: context.first_touch_attribution,
      last_touch_attribution: context.last_touch_attribution,
      session_attribution: context.session_attribution,
      occurred_at: occurredAt,
      ...getConnectionMetadata(),
      ...(options.metadata ?? {}),
    },
  }

  return { eventId, payload, token }
}

function sendEvent(payload: StoreAnalyticsEventPayload, token: string | null, useBeacon = false) {
  const url = `${API_BASE_URL}/analytics/events`
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const body = JSON.stringify(payload)

  if (useBeacon && typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function" && !token) {
    try {
      const blob = new Blob([body], { type: "application/json" })
      navigator.sendBeacon(url, blob)
      return
    } catch {
    }
  }

  void fetch(url, {
    method: "POST",
    headers,
    body,
    keepalive: true,
  }).catch(() => {})
}

export function trackStoreEvent(eventName: StoreAnalyticsEventName | string, options: TrackStoreEventOptions = {}) {
  if (typeof window === "undefined") return { eventId: null, payload: null }

  try {
    if (options.deduplication_key && hasDeduplicationKeyBeenSent(options.deduplication_key)) {
      return { eventId: null, payload: null }
    }

    if (shouldSkipRecentDuplicate(eventName, options)) {
      return { eventId: null, payload: null }
    }

    const { eventId, payload, token } = buildPayload(eventName, options)
    sendEvent(payload, token, options.use_beacon)

    if (options.deduplication_key) {
      markDeduplicationKeySent(options.deduplication_key)
    }

    return { eventId, payload }
  } catch {
    return { eventId: null, payload: null }
  }
}

export const trackEvent = trackStoreEvent
