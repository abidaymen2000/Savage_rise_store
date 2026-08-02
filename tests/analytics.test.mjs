import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

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
import { getStorefrontAnalyticsEndpoint, setStorefrontAnalyticsSlug } from "../lib/api/analytics-api.ts"
import { api } from "../lib/api/index.ts"
import { buildOrderPayload } from "../lib/order-payload.ts"
import { trackStoreEvent } from "../lib/store-analytics.ts"

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

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

function captureInternalAnalytics() {
  const sent = []
  const previous = api.trackAnalyticsEvent
  api.trackAnalyticsEvent = async (payload) => {
    sent.push(payload)
  }
  return {
    sent,
    restore() {
      api.trackAnalyticsEvent = previous
    },
  }
}

test("uses the tenant-scoped Savage Rise analytics endpoint", () => {
  setStorefrontAnalyticsSlug("savage-rise")
  assert.equal(getStorefrontAnalyticsEndpoint(), "/analytics/savage-rise/events")

  setStorefrontAnalyticsSlug("")
  assert.equal(getStorefrontAnalyticsEndpoint(), "/analytics/savage-rise/events")
})

test("storefront source has no remaining direct event post to the legacy analytics endpoint", () => {
  const sourceFiles = [
    "app",
    "contexts",
    "lib",
    "types",
    "tests",
  ].flatMap((entry) => {
    const root = path.join(projectRoot, entry)
    const files = []
    const stack = [root]
    while (stack.length > 0) {
      const current = stack.pop()
      for (const item of fs.readdirSync(current, { withFileTypes: true })) {
        const fullPath = path.join(current, item.name)
        if (item.isDirectory()) {
          stack.push(fullPath)
        } else if (/\.(ts|tsx|mjs|md)$/.test(item.name)) {
          files.push(fullPath)
        }
      }
    }
    return files
  })

  const offenders = sourceFiles.filter((file) => {
    if (file.endsWith(path.join("tests", "analytics.test.mjs"))) return false
    const content = fs.readFileSync(file, "utf8")
    return /url:\s*["']\/analytics\/events["']/.test(content) || /POST \/analytics\/events\b/.test(content)
  })

  assert.deepEqual(offenders, [])
})

test("storefront tracking calls do not use legacy internal event names", () => {
  const trackingFiles = [
    "app",
    "contexts",
    "lib/store-analytics.ts",
  ].flatMap((entry) => {
    const root = path.join(projectRoot, entry)
    if (fs.statSync(root).isFile()) return [root]
    const files = []
    const stack = [root]
    while (stack.length > 0) {
      const current = stack.pop()
      for (const item of fs.readdirSync(current, { withFileTypes: true })) {
        const fullPath = path.join(current, item.name)
        if (item.isDirectory()) {
          stack.push(fullPath)
        } else if (/\.(ts|tsx)$/.test(item.name)) {
          files.push(fullPath)
        }
      }
    }
    return files
  })

  const offenders = trackingFiles.filter((file) => {
    const content = fs.readFileSync(file, "utf8")
    return /track(?:Store)?Event\(["'](?:page_viewed|product_viewed|order_created)["']/.test(content)
  })

  assert.deepEqual(offenders, [])
})

test("Meta Pixel standard events remain unchanged", () => {
  const files = [
    "app/products/[id]/ProductDetailClient.tsx",
    "app/packs/[id]/page.tsx",
    "contexts/CartContext.tsx",
    "app/checkout/page.tsx",
    "lib/meta-purchase.ts",
  ]
    .map((file) => fs.readFileSync(path.join(projectRoot, file), "utf8"))
    .join("\n")

  for (const eventName of ["ViewContent", "AddToCart", "InitiateCheckout", "Purchase"]) {
    assert.match(files, new RegExp(`["']${eventName}["']`))
  }
})

test("page_view is sent for navigation with the current page path", () => {
  setBrowserEnv({ href: "https://savagerise.com/products/hoodie?utm_source=meta&utm_campaign=drop2" })
  const analytics = captureInternalAnalytics()
  try {
    const result = trackStoreEvent("page_view", {
      page_path: "/products/hoodie?utm_source=meta&utm_campaign=drop2",
      currency: "TND",
      deduplication_key: "page_view:test",
    })

    assert.ok(result.eventId)
    assert.equal(analytics.sent.length, 1)
    assert.equal(analytics.sent[0].event_name, "page_view")
    assert.equal(analytics.sent[0].page_path, "/products/hoodie?utm_source=meta&utm_campaign=drop2")
    assert.equal(analytics.sent[0].utm_source, "meta")
    assert.equal(analytics.sent[0].utm_campaign, "drop2")
  } finally {
    analytics.restore()
  }
})

test("product_view contains product_id", () => {
  setBrowserEnv()
  const analytics = captureInternalAnalytics()
  try {
    trackStoreEvent("product_view", {
      product_id: "prod_hoodie",
      variant_id: "variant_black_m",
      currency: "TND",
      value: 179,
    })

    assert.equal(analytics.sent[0].event_name, "product_view")
    assert.equal(analytics.sent[0].product_id, "prod_hoodie")
  } finally {
    analytics.restore()
  }
})

test("add_to_cart contains product_id and variant_id", () => {
  setBrowserEnv()
  const analytics = captureInternalAnalytics()
  try {
    trackStoreEvent("add_to_cart", {
      product_id: "prod_tee",
      variant_id: "variant_white_l",
      currency: "TND",
      value: 89,
    })

    assert.equal(analytics.sent[0].event_name, "add_to_cart")
    assert.equal(analytics.sent[0].product_id, "prod_tee")
    assert.equal(analytics.sent[0].variant_id, "variant_white_l")
  } finally {
    analytics.restore()
  }
})

test("checkout_started contains the real cart items", () => {
  setBrowserEnv()
  const analytics = captureInternalAnalytics()
  const items = [
    {
      product_id: "prod_pants",
      variant_id: "variant_black_s",
      quantity: 2,
      unit_price: 149,
      line_total: 298,
      currency: "TND",
    },
  ]
  try {
    trackStoreEvent("checkout_started", {
      include_checkout_id: true,
      currency: "TND",
      value: 298,
      items,
    })

    assert.equal(analytics.sent[0].event_name, "checkout_started")
    assert.deepEqual(analytics.sent[0].metadata.items, items)
  } finally {
    analytics.restore()
  }
})

test("purchase contains order_id, revenue and TND, and is deduplicated", () => {
  setBrowserEnv()
  const analytics = captureInternalAnalytics()
  try {
    const first = trackStoreEvent("purchase", {
      order_id: "order_123",
      currency: "TND",
      value: 387,
      revenue: 387,
      deduplication_key: "purchase:order_123",
    })
    const second = trackStoreEvent("purchase", {
      order_id: "order_123",
      currency: "TND",
      value: 387,
      revenue: 387,
      deduplication_key: "purchase:order_123",
    })

    assert.ok(first.eventId)
    assert.equal(second.payload, null)
    assert.equal(analytics.sent.length, 1)
    assert.equal(analytics.sent[0].event_name, "purchase")
    assert.equal(analytics.sent[0].order_id, "order_123")
    assert.equal(analytics.sent[0].revenue, 387)
    assert.equal(analytics.sent[0].currency, "TND")
  } finally {
    analytics.restore()
  }
})

test("analytics errors never block the storefront path", async () => {
  setBrowserEnv()
  const previous = api.trackAnalyticsEvent
  api.trackAnalyticsEvent = async () => {
    throw new Error("network unavailable")
  }
  const previousNodeEnv = process.env.NODE_ENV
  process.env.NODE_ENV = "production"
  try {
    const result = trackStoreEvent("page_view", {
      page_path: "/",
      currency: "TND",
    })

    assert.ok(result.eventId)
    assert.equal(result.payload.event_name, "page_view")
    await new Promise((resolve) => setTimeout(resolve, 0))
  } finally {
    api.trackAnalyticsEvent = previous
    process.env.NODE_ENV = previousNodeEnv
  }
})

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
  const strictModeReplayPageViewId = createPageView("/products")
  assert.equal(strictModeReplayPageViewId, firstPageViewId)
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
