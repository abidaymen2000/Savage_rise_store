import assert from "node:assert/strict"
import test from "node:test"
import { CatalogService } from "@/lib/api/generated"
import { catalogApi } from "@/lib/api/catalog-api"
import {
  getActiveBundlePacks,
  getShopProducts,
  isBundleProduct,
  isShopProduct,
  PACK_PRODUCT_KIND,
  SHOP_PRODUCT_KIND,
} from "@/lib/product-kind"

const product = (id, product_kind, name = id, slug = id) => ({
  id,
  style_id: slug,
  name,
  full_name: name,
  categories: [],
  price: 10,
  in_stock: true,
  variants: [],
  slug,
  product_kind,
})

const pack = (id, product_kind = PACK_PRODUCT_KIND, status = "active") => ({
  id,
  title: id,
  discount_type: "fixed_amount",
  discount_value: 0,
  status,
  product_kind,
  created_at: "2026-07-20T00:00:00Z",
  updated_at: "2026-07-20T00:00:00Z",
})

test("Shop excludes product_kind bundle and keeps physical products", () => {
  const visibleProducts = getShopProducts([
    product("bundle-1", PACK_PRODUCT_KIND, "Not named pack", "not-named-pack"),
    product("physical-1", SHOP_PRODUCT_KIND, "SR NOTTE OVERSIZED TEE", "sr-notte-oversized-tee"),
    product("physical-2", SHOP_PRODUCT_KIND, "Physical item with Pack in name", "pack-word-but-physical"),
  ])

  assert.deepEqual(
    visibleProducts.map((item) => item.id),
    ["physical-1", "physical-2"],
  )
  assert.equal(visibleProducts.every(isShopProduct), true)
  assert.equal(visibleProducts.some(isBundleProduct), false)
})

test("Packs keeps active bundles and excludes physical products", () => {
  const visiblePacks = getActiveBundlePacks([
    pack("drop-2-pack"),
    pack("inactive-bundle", PACK_PRODUCT_KIND, "archived"),
    pack("tee-as-pack-source", SHOP_PRODUCT_KIND),
  ])

  assert.deepEqual(
    visiblePacks.map((item) => item.id),
    ["drop-2-pack"],
  )
})

test("Catalog wrapper uses server-side product_kind for Shop pagination and total", async () => {
  const originalList = CatalogService.listProductsCatalogProductsGet
  const originalGetProduct = catalogApi.getProduct
  const calls = []

  CatalogService.listProductsCatalogProductsGet = (params) => {
    calls.push(params)
    return Promise.resolve({
      items: [
        {
          id: "physical-1",
          name: "SR NOTTE OVERSIZED TEE",
          slug: "sr-notte-oversized-tee",
          product_kind: SHOP_PRODUCT_KIND,
          status: "active",
          default_currency: "TND",
          version: 1,
        },
      ],
      total: 1,
      page: 1,
      page_size: 24,
      pages: 1,
      has_next: false,
      has_prev: false,
    })
  }
  catalogApi.getProduct = async (slug) => product("physical-1", SHOP_PRODUCT_KIND, "SR NOTTE OVERSIZED TEE", slug)

  try {
    const page = await catalogApi.getProductsPage(0, 24, { productKind: SHOP_PRODUCT_KIND })

    assert.equal(calls[0].productKind, SHOP_PRODUCT_KIND)
    assert.equal(calls[0].page, 1)
    assert.equal(calls[0].pageSize, 24)
    assert.equal(page.total, 1)
    assert.equal(page.page_size, 24)
    assert.deepEqual(
      page.items.map((item) => item.product_kind),
      [SHOP_PRODUCT_KIND],
    )
  } finally {
    CatalogService.listProductsCatalogProductsGet = originalList
    catalogApi.getProduct = originalGetProduct
  }
})

test("Catalog wrapper preserves search query with product_kind filtering", async () => {
  const originalList = CatalogService.listProductsCatalogProductsGet
  const originalGetProduct = catalogApi.getProduct
  const calls = []

  CatalogService.listProductsCatalogProductsGet = (params) => {
    calls.push(params)
    return Promise.resolve({
      items: [],
      total: 0,
      page: 1,
      page_size: 12,
      pages: 0,
      has_next: false,
      has_prev: false,
    })
  }
  catalogApi.getProduct = async (slug) => product(slug, SHOP_PRODUCT_KIND)

  try {
    const page = await catalogApi.getProductsPage(0, 12, { productKind: SHOP_PRODUCT_KIND, q: "notte" })

    assert.equal(calls[0].productKind, SHOP_PRODUCT_KIND)
    assert.equal(calls[0].q, "notte")
    assert.equal(page.total, 0)
    assert.deepEqual(page.items, [])
  } finally {
    CatalogService.listProductsCatalogProductsGet = originalList
    catalogApi.getProduct = originalGetProduct
  }
})

test("Empty states receive empty Shop products and empty Packs from selectors", () => {
  assert.deepEqual(getShopProducts([]), [])
  assert.deepEqual(getActiveBundlePacks([]), [])
})
