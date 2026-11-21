import test from "node:test"
import assert from "node:assert/strict"
import { declaredStoreConfig } from "../lib/store-contract.ts"
import { quoteRequestGate, quoteForInput } from "../lib/checkout-quote-state.ts"
import { buildCheckoutFingerprint } from "../lib/checkout-fingerprint.ts"
import { formatStorePrice } from "../lib/store-config-shared.ts"
import { isSizePurchasable, getSelectableQuantityLimit } from "../lib/inventory.ts"

const custom = { store_id: "s_1111111111111111", frontend_type: "custom", configuration_source: "platform", store_domain_revision: 3,
  store_open: true, default_currency: "TND", locale: "fr-TN", domain: "shop.example.test", public_url: "https://shop.example.test" }

test("consumers reject partial, wrong-tenant and third-mode configurations", () => {
  assert.equal(declaredStoreConfig(custom, { engine: "custom", domain: custom.domain }).store_id, custom.store_id)
  assert.equal(declaredStoreConfig({ ...custom, domain: null, frontend_type: "standard" }).frontend_type, "standard")
  for (const invalid of [{}, { ...custom, domain: undefined }, { ...custom, configuration_source: undefined },
    { ...custom, frontend_type: "standard" }, { ...custom, configuration_error: "STORE_DOMAIN_INVALID" },
    { ...custom, public_url: "https://another.example.test" }]) assert.throws(() => declaredStoreConfig(invalid))
  assert.throws(() => declaredStoreConfig(custom, { storeId: "s_2222222222222222" }))
  assert.throws(() => declaredStoreConfig(custom, { engine: "standard" }))
})

test("old responses and invalid addresses cannot restore a usable quote", async () => {
  const gate = quoteRequestGate()
  const first = gate.start()
  const newer = gate.start()
  let accepted = null
  await Promise.resolve().then(() => { if (gate.accepts(first)) accepted = "old" })
  assert.equal(accepted, null)
  assert.equal(gate.accepts(newer), true)
  gate.cancel() // address erased or component unmounted
  assert.equal(gate.accepts(newer), false)
  const result = { key: "old-cart", quote: { total: 31.692 } }
  assert.equal(quoteForInput(result, "new-cart", true), null)
  assert.equal(quoteForInput(result, "old-cart", false), null)
  assert.equal(quoteForInput(result, "old-cart", true).total, 31.692)
})

test("same intention survives refreshed quotes and telemetry; cart or address changes create a new one", () => {
  const payload = { items: [{ product_id: "p", variant_id: "v", qty: 1 }], shipping: { city: "Tunis" }, payment_method: "cod" }
  const initial = buildCheckoutFingerprint(payload, "quote-before")
  assert.equal(buildCheckoutFingerprint({ ...payload, quote_token: "new-expiry", meta_event_id: "retry" }, "quote-after"), initial)
  assert.notEqual(buildCheckoutFingerprint({ ...payload, shipping: { city: "Sousse" } }), initial)
  assert.notEqual(buildCheckoutFingerprint({ ...payload, items: [{ product_id: "p", variant_id: "v", qty: 2 }] }), initial)
})

test("TND preserves three decimals and public availability does not require exact stock", () => {
  const money = formatStorePrice(31.692, custom)
  assert.match(money, /31[,.]692/)
  assert.match(formatStorePrice(12.34, { locale: "fr-FR", default_currency: "EUR" }), /12,34/)
  const size = { in_stock: true, track_inventory: true, status: "active" }
  assert.equal(isSizePurchasable(size), true)
  assert.ok(getSelectableQuantityLimit(size) > 1)
  assert.equal(isSizePurchasable({ ...size, in_stock: false }), false)
  assert.equal(isSizePurchasable({ ...size, in_stock: undefined }), false)
})
