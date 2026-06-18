"use client"

import type { StoreAnalyticsEventName, StoreAnalyticsEventPayload } from "@/types/api"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  (process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://savage-rise-backend-8f0f0a23c13f.herokuapp.com")

const ANONYMOUS_ID_KEY = "savage_rise_anonymous_id"
const SESSION_ID_KEY = "savage_rise_session_id"

type TrackStoreEventOptions = Omit<
  StoreAnalyticsEventPayload,
  "event_name" | "anonymous_id" | "session_id" | "referrer" | "source" | "utm_campaign" | "has_account"
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

export function trackStoreEvent(eventName: StoreAnalyticsEventName | string, options: TrackStoreEventOptions = {}) {
  if (typeof window === "undefined") return

  try {
    const token = localStorage.getItem("savage_rise_token")
    const searchParams = new URLSearchParams(window.location.search)
    const referrer = document.referrer || null

    const payload: StoreAnalyticsEventPayload = {
      event_name: eventName,
      anonymous_id: getStoredId(localStorage, ANONYMOUS_ID_KEY, "anon"),
      session_id: getStoredId(sessionStorage, SESSION_ID_KEY, "sess"),
      referrer,
      source: getTrafficSource(searchParams, referrer ?? ""),
      utm_campaign: searchParams.get("utm_campaign"),
      has_account: Boolean(token),
      ...options,
      metadata: {
        path: window.location.pathname,
        search: window.location.search,
        title: document.title,
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
