import assert from "node:assert/strict"
import test from "node:test"
import { api } from "../lib/api.ts"
import { ApiError, isGatewayRoutingError, isResourceNotFound } from "../lib/api/api-error.ts"
import { getVariantPrice, getVariantSize, isSizePurchasable } from "../lib/inventory.ts"
import { buildOrderPayload } from "../lib/order-payload.ts"
import { trackStoreEvent } from "../lib/store-analytics.ts"
import { getAnalyticsContext } from "../lib/analytics-context.ts"
import { getMetaEventContext } from "../lib/meta-event-context.ts"
import { trackPurchasePixelOnce } from "../lib/meta-purchase.ts"

const json = (value, status = 200) => new Response(JSON.stringify(value), { status, headers: { "Content-Type": "application/json" } })
const detail = () => ({
  id: "product-1", name: "Fixture tee", slug: "fixture-tee", product_kind: "physical", status: "active", category_ids: ["tops"], media: [],
  variants: [{
    id: "variant-M", title: "Black / M", sku: "TEE-M", option_values: { size: "M", color: "Black" },
    base_price: "100", effective_price: "80", currency: "TND", status: "active",
    media: [{ url: "https://ik.imagekit.io/fixture/tee.jpg", is_primary: true }],
    inventory: { track_inventory: true, stock_on_hand: 5, stock_reserved: 2, stock_available: 3, in_stock: true },
  }],
})
const page = (items) => ({ items, page: 1, page_size: 100, pages: 1, total: items.length })

test("gateway and tenant failures do not masquerade as product 404s or trigger fallback requests", async (t) => {
  const calls = []
  t.mock.method(globalThis, "fetch", async (url) => {
    calls.push(url)
    return json({ message: "no Route matched with those values", request_id: "request-123" }, 404)
  })
  const logs = []
  t.mock.method(console, "error", (...args) => logs.push(args))
  await assert.rejects(api.getProduct("fixture-tee"), (error) => isGatewayRoutingError(error) && !isResourceNotFound(error))
  assert.equal(calls.length, 1)
  assert.equal(logs[0][1].code, "GATEWAY_ROUTE_MISSING")
  assert.equal(logs[0][1].method, "GET")
  assert.equal(logs[0][1].requestId, "request-123")
  assert.equal(logs[0][1].storeDomain, "savagerise.com")
  assert.equal(isResourceNotFound(new ApiError(404, { code: "STORE_DOMAIN_UNKNOWN" }, "unknown")), false)
  assert.equal(isResourceNotFound(new ApiError(404, { detail: "Product not found" }, "not found")), true)
})

test("malformed successful responses fail visibly instead of becoming an empty catalogue or zero price", async (t) => {
  t.mock.method(console, "error", () => {})
  for (const body of [{}, { data: [] }, { ...page([]), items: null }]) {
    t.mock.method(globalThis, "fetch", async () => json(body))
    await assert.rejects(api.getProducts(), (error) => error.body?.code === "INVALID_API_RESPONSE")
  }
  const product = detail()
  product.variants[0].base_price = null
  delete product.variants[0].effective_price
  t.mock.method(globalThis, "fetch", async () => json(product))
  await assert.rejects(api.getProduct("fixture-tee"), (error) => error.body?.code === "INVALID_API_RESPONSE")
  const secondMissingPrice = detail()
  secondMissingPrice.variants.push({ ...secondMissingPrice.variants[0], id: "variant-L", base_price: null, effective_price: null })
  t.mock.method(globalThis, "fetch", async () => json(secondMissingPrice))
  await assert.rejects(api.getProduct("fixture-tee"), (error) => error.body?.code === "INVALID_API_RESPONSE")
})

test("detail failure aborts catalogue hydration instead of fabricating purchasable zero-price items", async (t) => {
  t.mock.method(console, "error", () => {})
  t.mock.method(globalThis, "fetch", async (url) => String(url).includes("/products?")
    ? json(page([detail()])) : json({ message: "upstream unavailable" }, 503))
  await assert.rejects(api.getProducts(), (error) => error.status === 503)
})

test("server API diagnostics omit payloads, query values, authorization and error messages", async (t) => {
  const logs = []
  t.mock.method(console, "error", (...args) => logs.push(args))
  t.mock.method(globalThis, "fetch", async () => json({ detail: "SECRET_RESPONSE", request_id: "req-safe" }, 500))
  await assert.rejects(api.getProducts(0, 10, { q: "SECRET_SEARCH" }))
  const output = JSON.stringify(logs)
  assert.ok(output.includes("/api/core/catalog/products"))
  assert.ok(!output.includes("SECRET_"))
  assert.ok(!output.includes("Authorization"))
})

