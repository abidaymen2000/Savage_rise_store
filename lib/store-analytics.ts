"use client"

import type { StoreAnalyticsEventName, StoreAnalyticsEventPayload } from "@/types/api"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  (process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://savage-rise-backend-8f0f0a23c13f.herokuapp.com")

const ANONYMOUS_ID_KEY = "savage_rise_anonymous_id"
const SESSION_ID_KEY = "savage_rise_session_id"
const SESSION_STARTED_AT_KEY = "savage_rise_session_started_at"

type TrackStoreEventOptions = Omit<
  StoreAnalyticsEventPayload,
  | "event_name"
  | "anonymous_id"
  | "session_id"
  | "referrer"
  | "source"
  | "utm_source"
  | "utm_medium"
  | "utm_campaign"
  | "has_account"
  | "device_type"
>

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`
}

function getStoredId(storage: Storage, key: string, prefix: string) {
  const existing = storage.getItem(key)
  if (existing) return existing
  const next = createId(prefix)
  storage.setItem(key, next)
  return next
}

function getSessionStartedAt() {
  const existing = sessionStorage.getItem(SESSION_STARTED_AT_KEY)
  if (existing) return existing
  const startedAt = new Date().toISOString()
  sessionStorage.setItem(SESSION_STARTED_AT_KEY, startedAt)
  return startedAt
}

function getTrafficSource(searchParams: URLSearchParams, referrer: string) {
  const utmSource = searchParams.get("utm_source")
  if (utmSource) return utmSource
  if (!referrer) return "direct"

  try {
    const referrerHost = new URL(referrer).hostname
    const currentHost = window.location.hostname
    return referrerHost === currentHost ? "internal" : referrerHost
  } catch {
    return "referral"
  }
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
  if (eventName.includes("cart") || eventName.includes("checkout") || eventName.includes("payment") || eventName.includes("order")) {
    return "commerce"
  }
  if (eventName.includes("product") || eventName.includes("collection") || eventName.includes("wishlist")) return "catalog"
  if (eventName.includes("login") || eventName.includes("logout") || eventName.includes("account")) return "account"
  if (eventName.includes("form")) return "form"
  if (eventName.includes("scroll")) return "engagement"
  if (eventName.includes("button") || eventName.includes("clicked") || eventName.includes("selected")) return "interaction"
  return "custom"
}

export function trackStoreEvent(eventName: StoreAnalyticsEventName | string, options: TrackStoreEventOptions = {}) {
  if (typeof window === "undefined") return

  try {
    const token = localStorage.getItem("savage_rise_token")
    const searchParams = new URLSearchParams(window.location.search)
    const referrer = document.referrer || null
    const pagePath = `${window.location.pathname}${window.location.search}`

    const payload: StoreAnalyticsEventPayload = {
      event_name: eventName,
      anonymous_id: getStoredId(localStorage, ANONYMOUS_ID_KEY, "anon"),
      session_id: getStoredId(sessionStorage, SESSION_ID_KEY, "sess"),
      event_category: getDefaultEventCategory(eventName),
      page_path: pagePath,
      page_title: document.title,
      device_type: getDeviceType(),
      referrer,
      source: getTrafficSource(searchParams, referrer ?? ""),
      utm_source: searchParams.get("utm_source"),
      utm_medium: searchParams.get("utm_medium"),
      utm_campaign: searchParams.get("utm_campaign"),
      has_account: Boolean(token),
      ...options,
      metadata: {
        page_path: pagePath,
        path: window.location.pathname,
        search: window.location.search,
        title: document.title,
        url: window.location.href,
        session_started_at: getSessionStartedAt(),
        occurred_at: new Date().toISOString(),
        ...getConnectionMetadata(),
        ...(options.metadata ?? {}),
      },
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    void fetch(`${API_BASE_URL}/analytics/events`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {})
  } catch {
  }
}

export const trackEvent = trackStoreEvent
