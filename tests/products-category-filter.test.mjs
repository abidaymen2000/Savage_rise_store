import assert from "node:assert/strict"
import test from "node:test"
import {
  getCategoryAndDescendantIds,
  productMatchesCategoryIds,
  resolveCategoryFilter,
} from "@/lib/storefront/catalog"

const categories = [
  { id: "clothing", name: "Clothing", slug: "clothing", parent_id: null },
  { id: "tshirts-id", name: "T-shirts", slug: "t-shirts", parent_id: "clothing" },
  { id: "oversize-id", name: "Oversize", slug: "oversize", parent_id: "tshirts-id" },
  { id: "polo-id", name: "POLO", slug: "polo", parent_id: "tshirts-id" },
  { id: "pants-id", name: "Pants", slug: "pants", parent_id: "clothing" },
]

const product = (id, name, primaryCategoryId, categoryIds, inStock = true) => ({
  id,
  style_id: id,
  name,
  full_name: name,
  categories: categoryIds,
  primary_category_id: primaryCategoryId,
  category_ids: categoryIds,
  price: 10,
  in_stock: inStock,
  variants: [],
  product_kind: "physical",
})

test("Products category filter resolves tshirts dynamically and includes child category products", () => {
  const category = resolveCategoryFilter(categories, "tshirts")
  const categoryIds = getCategoryAndDescendantIds(categories, category.id)
  const products = [
    product("notte", "SR NOTTE OVERSIZED TEE", "oversize-id", ["oversize-id"]),
    product("polo", "SR Velluto Polo", "polo-id", ["polo-id"], false),
    product("faza", "FAZA-001 Moujet Har", "oversize-id", ["oversize-id"]),
    product("pants", "SR PALAZZO BAGGY PANTS", "pants-id", ["pants-id"]),
  ]

  assert.equal(category.slug, "t-shirts")
  assert.deepEqual(categoryIds, ["tshirts-id", "oversize-id", "polo-id"])
  assert.deepEqual(
    products.filter((item) => productMatchesCategoryIds(item, categoryIds)).map((item) => item.id),
    ["notte", "polo", "faza"],
  )
})

