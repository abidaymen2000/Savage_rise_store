"use client"

import type { AnalyticsAttribution, AnalyticsContext } from "@/types/api"

const ANONYMOUS_ID_KEY = "savage_rise_anonymous_id"
const SESSION_ID_KEY = "savage_rise_session_id"
const SESSION_LAST_SEEN_AT_KEY = "savage_rise_session_last_seen_at"
const SESSION_STARTED_EVENT_KEY = "savage_rise_session_started_event_id"
const CURRENT_PAGE_VIEW_ID_KEY = "savage_rise_page_view_id"
const CURRENT_PAGE_VIEW_URL_KEY = "savage_rise_page_view_url"
const CHECKOUT_ID_KEY = "savage_rise_checkout_id"
const FIRST_TOUCH_KEY = "savage_rise_attribution_first_touch"
const LAST_TOUCH_KEY = "savage_rise_attribution_last_touch"
const SESSION_TOUCH_KEY = "savage_rise_attribution_session_touch"
const LAST_ATTRIBUTION_URL_KEY = "savage_rise_last_attribution_url"
const DEDUPE_PREFIX = "savage_rise_dedupe:"

const SESSION_TIMEOUT_MS = 30 * 60 * 1000
const STORE_HOSTS = new Set(["savagerise.com", "www.savagerise.com", "localhost", "127.0.0.1"])

type WebStorageKind = "localStorage" | "sessionStorage"

function getStorage(kind: WebStorageKind): Storage | null {
  if (typeof window === "undefined") return null
  try {
    return window[kind]
  } catch {
    return null
  }
}

function readJson<T>(kind: WebStorageKind, key: string): T | null {
  const storage = getStorage(kind)
  if (!storage) return null
  const raw = storage.getItem(key)
  if (!raw) return null

  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function writeJson(kind: WebStorageKind, key: string, value: unknown) {
  const storage = getStorage(kind)
  if (!storage) return
  storage.setItem(key, JSON.stringify(value))
}

function readString(kind: WebStorageKind, key: string): string | null {
  const storage = getStorage(kind)
  if (!storage) return null
  return storage.getItem(key)
}

function writeString(kind: WebStorageKind, key: string, value: string) {
  const storage = getStorage(kind)
  if (!storage) return
  storage.setItem(key, value)
}

function removeValue(kind: WebStorageKind, key: string) {
  const storage = getStorage(kind)
  if (!storage) return
  storage.removeItem(key)
}

function createUuid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null

  const prefix = `${name}=`
  const cookie = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix))

  if (!cookie) return null
  const value = cookie.slice(prefix.length)
  return value ? decodeURIComponent(value) : null
}

function buildFbc(fbclid: string | null) {
  if (!fbclid) return null
  return `fb.1.${Date.now()}.${fbclid}`
}

function normalizeString(value: string | null | undefined) {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  return trimmed || null
}

function getCurrentUrl() {
  if (typeof window === "undefined") return null
  return new URL(window.location.href)
}

function getCurrentPathWithSearch() {
  const url = getCurrentUrl()
  if (!url) return null
  return `${url.pathname}${url.search}`
}

function getCurrentHost() {
  const url = getCurrentUrl()
  return url?.hostname ?? null
}

function getReferrerDomain(referrer: string | null) {
  if (!referrer) return null

  try {
    return new URL(referrer).hostname
  } catch {
    return null
  }
}

function isInternalDomain(domain: string | null) {
  if (!domain) return false

  if (STORE_HOSTS.has(domain)) return true
  return domain.endsWith(".savagerise.com")
}

function hasCampaignData(url: URL) {
  return ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"].some((key) =>
    Boolean(url.searchParams.get(key)),
  )
}

function getNormalizedSource(utmSource: string | null, referrerDomain: string | null) {
  if (utmSource) return utmSource.toLowerCase()
  if (referrerDomain) return referrerDomain.toLowerCase()
  return "direct"
}

function getNormalizedMedium(utmMedium: string | null, referrerDomain: string | null) {
  if (utmMedium) return utmMedium.toLowerCase()
  if (referrerDomain) return "referral"
  return "direct"
}

function getChannelGroup(source: string, medium: string) {
  if (source === "meta" && medium === "paid_social") return "paid_social"
  if (medium === "referral") return "referral"
  if (medium === "direct" || source === "direct") return "direct"
  return medium || "other"
}

