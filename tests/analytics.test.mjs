import test from "node:test"
import assert from "node:assert/strict"

import {
  clearCheckoutId,
  createPageView,
  getAnalyticsContext,
  getCurrentPageViewId,
  getFirstTouchAttribution,
  getOrCreateCheckoutId,
  getOrCreateSessionId,
  getSessionAttribution,
  initializeAnalytics,
} from "../lib/analytics-context.ts"
import { buildOrderPayload } from "../lib/order-payload.ts"

class MemoryStorage {
  constructor() {
    this.map = new Map()
  }

  clear() {
    this.map.clear()
  }

  getItem(key) {
    return this.map.has(key) ? this.map.get(key) : null
  }

  key(index) {
    return Array.from(this.map.keys())[index] ?? null
  }

  removeItem(key) {
    this.map.delete(key)
  }

  setItem(key, value) {
    this.map.set(key, String(value))
  }

  get length() {
    return this.map.size
  }
}

function setBrowserEnv({
  href = "https://savagerise.com/",
  referrer = "",
  cookie = "_fbp=fbp-cookie; _fbc=fbc-cookie",
} = {}) {
  const url = new URL(href)
  const localStorage = new MemoryStorage()
  const sessionStorage = new MemoryStorage()
  const fbqCalls = []

  global.window = {
    location: {
      href: url.toString(),
      pathname: url.pathname,
      search: url.search,
      hostname: url.hostname,
    },
    localStorage,
    sessionStorage,
    innerWidth: 1440,
    innerHeight: 900,
    screen: { width: 1440, height: 900 },
    fbq: (...args) => {
      fbqCalls.push(args)
    },
  }

  global.document = {
    title: "Savage Rise",
    referrer,
    cookie,
    visibilityState: "visible",
  }

  Object.defineProperty(global, "navigator", {
    configurable: true,
    writable: true,
    value: {
      language: "fr-FR",
      sendBeacon: () => true,
    },
  })

  return { localStorage, sessionStorage, fbqCalls }
}

function updateLocation(href, referrer = "") {
  const url = new URL(href)
  window.location.href = url.toString()
  window.location.pathname = url.pathname
  window.location.search = url.search
  window.location.hostname = url.hostname
  document.referrer = referrer
}

test("captures each Meta utm_content distinctly", () => {
  for (const utmContent of ["buggy_pants", "tshirt_oversize", "drop2_pack_video"]) {
    setBrowserEnv({
      href: `https://savagerise.com/?utm_source=meta&utm_medium=paid_social&utm_campaign=drop2_sales&utm_content=${utmContent}`,
      referrer: "https://www.facebook.com/",
    })

    initializeAnalytics()
    const attribution = getSessionAttribution()

    assert.equal(attribution?.utm_source, "meta")
    assert.equal(attribution?.utm_medium, "paid_social")
    assert.equal(attribution?.utm_campaign, "drop2_sales")
    assert.equal(attribution?.utm_content, utmContent)
  }
})

test("keeps attribution after navigation and refresh-like reinitialization", () => {
  setBrowserEnv({
    href: "https://savagerise.com/?utm_source=meta&utm_medium=paid_social&utm_campaign=drop2_sales&utm_content=buggy_pants",
    referrer: "https://www.facebook.com/",
  })

  initializeAnalytics()
  updateLocation("https://savagerise.com/products/hoodie", "https://savagerise.com/")
  initializeAnalytics()

  const afterNavigation = getSessionAttribution()
  assert.equal(afterNavigation?.utm_content, "buggy_pants")

  updateLocation("https://savagerise.com/products/hoodie", "https://savagerise.com/")
  initializeAnalytics()

  const afterRefresh = getSessionAttribution()
  assert.equal(afterRefresh?.utm_content, "buggy_pants")
})

test("internal and direct visits do not overwrite first touch", () => {
  setBrowserEnv({
    href: "https://savagerise.com/?utm_source=meta&utm_medium=paid_social&utm_campaign=drop2_sales&utm_content=tshirt_oversize",
    referrer: "https://www.instagram.com/",
  })

  initializeAnalytics()
  updateLocation("https://savagerise.com/checkout", "https://savagerise.com/products/shirt")
  initializeAnalytics()
  updateLocation("https://savagerise.com/", "")
  initializeAnalytics()

  const firstTouch = getFirstTouchAttribution()
  assert.equal(firstTouch?.utm_content, "tshirt_oversize")
  assert.equal(firstTouch?.utm_campaign, "drop2_sales")
})

test("analytics context exposes stable anonymous and session ids", () => {
  setBrowserEnv()

  const first = getAnalyticsContext()
  const second = getAnalyticsContext()

  assert.ok(first.anonymous_id)
  assert.ok(first.session_id)
  assert.equal(first.anonymous_id, second.anonymous_id)
  assert.equal(first.session_id, second.session_id)
  assert.equal(first.source, "direct")
})

test("page view ids stay stable until a real new page view is created", () => {
  setBrowserEnv()

  const firstPageViewId = createPageView("/products")
  assert.equal(getCurrentPageViewId(), firstPageViewId)

  const samePageContext = getAnalyticsContext()
  assert.equal(samePageContext.page_view_id, firstPageViewId)

  const secondPageViewId = createPageView("/checkout")
  assert.notEqual(secondPageViewId, firstPageViewId)
  assert.equal(getCurrentPageViewId(), secondPageViewId)
})

test("checkout id is stable until cleared", () => {
  setBrowserEnv()

  const firstCheckoutId = getOrCreateCheckoutId()
  const secondCheckoutId = getOrCreateCheckoutId()
  assert.equal(firstCheckoutId, secondCheckoutId)

  clearCheckoutId()
  const thirdCheckoutId = getOrCreateCheckoutId()
  assert.notEqual(thirdCheckoutId, firstCheckoutId)
})

test("order payload includes analytics ids, attribution, cookies and meta event id", () => {
  setBrowserEnv({
    href: "https://savagerise.com/checkout?utm_source=meta&utm_medium=paid_social&utm_campaign=drop2_sales&utm_content=drop2_pack_video&fbclid=abc123",
    referrer: "https://www.facebook.com/",
    cookie: "_fbp=fbp-cookie; _fbc=fbc-cookie",
  })

  initializeAnalytics()
  createPageView("/checkout")
  const analyticsContext = {
    ...getAnalyticsContext({ includeCheckoutId: true }),
    meta_event_id: "meta-event-123",
  }

  const payload = buildOrderPayload({
    items: [],
    packItems: [],
    shipping: {
      full_name: "Jane Doe",
      email: "jane@example.com",
      phone: "123",
      address_line1: "1 Main St",
      postal_code: "1000",
      city: "Tunis",
      country: "Tunisia",
    },
    analytics_context: analyticsContext,
    meta_event_id: "meta-event-123",
  })

  assert.equal(payload.session_id, analyticsContext.session_id)
  assert.equal(payload.checkout_id, analyticsContext.checkout_id)
  assert.equal(payload.page_view_id, analyticsContext.page_view_id)
  assert.equal(payload.utm_content, "drop2_pack_video")
  assert.equal(payload.fbp, "fbp-cookie")
  assert.equal(payload.fbc, "fbc-cookie")
  assert.equal(payload.meta_event_id, "meta-event-123")
  assert.equal(payload.meta?.event_id, "meta-event-123")
})
