import assert from "node:assert/strict"
import test from "node:test"
import { readFileSync, existsSync } from "node:fs"
import { runInNewContext } from "node:vm"
import ts from "typescript"
import * as React from "react"
import * as jsx from "react/jsx-runtime"
import { renderToStaticMarkup } from "react-dom/server"
import * as availability from "../lib/availability.ts"
import * as inventory from "../lib/inventory.ts"
import * as utils from "../lib/utils.ts"
import * as colorMedia from "../lib/product-color-media.ts"
import * as packs from "../lib/pack-offers.ts"
import { catalogApi } from "../lib/api/catalog-api.ts"
import { retryReadOnly } from "../lib/read-retry.ts"

const detailPath = existsSync(new URL("../app/products/[id]/ProductDetailClient.tsx", import.meta.url))
  ? "../app/products/[id]/ProductDetailClient.tsx" : "../app/[storeId]/products/[id]/ProductDetailClient.tsx"
const component = { exports: {} }
const host = tag => ({ children, disabled, role, ...props }) => React.createElement(tag, { disabled, role,
  ...(props["aria-pressed"] !== undefined ? { "aria-pressed": props["aria-pressed"] } : {}) }, children)
runInNewContext(ts.transpileModule(readFileSync(new URL(detailPath, import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText, { exports: component.exports, require(name) {
  if (name === "react") return React
  if (name === "react/jsx-runtime") return jsx
  if (name === "@/lib/availability") return availability
  if (name === "@/lib/inventory") return inventory
  if (name === "@/lib/utils") return utils
  if (name === "@/lib/product-color-media") return colorMedia
  if (name === "@/lib/pack-offers") return packs
  if (name === "@/contexts/CartContext") return { useCart: () => ({ addToCart() {}, addPackToCart() {} }) }
  if (name === "@/contexts/StoreConfigContext") return { useStoreConfig: () => ({ config: { default_currency: "TND", locale: "fr-TN" } }) }
  if (name === "@/lib/store-config-shared") return { isFeatureEnabled: () => false }
  if (name === "next/dynamic") return () => () => null
  if (name === "next/link" || name === "@/components/store-link") return host("a")
  if (name === "next/image") return () => null
  if (name.startsWith("@/components/ui/")) return new Proxy({}, { get: (_, key) => host(key === "Button" ? "button" : "div") })
  if (name === "lucide-react" || name.startsWith("@/lib/") || name === "@/components/WishlistButton") return new Proxy({}, { get: () => () => null })
  throw Error("Unexpected detail dependency: " + name)
} })

const payload = (inventoryFields = { in_stock: true }, parent = {}) => ({
  id: "6a544d1a81bf79b294333cfc", slug: "sr-palazzo-baggy-pants", name: "SR PALAZZO BAGGY PANTS",
  status: "active", product_kind: "physical", in_stock: true, forced_sold_out: false, ...parent,
  variants: [
    { id: "palazzo-s", title: "Black / S", status: "active", base_price: 79.9, option_values: { color: "Black", size: "S" }, inventory: { track_inventory: true, in_stock: false } },
    { id: "6a544d1a81bf79b294333d00", title: "Black / M", status: "active", base_price: 79.9, option_values: { color: "Black", size: "M" }, inventory: { track_inventory: true, ...inventoryFields } },
  ],
})

test("production-shaped Black/M without private quantities renders an enabled purchase button", async t => {
  t.mock.method(globalThis, "fetch", async () => Response.json(payload()))
  const product = await catalogApi.getProduct("sr-palazzo-baggy-pants")
  const size = product.variants[1].sizes[0]
  assert.equal(inventory.getAvailableStock(size), undefined)
  assert.equal(inventory.isSizePurchasable(size), true)
  assert.equal(availability.hasLowStock(size), false)
  assert.equal(inventory.getProductAvailability(product), "available")
  assert.equal(inventory.getProductVariantForSelection(product, "Black", "XL"), null)
  const html = renderToStaticMarkup(React.createElement(component.exports.default, { product, initialRelatedPack: null, initialRelatedProducts: {} }))
  const buy = html.match(/<button[^>]*>(?:(?!<\/button>)[\s\S])*Add to Bag(?:(?!<\/button>)[\s\S])*<\/button>/)?.[0]
  assert.ok(buy, html)
  assert.doesNotMatch(buy, /disabled/)
  assert.doesNotMatch(html, />Sold out<|Stock faible|stock limite/)
  assert.match(html, /aria-pressed="true">M/)
})

test("forced, empty, inactive, invalid and unknown remain distinct through mapping", async t => {
  let body
  t.mock.method(globalThis, "fetch", async () => Response.json(body))
  for (const [fields, parent, expected] of [
    [{ in_stock: false, availability_status: "out_of_stock" }, { in_stock: false }, "out_of_stock"],
    [{ in_stock: true }, { in_stock: false, forced_sold_out: true }, "forced_sold_out"],
    [{ in_stock: true }, { status: "inactive" }, "inactive"],
    [{ in_stock: false, availability_status: "invalid_variant" }, { in_stock: false, availability_status: "invalid_variant" }, "invalid_variant"],
    [{}, { in_stock: undefined }, "unknown"],
    [{ in_stock: true, low_stock: true }, {}, "available"],
  ]) {
    body = payload(fields, parent)
    const product = await catalogApi.getProduct("sr-palazzo-baggy-pants")
    assert.equal(inventory.getProductAvailability(product), expected)
    assert.equal(utils.isProductInStock(product), expected === "available")
    const html = renderToStaticMarkup(React.createElement(component.exports.default, { product, initialRelatedPack: null, initialRelatedProducts: {} }))
    assert.equal(/>Sold out</.test(html), availability.isSoldOut(expected), expected)
  }
})

test("failed API reads reject rather than fabricate stock", async t => {
  t.mock.method(globalThis, "fetch", async () => new Response("{}", { status: 503 }))
  await assert.rejects(catalogApi.getProduct("sr-palazzo-baggy-pants"))
  assert.equal(availability.availabilityStatus({ track_inventory: true }), "unknown")
  assert.equal(inventory.getSelectableQuantityLimit({ size: "M" }), 0)
})

test("only transient quotes retry; cancellation prevents a stale retry", async () => {
  let calls = 0
  const waits = []
  const controller = new AbortController()
  const result = await retryReadOnly(async () => { if (++calls < 3) throw Object.assign(Error("temporary"), { status: 503 }); return "quote" }, controller.signal, async ms => { waits.push(ms) })
  assert.equal(result, "quote"); assert.equal(calls, 3); assert.deepEqual(waits, [600, 1800])
  calls = 0
  await assert.rejects(retryReadOnly(async () => { calls++; throw Object.assign(Error("stock conflict"), { status: 409 }) }, controller.signal, async () => {}))
  assert.equal(calls, 1)
  calls = 0
  await assert.rejects(retryReadOnly(async () => { calls++; throw Error("offline") }, controller.signal, async () => controller.abort()))
  assert.equal(calls, 1)
})


test("cart refresh keeps quantity and never substitutes another variant", async () => {
  const { refreshCartSelection, cartItemAvailability } = await import('../lib/cart-availability.ts')
  const selected = { id:'m',color:'Black',images:[],sizes:[{size:'M',in_stock:true,variant_item_id:'m'}] }
  const product = {id:'p',in_stock:true,status:'active',variants:[selected]}
  const item={product,selectedVariant:selected,selectedVariantItemId:'m',selectedSize:'M',quantity:2}
  const fresh = refreshCartSelection(item,{...product,variants:[{...selected,id:'s',sizes:[{size:'S',in_stock:true,variant_item_id:'s'}]}]})
  assert.equal(fresh.quantity,2)
  assert.equal(fresh.selectedVariantItemId,'m')
  assert.equal(cartItemAvailability(fresh),'invalid_variant')
  assert.equal(cartItemAvailability(refreshCartSelection(item,{...product,availability_status:'unknown',in_stock:undefined})),'unknown')
})