test("mocked catalogue, variant selection, cart payload, quote and order retain authoritative values and bundle selections", async (t) => {
  const calls = []
  t.mock.method(globalThis, "fetch", async (url, options) => {
    calls.push({ url: String(url), options })
    if (String(url).includes("/catalog/products?")) return json(page([detail()]))
    if (String(url).includes("/catalog/products/")) return json(detail())
    if (String(url).endsWith("/orders/quote")) return json({ subtotal: 160, bundle_discount: 10, promotion_discount: 5, loyalty_discount: 2, shipping_amount: 7, total: 150, total_amount: 150, items: [] })
    if (String(url).endsWith("/orders/")) return json({ id: "SIMULATED-ORDER", total_amount: 150 }, 201)
    throw new Error("Unexpected fixture request")
  })
  const [product] = await api.getProducts()
  assert.equal(product.price, 80)
  assert.equal(product.images[0].url, "https://ik.imagekit.io/fixture/tee.jpg")
  const variant = product.variants[0]
  assert.equal(variant.color, "Black")
  assert.equal(getVariantSize(variant, "M").stock_available, 3)
  assert.equal(isSizePurchasable(getVariantSize(variant, "M")), true)
  assert.equal(getVariantPrice({ ...product, price: 100 }, variant), 80)
  const payload = buildOrderPayload({
    items: [{ product, selectedVariant: variant, selectedSize: "M", quantity: 2 }],
    packItems: [{ pack: { id: "bundle-1" }, quantity: 1, selections: [{ component_id: "top", product_id: product.id, variant_id: variant.id }] }],
    shipping: { full_name: "Fixture", email: "fixture@example.invalid", phone: "0", address_line1: "Fixture", postal_code: "1000", city: "Tunis", country: "Tunisia" },
  })
  const quote = await api.quoteOrder(payload)
  assert.equal(quote.total, 150)
  assert.equal(quote.pack_discount, 10)
  assert.equal(quote.promotion_discount, 5)
  assert.equal(quote.loyalty_discount, 2)
  const order = await api.createOrder(payload, "simulated-idempotency")
  assert.equal(order.id, "SIMULATED-ORDER")
  for (const request of calls.slice(-2)) {
    const body = JSON.parse(request.options.body)
    assert.equal(body.items[0].variant_id, "variant-M")
    assert.equal(body.items[0].qty, 2)
    assert.deepEqual(body.items[1].bundle_selection, { components: [{ component_id: "top", variant_id: "variant-M" }] })
    assert.equal(request.options.headers.get("X-Store-Domain"), "savagerise.com")
  }
  assert.equal(calls.at(-1).options.headers.get("Idempotency-Key"), "simulated-idempotency")
})

test("analytics network errors, broken cookies, blocked storage and a throwing pixel never interrupt a purchase action", async (t) => {
  const previousWindow = globalThis.window
  const previousDocument = globalThis.document
  globalThis.window = { location: { href: "https://savagerise.com/checkout", search: "", pathname: "/checkout" }, fbq: () => { throw new Error("pixel blocked") } }
  for (const key of ["localStorage", "sessionStorage"]) Object.defineProperty(window, key, { get: () => { throw new Error("storage blocked") } })
  globalThis.document = { referrer: "", cookie: "_fbp=%invalid", title: "Checkout" }
  t.after(() => {
    if (previousWindow === undefined) delete globalThis.window; else globalThis.window = previousWindow
    if (previousDocument === undefined) delete globalThis.document; else globalThis.document = previousDocument
  })
  t.mock.method(console, "warn", () => {})
  t.mock.method(api, "trackAnalyticsEvent", async () => { throw new TypeError("Failed to fetch") })
  assert.doesNotThrow(() => getAnalyticsContext({ includeCheckoutId: true }))
  assert.equal(getMetaEventContext().fbp, null)
  await trackStoreEvent("add_to_cart").request
  assert.doesNotThrow(() => trackPurchasePixelOnce({ orderId: "SIMULATED", metaEventId: "event-fixture", value: 80, currency: "TND", content_ids: ["variant-M"], contents: [], num_items: 1 }))
  t.mock.method(api, "trackAnalyticsEvent", () => { throw new Error("synchronous analytics failure") })
  assert.doesNotThrow(() => trackStoreEvent("purchase"))
})
