"use client"

import { api } from "@/lib/api"
import { AnalyticsTransportError, getStorefrontAnalyticsUrl } from "@/lib/api/analytics-api"
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

type TrackOptions = Omit<StoreAnalyticsEventPayload, "event_name" | "items"> & {
  items?: unknown[]
  include_checkout_id?: boolean
  skip_page_view_id?: boolean
  use_beacon?: boolean
  throw_errors?: boolean
}

type TrackResult = {
  eventId: string | null
  payload: StoreAnalyticsEventPayload | null
  request: Promise<unknown> | null
}

function deviceType() {
  if (typeof window === "undefined") return null
  if (window.innerWidth < 768) return "mobile"
  if (window.innerWidth < 1024) return "tablet"
  return "desktop"
}

function userAgent() {
  if (typeof navigator === "undefined") return null
  return navigator.userAgent || null
}

function buildPayload(eventName: StoreAnalyticsEventName | string, options: TrackOptions = {}): StoreAnalyticsEventPayload {
  const context = getAnalyticsContext()
  const eventId = options.event_id ?? createEventId()
  const resolvedDeviceType = options.device_type ?? deviceType()
  const pageUrl = options.page_url ?? context.page_url ?? null
  const pagePath = options.page_path ?? context.page_path ?? null
  const pageTitle = options.page_title ?? null
  const referrer = options.referrer ?? context.referrer ?? ""
  const source = options.source ?? context.source ?? "direct"
  const utmSource = options.utm_source ?? context.utm_source ?? null
  const utmMedium = options.utm_medium ?? context.utm_medium ?? null
  const utmCampaign = options.utm_campaign ?? context.utm_campaign ?? null
  const utmContent = options.utm_content ?? context.utm_content ?? null
  const utmTerm = options.utm_term ?? context.utm_term ?? null
  const fbclid = options.fbclid ?? context.fbclid ?? null
  const fbp = options.fbp ?? context.fbp ?? null
  const fbc = options.fbc ?? context.fbc ?? null
  const landingPage =
    typeof context.session_attribution === "object" && context.session_attribution
      ? (context.session_attribution as { landing_page?: string | null }).landing_page ?? null
      : null
  const landingUrl =
    typeof context.session_attribution === "object" && context.session_attribution
      ? (context.session_attribution as { landing_url?: string | null }).landing_url ?? null
      : null

  return {
    event_name: eventName,
    event_id: eventId,
    event_version: 1,
    event_source: "storefront",
    event_time: new Date().toISOString(),
    occurred_at: new Date().toISOString(),
    anonymous_id: options.anonymous_id ?? context.anonymous_id ?? null,
    session_id: options.session_id ?? context.session_id ?? null,
    page_view_id: options.skip_page_view_id ? null : options.page_view_id ?? context.page_view_id ?? null,
    checkout_id: options.include_checkout_id ? options.checkout_id ?? context.checkout_id ?? null : options.checkout_id ?? null,
    user_id: options.user_id ?? null,
    product_id: options.product_id ?? null,
    variant_id: options.variant_id ?? null,
    order_id: options.order_id ?? null,
    currency: options.currency ?? "TND",
    value: options.value ?? null,
    revenue: options.revenue ?? options.value ?? null,
    page_url: pageUrl,
    page_path: pagePath,
    page_title: pageTitle,
    action_target: options.action_target ?? null,
    source,
    utm_source: utmSource,
    utm_medium: utmMedium,
    utm_campaign: utmCampaign,
    utm_content: utmContent,
    utm_term: utmTerm,
    device_type: resolvedDeviceType,
    fbclid,
    fbp,
    fbc,
    landing_page: landingPage,
    landing_url: landingUrl,
    referrer,
    context: {
      page_url: pageUrl,
      page_path: pagePath,
      page_title: pageTitle,
      landing_page: landingPage,
      landing_url: landingUrl,
      referrer,
      device_type: resolvedDeviceType,
      user_agent: userAgent(),
    },
    attribution: {
      source,
      medium: utmMedium ?? context.medium ?? null,
      campaign: utmCampaign,
      content: utmContent,
      term: utmTerm,
      channel_group: context.channel_group ?? null,
      fbclid,
      fbp,
      fbc,
    },
    items: options.items as Array<Record<string, unknown>> | undefined,
    metadata: {
      ...(options.metadata ?? {}),
    },
    properties: options.properties ?? {},
  }
}

function isAnalyticsDebugEnabled() {
  if (typeof window === "undefined") return false
  try {
    const params = new URLSearchParams(window.location.search)
    return params.get("analytics_debug") === "1" || window.localStorage.getItem("sr_analytics_debug") === "1"
  } catch {
    return false
  }
}

function logAnalyticsDebug(payload: StoreAnalyticsEventPayload, error: unknown) {
  if (!isAnalyticsDebugEnabled()) return

  const status = error instanceof AnalyticsTransportError ? error.status ?? null : null
  let url = error instanceof AnalyticsTransportError ? error.url ?? null : null
  if (!url) {
    try {
      url = getStorefrontAnalyticsUrl()
    } catch (urlError) {
      url = urlError instanceof Error ? urlError.message : "analytics_url_unavailable"
    }
  }
  const response = error instanceof AnalyticsTransportError ? error.response ?? "" : error instanceof Error ? error.message : "Analytics request failed"

  console.warn(
    `[SR Analytics] ${payload.event_name}\nPOST ${url}\nstatus=${status ?? "network_error"}\nresponse=${response}`,
  )
}

export function trackStoreEvent(eventName: StoreAnalyticsEventName | string, options: TrackOptions = {}): TrackResult {
  if (typeof window === "undefined") return { eventId: options.event_id ?? null, payload: null, request: null }
  initializeAnalytics()
  if (!SUPPORTED_INTERNAL_EVENTS.has(eventName)) {
    return { eventId: options.event_id ?? null, payload: null, request: null }
  }
  if (options.deduplication_key && hasDeduplicationKeyBeenSent(options.deduplication_key)) {
    return { eventId: options.event_id ?? null, payload: null, request: null }
  }
  const payload = buildPayload(eventName, options)
  if (options.deduplication_key) markDeduplicationKeySent(options.deduplication_key)
  const request = api.trackAnalyticsEvent(payload).catch((error) => {
    logAnalyticsDebug(payload, error)
    if (process.env.NODE_ENV !== "production") {
      const status = typeof error === "object" && error && "status" in error ? (error as { status?: unknown }).status : null
      const message = error instanceof Error ? error.message : "Analytics request failed"
      console.warn("Store analytics event failed", {
        event_name: payload.event_name,
        status,
        message,
      })
    }
    if (options.throw_errors) throw error
  })
  return { eventId: payload.event_id ?? null, payload, request }
}

export const trackEvent = trackStoreEvent
export const trackInternalEvent = trackStoreEvent