function buildAttribution(url: URL, referrer: string | null): AnalyticsAttribution {
  const referrerDomain = getReferrerDomain(referrer)
  const utmSource = normalizeString(url.searchParams.get("utm_source"))
  const utmMedium = normalizeString(url.searchParams.get("utm_medium"))
  const utmCampaign = normalizeString(url.searchParams.get("utm_campaign"))
  const utmContent = normalizeString(url.searchParams.get("utm_content"))
  const utmTerm = normalizeString(url.searchParams.get("utm_term"))
  const fbclid = normalizeString(url.searchParams.get("fbclid"))
  const fbp = normalizeString(readCookie("_fbp"))
  const cookieFbc = normalizeString(readCookie("_fbc"))
  const fbc = cookieFbc ?? buildFbc(fbclid)
  const source = getNormalizedSource(utmSource, referrerDomain)
  const medium = getNormalizedMedium(utmMedium, referrerDomain)

  return {
    utm_source: utmSource,
    utm_medium: utmMedium,
    utm_campaign: utmCampaign,
    utm_content: utmContent,
    utm_term: utmTerm,
    raw_referrer: normalizeString(referrer),
    referrer_domain: referrerDomain,
    landing_page: url.pathname,
    landing_url: `${url.pathname}${url.search}`,
    fbclid,
    fbp,
    fbc,
    captured_at: new Date().toISOString(),
    source,
    medium,
    channel_group: getChannelGroup(source, medium),
  }
}

function isValidExternalAttribution(url: URL, referrer: string | null) {
  if (hasCampaignData(url)) return true

  const referrerDomain = getReferrerDomain(referrer)
  if (!referrerDomain) return false
  return !isInternalDomain(referrerDomain)
}

function mergeKnownIdentifiers(
  current: AnalyticsAttribution,
  previous: AnalyticsAttribution | null,
): AnalyticsAttribution {
  return {
    ...current,
    fbclid: current.fbclid ?? previous?.fbclid ?? null,
    fbp: current.fbp ?? previous?.fbp ?? null,
    fbc: current.fbc ?? previous?.fbc ?? null,
  }
}

function refreshAttributionCookies(snapshot: AnalyticsAttribution | null) {
  if (!snapshot) return snapshot

  return {
    ...snapshot,
    fbp: normalizeString(readCookie("_fbp")) ?? snapshot.fbp ?? null,
    fbc: normalizeString(readCookie("_fbc")) ?? snapshot.fbc ?? null,
  }
}

export function getOrCreateAnonymousId() {
  const existing = readString("localStorage", ANONYMOUS_ID_KEY)
  if (existing) return existing

  const next = createUuid()
  writeString("localStorage", ANONYMOUS_ID_KEY, next)
  return next
}

export function touchSession() {
  const now = Date.now()
  const existingId = readString("sessionStorage", SESSION_ID_KEY)
  const lastSeenRaw = readString("sessionStorage", SESSION_LAST_SEEN_AT_KEY)
  const lastSeen = lastSeenRaw ? Number(lastSeenRaw) : null

  if (!existingId || !lastSeen || now - lastSeen > SESSION_TIMEOUT_MS) {
    const next = createUuid()
    writeString("sessionStorage", SESSION_ID_KEY, next)
    writeString("sessionStorage", SESSION_LAST_SEEN_AT_KEY, String(now))
    removeValue("sessionStorage", SESSION_STARTED_EVENT_KEY)
    removeValue("sessionStorage", SESSION_TOUCH_KEY)
    removeValue("sessionStorage", CHECKOUT_ID_KEY)

    const lastTouch = readJson<AnalyticsAttribution>("localStorage", LAST_TOUCH_KEY)
    if (lastTouch) {
      writeJson("sessionStorage", SESSION_TOUCH_KEY, lastTouch)
    }

    return next
  }

  writeString("sessionStorage", SESSION_LAST_SEEN_AT_KEY, String(now))
  return existingId
}

export function getOrCreateSessionId() {
  return touchSession()
}

export function createPageViewId() {
  return createUuid()
}

export function setCurrentPageView(pageViewId: string, url: string) {
  writeString("sessionStorage", CURRENT_PAGE_VIEW_ID_KEY, pageViewId)
  writeString("sessionStorage", CURRENT_PAGE_VIEW_URL_KEY, url)
}

export function createPageView(url?: string) {
  const pageViewId = createPageViewId()
  setCurrentPageView(pageViewId, url ?? getCurrentPathWithSearch() ?? "/")
  return pageViewId
}

export function getCurrentPageViewId() {
  return readString("sessionStorage", CURRENT_PAGE_VIEW_ID_KEY)
}

export function getCurrentPageViewUrl() {
  return readString("sessionStorage", CURRENT_PAGE_VIEW_URL_KEY)
}

export function getOrCreateCheckoutId() {
  const existing = readString("sessionStorage", CHECKOUT_ID_KEY)
  if (existing) return existing

  const next = createUuid()
  writeString("sessionStorage", CHECKOUT_ID_KEY, next)
  return next
}

export function clearCheckoutId() {
  removeValue("sessionStorage", CHECKOUT_ID_KEY)
}

export function createEventId() {
  return createUuid()
}

export function markDeduplicationKeySent(key: string) {
  writeString("sessionStorage", `${DEDUPE_PREFIX}${key}`, "1")
}

export function hasDeduplicationKeyBeenSent(key: string) {
  return readString("sessionStorage", `${DEDUPE_PREFIX}${key}`) === "1"
}

