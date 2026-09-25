import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { runInNewContext } from "node:vm"
import ts from "typescript"
import * as jsxRuntime from "react/jsx-runtime"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { catalogApi } from "../lib/api/catalog-api.ts"
import * as utils from "../lib/utils.ts"
import * as swatches from "../lib/color-swatches.ts"
import { isProductInStock, sortProductsByStockStatus } from "../lib/utils.ts"
import { productHasPurchasableVariant } from "../lib/inventory.ts"

// Render the real card; replace only Next's host components and client actions.
const cardModule = { exports: {} }
const cardSource = readFileSync(new URL("../components/storefront/product-card.tsx", import.meta.url), "utf8")
runInNewContext(ts.transpileModule(cardSource, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText, {
  exports: cardModule.exports,
  require: (name) => {
    if (name === "react/jsx-runtime") return jsxRuntime
    if (name === "@/lib/utils") return utils
    if (name === "@/lib/color-swatches") return swatches
    if (name === "next/link") return ({ children, href, ...props }) => createElement("a", { href, ...props }, children)
    if (name === "next/image") return ({ fill, priority, ...props }) => createElement("img", props)
    if (name === "@/components/storefront/product-card-actions") return () => null
    throw new Error(`Unexpected card dependency: ${name}`)
  },
})
const ProductCard = cardModule.exports.default

test("list, detail, search and category keep availability through force/release without changing stock", async (t) => {
  let state
  const detail = () => ({
    id: "notte", slug: "sr-notte-oversized-tee", name: "SR NOTTE OVERSIZED TEE",
    product_kind: "physical", in_stock: state.inStock,
    variants: [{
      id: "notte-m", title: "Black / M", status: "active", base_price: 72,
      option_values: { color: "Black", size: "M" }, media: [],
      // Deliberately keep variant inventory available when the parent is forced.
      inventory: { track_inventory: true, stock_on_hand: state.stock, stock_reserved: 0,
        stock_available: state.stock, in_stock: state.stock > 0 },
    }],
  })
  let failDetail = false
  t.mock.method(globalThis, "fetch", async (url) => {
    const isDetail = new URL(url).pathname.endsWith("/products/sr-notte-oversized-tee")
    if (isDetail && failDetail) return new Response("{}", { status: 503 })
    return Response.json(isDetail ? detail() : {
      items: [{ ...detail(), variants: undefined }], total: 1, page: 1, page_size: 10, pages: 1,
    })
  })
  for (state of [
    { label: "available", inStock: true, stock: 24, expected: true },
    { label: "forced sold out with stock", inStock: false, stock: 24, expected: false },
    { label: "forced mode removed", inStock: true, stock: 24, expected: true },
    { label: "real stockout", inStock: false, stock: 0, expected: false },
  ]) {
    const products = [
      await catalogApi.getProduct("sr-notte-oversized-tee"),
      ...(await catalogApi.getProductsPage()).items,
      ...await catalogApi.getProducts(),
      ...await catalogApi.searchProducts({ text: "notte" }),
      ...await catalogApi.getProductsByCategory("t-shirts"),
    ]
    for (const product of products) {
      assert.equal(isProductInStock(product), state.expected, state.label)
      assert.equal(productHasPurchasableVariant(product), state.expected, state.label)
      assert.equal(product.variants[0].sizes[0].stock_available, state.stock)
      for (const compact of [false, true]) {
        const html = renderToStaticMarkup(createElement(ProductCard, { product, compact }))
        assert.equal(/bg-black\/90[^>]*>SOLD OUT<\/span>/.test(html), !state.expected, `${state.label}: compact=${compact}`)
      }
    }
    failDetail = true
    const [fallback] = await catalogApi.getProducts()
    assert.equal(isProductInStock(fallback), state.expected, `${state.label}: list fallback`)
    failDetail = false
  }
  const available = { in_stock: true, variants: [] }
  const forced = { in_stock: false, variants: [{ sizes: [{ stock_available: 24 }] }] }
  assert.deepEqual(sortProductsByStockStatus([forced, available]), [available, forced])
})

test("all card routes read fresh products while the badge and purchase guard share availability", () => {
  const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8")
  for (const path of ["app/page.tsx", "app/products/page.tsx", "app/products/[id]/page.tsx"]) {
    const source = read(path)
    assert.match(source, /export const dynamic = "force-dynamic"/, path)
    assert.doesNotMatch(source, /unstable_cache\(async[^]*?api\.getProduct[^]*?\}, \[/, path)
  }
  const card = read("components/storefront/product-card.tsx")
  assert.match(card, /const inStock = isProductInStock\(product\)/)
  assert.match(card, /!inStock && <span className="bg-black\/90[^]*?>SOLD OUT<\/span>/)
  assert.match(read("components/storefront/product-card-actions.tsx"), /if \(!selection \|\| !inStock\) return/)
  assert.match(read("app/products/[id]/ProductDetailClient.tsx"), /const productInStock = product \? isProductInStock\(product\)/)
})
