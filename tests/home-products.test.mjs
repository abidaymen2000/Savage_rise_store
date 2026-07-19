import assert from "node:assert/strict"
import test from "node:test"
import { getActiveBundles, getFeaturedPhysicalProducts } from "@/lib/home-products"

const physicalProduct = (id, name = id) => ({
  id,
  style_id: id,
  name,
  full_name: name,
  categories: [],
  price: 79.9,
  in_stock: true,
  variants: [],
  product_kind: "physical",
})

const bundleProduct = (id, name = id) => ({
  ...physicalProduct(id, name),
  price: 129.99,
  product_kind: "bundle",
  bundle_definition: { components: [] },
})

const pack = (id, status = "active") => ({
  id,
  title: id,
  discount_type: "fixed_amount",
  discount_value: 21.81,
  status,
  product_kind: "bundle",
  created_at: "2026-07-19T00:00:00Z",
  updated_at: "2026-07-19T00:00:00Z",
})

test("excludes bundles from featured products", () => {
  const products = [physicalProduct("tee"), bundleProduct("drop-2-pack"), physicalProduct("pants")]
  const featured = getFeaturedPhysicalProducts(products, [pack("drop-2-pack")])

  assert.deepEqual(
    featured.map((product) => product.id),
    ["tee", "pants"],
  )
})

test("keeps active bundles in active packs", () => {
  const packs = [pack("drop-2-pack"), pack("draft-pack", "draft")]
  const activeBundles = getActiveBundles(packs)

  assert.deepEqual(
    activeBundles.map((item) => item.id),
    ["drop-2-pack"],
  )
})

test("does not duplicate a product id across homepage sections", () => {
  const products = [physicalProduct("tee"), bundleProduct("drop-2-pack"), physicalProduct("tee"), physicalProduct("pants")]
  const activeBundles = getActiveBundles([pack("drop-2-pack")])
  const featured = getFeaturedPhysicalProducts(products, activeBundles)
  const visibleIds = [...activeBundles.map((item) => item.id), ...featured.map((product) => product.id)]

  assert.equal(new Set(visibleIds).size, visibleIds.length)
  assert.deepEqual(visibleIds, ["drop-2-pack", "tee", "pants"])
})
