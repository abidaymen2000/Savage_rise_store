import assert from "node:assert/strict"
import test from "node:test"
import { isSizePurchasable, getSelectableQuantityLimit, productHasPurchasableVariant } from "../lib/inventory.ts"
import { buildPackSelections } from "../lib/pack-offers.ts"

test("positive stock cannot override an explicit Sold out decision", () => {
  const size = { size: "M", stock_available: 12, in_stock: false, track_inventory: true }
  assert.equal(isSizePurchasable(size), false)
  assert.equal(getSelectableQuantityLimit(size), 0)
  assert.equal(size.stock_available, 12)
  assert.equal(isSizePurchasable({ ...size, in_stock: true }), true)
  assert.equal(isSizePurchasable({ ...size, in_stock: true, stock_available: 0 }), false)
  assert.equal(isSizePurchasable({ ...size, track_inventory: false }), false)
  assert.equal(productHasPurchasableVariant({ in_stock: false, variants: [{ sizes: [{ ...size, in_stock: true }] }] }), false)
})
test("forced parent pack cannot produce purchase selections", () => {
  assert.equal(buildPackSelections({ in_stock: false, components: [] }, {}), null)
})