export function initializeAnalytics() {
  const url = getCurrentUrl()
  if (!url) return

  touchSession()
  const referrer = normalizeString(document.referrer)

  if (!isValidExternalAttribution(url, referrer)) {
    const sessionTouch = refreshAttributionCookies(readJson<AnalyticsAttribution>("sessionStorage", SESSION_TOUCH_KEY))
    if (sessionTouch) {
      writeJson("sessionStorage", SESSION_TOUCH_KEY, sessionTouch)
      writeJson("localStorage", LAST_TOUCH_KEY, sessionTouch)
    }
    return
  }

  const nextAttribution = mergeKnownIdentifiers(buildAttribution(url, referrer), readJson("localStorage", LAST_TOUCH_KEY))

  const firstTouch = readJson<AnalyticsAttribution>("localStorage", FIRST_TOUCH_KEY)
  if (!firstTouch) {
    writeJson("localStorage", FIRST_TOUCH_KEY, nextAttribution)
  }

  writeJson("localStorage", LAST_TOUCH_KEY, nextAttribution)
  writeJson("sessionStorage", SESSION_TOUCH_KEY, nextAttribution)
  writeString("sessionStorage", LAST_ATTRIBUTION_URL_KEY, url.toString())
}

export function getFirstTouchAttribution() {
  return refreshAttributionCookies(readJson<AnalyticsAttribution>("localStorage", FIRST_TOUCH_KEY))
}

export function getLastTouchAttribution() {
  return refreshAttributionCookies(readJson<AnalyticsAttribution>("localStorage", LAST_TOUCH_KEY))
}

export function getSessionAttribution() {
  return refreshAttributionCookies(
    readJson<AnalyticsAttribution>("sessionStorage", SESSION_TOUCH_KEY) ??
      readJson<AnalyticsAttribution>("localStorage", LAST_TOUCH_KEY),
  )
}

export function getAnalyticsContext(options?: {
  includeCheckoutId?: boolean
  eventId?: string | null
  pageViewId?: string | null
}) {
  if (typeof window === "undefined") {
    return {
      anonymous_id: "server",
      session_id: "server",
      page_view_id: options?.pageViewId ?? null,
      checkout_id: null,
      event_id: options?.eventId ?? null,
      page_url: null,
      page_path: null,
      referrer: null,
      first_touch_attribution: null,
      last_touch_attribution: null,
      session_attribution: null,
      landing_page: null,
      landing_url: null,
      fbclid: null,
      fbp: null,
      fbc: null,
      source: "direct",
      medium: "direct",
      channel_group: "direct",
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_content: null,
      utm_term: null,
    }
  }

  initializeAnalytics()

  const url = getCurrentUrl()
  const pathnameWithSearch = getCurrentPathWithSearch()
  const sessionAttribution = getSessionAttribution()

  const context: AnalyticsContext = {
    anonymous_id: getOrCreateAnonymousId(),
    session_id: getOrCreateSessionId(),
    page_view_id: options?.pageViewId ?? getCurrentPageViewId(),
    checkout_id: options?.includeCheckoutId ? getOrCreateCheckoutId() : readString("sessionStorage", CHECKOUT_ID_KEY),
    event_id: options?.eventId ?? null,
    page_url: url?.toString() ?? null,
    page_path: pathnameWithSearch,
    referrer: normalizeString(typeof document !== "undefined" ? document.referrer : null),
    first_touch_attribution: getFirstTouchAttribution(),
    last_touch_attribution: getLastTouchAttribution(),
    session_attribution: sessionAttribution,
    landing_page:
      sessionAttribution?.landing_page ??
      getFirstTouchAttribution()?.landing_page ??
      pathnameWithSearch ??
      null,
    landing_url:
      sessionAttribution?.landing_url ??
      getFirstTouchAttribution()?.landing_url ??
      pathnameWithSearch ??
      null,
    fbclid: sessionAttribution?.fbclid ?? null,
    fbp: sessionAttribution?.fbp ?? null,
    fbc: sessionAttribution?.fbc ?? null,
    source: sessionAttribution?.source ?? "direct",
    medium: sessionAttribution?.medium ?? "direct",
    channel_group: sessionAttribution?.channel_group ?? "direct",
    utm_source: sessionAttribution?.utm_source ?? null,
    utm_medium: sessionAttribution?.utm_medium ?? null,
    utm_campaign: sessionAttribution?.utm_campaign ?? null,
    utm_content: sessionAttribution?.utm_content ?? null,
    utm_term: sessionAttribution?.utm_term ?? null,
  }

  return context
}

export function hasSessionStartedEventBeenSent() {
  return Boolean(readString("sessionStorage", SESSION_STARTED_EVENT_KEY))
}

export function markSessionStartedEventSent(eventId: string) {
  writeString("sessionStorage", SESSION_STARTED_EVENT_KEY, eventId)
}
