"use client"

import type { AnalyticsContext } from "@/types/api"

const ANON_KEY = "savage-rise-anonymous-id"
const SESSION_KEY = "savage-rise-session-id"
const PAGE_VIEW_KEY = "savage-rise-page-view-id"
const CHECKOUT_KEY = "savage-rise-checkout-id"
const DEDUPE_PREFIX = "savage-rise-analytics-dedupe:"
const FIRST_TOUCH_KEY = "savage-rise-first-touch"
const LAST_TOUCH_KEY = "savage-rise-last-touch"
const SESSION_TOUCH_KEY = "savage-rise-session-touch"

function createId(prefix: string) {
  const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`
  return `${prefix}_${id}`
}

function getOrCreateStorageValue(storage: Storage, key: string, prefix: string) {
  const current = storage.getItem(key)
  if (current) return current
  const next = createId(prefix)
  storage.setItem(key, next)
  return next
}

function localStore() {
  return typeof window === "undefined" ? null : window.localStorage
}

function sessionStore() {
  return typeof window === "undefined" ? null : window.sessionStorage
}

export function createEventId() {
  return createId("evt")
}

export function getOrCreateSessionId() {
  if (typeof window === "undefined") return createId("sess")
  return getOrCreateStorageValue(sessionStore()!, SESSION_KEY, "sess")
}

export function getCurrentPageViewId() {
  if (typeof window === "undefined") return null
  return sessionStore()!.getItem(PAGE_VIEW_KEY)
}

export function createPageView(_url?: string | URL | null) {
  const pageViewId = createId("pv")
  if (typeof window !== "undefined") sessionStore()!.setItem(PAGE_VIEW_KEY, pageViewId)
  return pageViewId
}

export function getOrCreateCheckoutId() {
  if (typeof window === "undefined") return createId("chk")
  return getOrCreateStorageValue(sessionStore()!, CHECKOUT_KEY, "chk")
}

export function clearCheckoutId() {
  if (typeof window !== "undefined") sessionStore()!.removeItem(CHECKOUT_KEY)
}

function readJson<T>(storage: Storage, key: string): T | null {
  const raw = storage.getItem(key)
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function writeJson(storage: Storage, key: string, value: unknown) {
  storage.setItem(key, JSON.stringify(value))
}

function getReferrerDomain(referrer: string | null) {
  if (!referrer) return null
  try {
    return new URL(referrer).hostname
  } catch {
    return null
  }
}

function isInternalReferrer(referrer: string | null) {
  const domain = getReferrerDomain(referrer)
  return !domain || domain === "savagerise.com" || domain.endsWith(".savagerise.com")
}

function buildAttribution() {
  if (typeof window === "undefined") return null
  const url = new URL(window.location.href)
  const referrer = document.referrer || null
  const referrerDomain = getReferrerDomain(referrer)
  const utmSource = url.searchParams.get("utm_source")
  const utmMedium = url.searchParams.get("utm_medium")
  const source = utmSource ?? (referrerDomain && !isInternalReferrer(referrer) ? referrerDomain : "direct")
  const medium = utmMedium ?? (source === "direct" ? "direct" : "referral")
  return {
    utm_source: utmSource,
    utm_medium: utmMedium,
    utm_campaign: url.searchParams.get("utm_campaign"),
    utm_content: url.searchParams.get("utm_content"),
    utm_term: url.searchParams.get("utm_term"),
    raw_referrer: referrer,
    referrer_domain: referrerDomain,
    landing_page: url.pathname,
    landing_url: `${url.pathname}${url.search}`,
    fbclid: url.searchParams.get("fbclid"),
    fbp: getCookie("_fbp"),
    fbc: getCookie("_fbc"),
    captured_at: new Date().toISOString(),
    source,
    medium,
    channel_group: medium === "paid_social" ? "paid_social" : medium,
  }
}

export function getFirstTouchAttribution() {
  if (typeof window === "undefined") return null
  return readJson<any>(localStore()!, FIRST_TOUCH_KEY)
}

export function getLastTouchAttribution() {
  if (typeof window === "undefined") return null
  return readJson<any>(localStore()!, LAST_TOUCH_KEY)
}

export function getSessionAttribution() {
  if (typeof window === "undefined") return null
  return readJson<any>(sessionStore()!, SESSION_TOUCH_KEY)
}

export function initializeAnalytics() {
  if (typeof window === "undefined") return null
  getOrCreateStorageValue(localStore()!, ANON_KEY, "anon")
  getOrCreateSessionId()
  if (!getCurrentPageViewId()) createPageView()
  const attribution = buildAttribution()
  if (attribution && (attribution.source !== "direct" || !isInternalReferrer(document.referrer || null))) {
    if (!getFirstTouchAttribution()) writeJson(localStore()!, FIRST_TOUCH_KEY, attribution)
    writeJson(localStore()!, LAST_TOUCH_KEY, attribution)
    writeJson(sessionStore()!, SESSION_TOUCH_KEY, attribution)
  } else if (!getSessionAttribution()) {
    const lastTouch = getLastTouchAttribution()
    if (lastTouch) writeJson(sessionStore()!, SESSION_TOUCH_KEY, lastTouch)
  }
  return getAnalyticsContext()
}

export function getAnalyticsContext(options?: { includeCheckoutId?: boolean }): AnalyticsContext {
  if (typeof window === "undefined") {
    return { anonymous_id: createId("anon"), session_id: createId("sess") }
  }
  const url = new URL(window.location.href)
  const firstTouch = getFirstTouchAttribution()
  const lastTouch = getLastTouchAttribution()
  const sessionTouch = getSessionAttribution()
  const source = sessionTouch?.source ?? url.searchParams.get("utm_source") ?? "direct"
  return {
    anonymous_id: getOrCreateStorageValue(localStore()!, ANON_KEY, "anon"),
    session_id: getOrCreateSessionId(),
    page_view_id: getCurrentPageViewId(),
    checkout_id: options?.includeCheckoutId ? getOrCreateCheckoutId() : sessionStore()!.getItem(CHECKOUT_KEY),
    page_url: window.location.href,
    page_path: window.location.pathname,
    referrer: document.referrer || null,
    source,
    medium: sessionTouch?.medium ?? url.searchParams.get("utm_medium") ?? (source === "direct" ? "direct" : "referral"),
    channel_group: sessionTouch?.channel_group ?? null,
    utm_source: sessionTouch?.utm_source ?? url.searchParams.get("utm_source"),
    utm_medium: sessionTouch?.utm_medium ?? url.searchParams.get("utm_medium"),
    utm_campaign: sessionTouch?.utm_campaign ?? url.searchParams.get("utm_campaign"),
    utm_content: sessionTouch?.utm_content ?? url.searchParams.get("utm_content"),
    utm_term: sessionTouch?.utm_term ?? url.searchParams.get("utm_term"),
    fbclid: url.searchParams.get("fbclid"),
    fbp: getCookie("_fbp"),
    fbc: getCookie("_fbc"),
    first_touch_attribution: firstTouch,
    last_touch_attribution: lastTouch,
    session_attribution: sessionTouch,
  }
}

function getCookie(name: string) {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

export function hasDeduplicationKeyBeenSent(key: string) {
  if (typeof window === "undefined") return false
  return localStore()!.getItem(`${DEDUPE_PREFIX}${key}`) === "1"
}

export function markDeduplicationKeySent(key: string) {
  if (typeof window !== "undefined") localStore()!.setItem(`${DEDUPE_PREFIX}${key}`, "1")
}
