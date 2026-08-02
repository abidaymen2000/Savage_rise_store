import test from "node:test"
import assert from "node:assert/strict"

import {
  buildMetaCartItemContent,
  buildMetaPackSelectionContent,
  buildMetaProductContent,
  metaProductId,
  metaVariantId,
} from "../lib/meta-content.ts"
import { trackPurchasePixelOnce } from "../lib/meta-purchase.ts"

class MemoryStorage {
  constructor() {
    this.map = new Map()
  }

  getItem(key) {
    return this.map.has(key) ? this.map.get(key) : null
  }

  setItem(key, value) {
    this.map.set(key, String(value))
  }
}

function setPixelEnv() {
  const localStorage = new MemoryStorage()
  const fbqCalls = []

  global.window = {
    localStorage,
    fbq: (...args) => {
      fbqCalls.push(args)
    },
  }

  return { fbqCalls }
}

test("builds Meta catalog product and variant ids with required prefixes", () => {
  assert.equal(metaProductId("product-123"), "product:product-123")
  assert.equal(metaVariantId("variant-456"), "variant:variant-456")
})

test("builds ViewContent product-group content with product catalog id", () => {
  assert.deepEqual(buildMetaProductContent({ id: "prod_1", price: 79 }, 1), {
    id: "product:prod_1",
    quantity: 1,
    item_price: 79,
  })
})

test("builds AddToCart content from selected variant id only", () => {
  const content = buildMetaCartItemContent({
    product: {
      id: "prod_1",
      sku: "SKU-RAW",
      price: 79,
    },
    selectedVariant: {
      id: "var_red_m",
      color: "Red",
      sizes: [],
      images: [],
      meta_content_id: "legacy-meta-id",
    },
    quantity: 2,
  })

  assert.deepEqual(content, {
    id: "variant:var_red_m",
    quantity: 2,
    item_price: 79,
  })
  assert.notEqual(content?.id, "prod_1")
  assert.notEqual(content?.id, "SKU-RAW")
  assert.notEqual(content?.id, "legacy-meta-id")
})

test("builds multi-article checkout payload with one content per variant", () => {
  const productLine = buildMetaCartItemContent({
    product: { price: 110 },
    selectedVariant: { id: "variant-a" },
    quantity: 1,
  })
  const packLine = buildMetaPackSelectionContent(
    {
      product_id: "raw-product-b",
      variant_id: "variant-b",
      sku: "SKU-B",
      color: "Black",
      size: "L",
      qty: 2,
      unit_price: 45,
    },
    3,
  )
  const contents = [productLine, packLine].filter(Boolean)
  const payload = {
    content_ids: contents.map((item) => item.id),
    content_type: "product",
    contents,
    currency: "TND",
    value: 110 + 45 * 2 * 3,
  }

  assert.deepEqual(payload, {
    content_ids: ["variant:variant-a", "variant:variant-b"],
    content_type: "product",
    contents: [
      { id: "variant:variant-a", quantity: 1, item_price: 110 },
      { id: "variant:variant-b", quantity: 6, item_price: 45 },
    ],
    currency: "TND",
    value: 380,
  })
  assert.ok(payload.content_ids.every((id) => id.startsWith("variant:")))
})

test("Purchase browser payload preserves variant ids, currency and real total", () => {
  const { fbqCalls } = setPixelEnv()
  const sent = trackPurchasePixelOnce({
    orderId: "order-1",
    metaEventId: "event-1",
    value: 380,
    currency: "TND",
    content_ids: ["variant:variant-a", "variant:variant-b"],
    contents: [
      { id: "variant:variant-a", quantity: 1, item_price: 110 },
      { id: "variant:variant-b", quantity: 6, item_price: 45 },
    ],
    num_items: 7,
  })

  assert.equal(sent, true)
  assert.equal(fbqCalls.length, 1)
  assert.deepEqual(fbqCalls[0], [
    "track",
    "Purchase",
    {
      value: 380,
      currency: "TND",
      order_id: "order-1",
      content_ids: ["variant:variant-a", "variant:variant-b"],
      contents: [
        { id: "variant:variant-a", quantity: 1, item_price: 110 },
        { id: "variant:variant-b", quantity: 6, item_price: 45 },
      ],
      content_type: "product",
      num_items: 7,
    },
    { eventID: "event-1" },
  ])
})
