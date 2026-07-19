import test from "node:test"
import assert from "node:assert/strict"

import { getProductCartKey, matchesCartItem } from "../lib/cart-identity.ts"
import * as inventory from "../lib/inventory.ts"
import * as idempotency from "../lib/checkout-idempotency.ts"
import * as statusHelpers from "../lib/order-status.ts"
import { buildOrderPayload } from "../lib/order-payload.ts"
import { ApiError, api } from "../lib/api.ts"
import { getBackendConflictMessage, isStockConflict } from "../lib/order-conflicts.ts"

function createVariant({ color, size, variantItemId, sku }) {
  return {
    color,
    sizes: [
      {
        size,
        variant_item_id: variantItemId,
        sku,
        stock_available: 5,
      },
    ],
    items: [
      {
        id: variantItemId,
        size,
        sku,
        stock_available: 5,
      },
    ],
    images: [],
  }
}

test("inventory helper uses stock_available only", () => {
  assert.equal(
    inventory.getAvailableStock({
      size: "M",
      stock_available: 4,
      stock_on_hand: 10,
      stock_reserved: 6,
    }),
    4,
  )
  assert.equal(inventory.getAvailableStock({ size: "L" }), 0)
  assert.equal(inventory.isSizePurchasable({ size: "S", stock_available: 1 }), true)
  assert.equal(inventory.isSizePurchasable({ size: "XS", stock_available: 0 }), false)
})

test("checkout idempotency key is stable until cleared", () => {
  const storage = new Map()
  globalThis.window = {
    sessionStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: (key) => storage.delete(key),
    },
  }
  Object.defineProperty(globalThis, "crypto", {
    configurable: true,
    value: {
      randomUUID: () => "uuid-123",
    },
  })

  assert.equal(idempotency.getOrCreateCheckoutIdempotencyKey(), "uuid-123")
  assert.equal(idempotency.getOrCreateCheckoutIdempotencyKey(), "uuid-123")
  Object.defineProperty(globalThis, "crypto", {
    configurable: true,
    value: {
      randomUUID: () => "uuid-456",
    },
  })
  assert.equal(idempotency.getOrCreateCheckoutIdempotencyKey("fingerprint-a"), "uuid-456")
  assert.equal(idempotency.getStoredCheckoutFingerprint(), "fingerprint-a")
  idempotency.clearCheckoutIdempotencyKey()
  Object.defineProperty(globalThis, "crypto", {
    configurable: true,
    value: {
      randomUUID: () => "uuid-789",
    },
  })
  assert.equal(idempotency.getOrCreateCheckoutIdempotencyKey("fingerprint-a"), "uuid-789")
  assert.equal(idempotency.getStoredCheckoutFingerprint(), "fingerprint-a")
  Object.defineProperty(globalThis, "crypto", {
    configurable: true,
    value: {
      randomUUID: () => "uuid-999",
    },
  })
  assert.equal(idempotency.getOrCreateCheckoutIdempotencyKey("fingerprint-b"), "uuid-999")
  assert.equal(idempotency.getStoredCheckoutFingerprint(), "fingerprint-b")
})

test("order status helpers cover the new contract", () => {
  assert.equal(statusHelpers.getCanonicalOrderStatus({ status: "pending", order_status: "confirmed" }), "confirmed")
  assert.equal(statusHelpers.canCancelOrder({ status: "pending" }), true)
  assert.equal(statusHelpers.canCancelOrder({ status: "preparing" }), false)
  assert.equal(statusHelpers.getOrderStatusLabel("return_in_transit"), "Retour en transit")
  assert.equal(statusHelpers.getPaymentStatusLabel("partially_refunded"), "Partiellement remboursé")
  assert.equal(statusHelpers.getFulfillmentStatusLabel("reserved"), "Réservée")
})

test("cart key prefers variant_item_id and keeps different sizes separate", () => {
  const variantSmall = createVariant({ color: "Black", size: "S", variantItemId: "item-black-s", sku: "SKU-S" })
  const variantMedium = createVariant({ color: "Black", size: "M", variantItemId: "item-black-m", sku: "SKU-M" })

  assert.notEqual(
    getProductCartKey("prod_1", variantSmall, "S"),
    getProductCartKey("prod_1", variantMedium, "M"),
  )
})

test("cart key keeps different colors separate when variant items differ", () => {
  const blackVariant = createVariant({ color: "Black", size: "M", variantItemId: "item-black-m", sku: "SKU-BM" })
  const whiteVariant = createVariant({ color: "White", size: "M", variantItemId: "item-white-m", sku: "SKU-WM" })

  assert.notEqual(
    getProductCartKey("prod_1", blackVariant, "M"),
    getProductCartKey("prod_1", whiteVariant, "M"),
  )
})

test("cart identity falls back to color and size only when variant_item_id is absent", () => {
  const legacyVariant = {
    color: "Black",
    sizes: [{ size: "M", stock_available: 3 }],
    items: [],
    images: [],
  }
  const modernVariant = createVariant({ color: "Black", size: "M", variantItemId: "item-black-m", sku: "SKU-BM" })

  assert.equal(getProductCartKey("prod_1", legacyVariant, "M"), "prod_1-Black-M")
  assert.equal(getProductCartKey("prod_1", modernVariant, "M"), "prod_1-item-black-m")
})

test("matchesCartItem prefers stable variant_item_id over labels", () => {
  const cartItem = {
    product: { id: "prod_1", price: 120 },
    selectedVariant: createVariant({ color: "Black", size: "M", variantItemId: "item-black-m", sku: "SKU-BM" }),
    selectedVariantItemId: "item-black-m",
    selectedSize: "M",
    quantity: 1,
  }

  assert.equal(matchesCartItem(cartItem, { productId: "prod_1", color: "White", size: "L", variantItemId: "item-black-m" }), true)
  assert.equal(matchesCartItem(cartItem, { productId: "prod_1", color: "Black", size: "M", variantItemId: "item-other" }), false)
})

test("buildOrderPayload includes variant_item_id and sku for stable lines", () => {
  const payload = buildOrderPayload({
    items: [
      {
        product: { id: "prod_1", price: 120 },
        selectedVariant: createVariant({ color: "Black", size: "M", variantItemId: "item-black-m", sku: "SKU-BM" }),
        selectedVariantItemId: "item-black-m",
        selectedSize: "M",
        quantity: 2,
      },
    ],
    packItems: [],
    shipping: {
      full_name: " Ada ",
      email: " ada@example.com ",
      phone: " 1 ",
      address_line1: " a ",
      address_line2: "   ",
      postal_code: " 1 ",
      city: " Paris ",
      country: " France ",
    },
    promo_code: " welcome ",
    loyalty_points_to_use: 20,
    user_id: "user_1",
    meta: {
      event_source_url: "https://savagerise.com/checkout",
      fbp: "fbp-1",
    },
  })

  assert.deepEqual(payload.items, [{ product_id: "prod_1", variant_id: "item-black-m", sku: "SKU-BM", qty: 2 }])
  assert.equal(payload.shipping.address_line2, null)
  assert.equal(payload.shipping.full_name, "Ada")
  assert.equal(payload.shipping.email, "ada@example.com")
  assert.equal(payload.shipping.city, "Paris")
  assert.equal(payload.promo_code, "WELCOME")
})

test("buildOrderPayload keeps legacy fallback when variant_item_id is absent", () => {
  const payload = buildOrderPayload({
    items: [
      {
        product: { id: "prod_legacy", price: 80 },
        selectedVariant: {
          color: "Black",
          sizes: [{ size: "L", stock_available: 2 }],
          items: [],
          images: [],
        },
        selectedSize: "L",
        quantity: 1,
      },
    ],
    packItems: [],
    shipping: {
      full_name: "Ada",
      email: "ada@example.com",
      phone: "1",
      address_line1: "a",
      postal_code: "1",
      city: "Paris",
      country: "France",
    },
  })

  assert.deepEqual(payload.items, [{ product_id: "prod_legacy", variant_id: null, sku: null, qty: 1 }])
})

test("stock conflict helper recognizes backend inventory conflicts", () => {
  const error = new ApiError(409, { detail: { code: "INVENTORY_CONFLICT", message: "Stock changed while checking out", item: "Buggy / M" } }, "Stock changed while checking out")
  assert.equal(isStockConflict(error), true)
  assert.equal(getBackendConflictMessage(error), "Stock changed while checking out")
})

test("quoteOrder and createOrder use the backend order contract", async () => {
  const calls = []
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options })
    if (String(url).endsWith("/orders/quote")) {
      return new Response(
        JSON.stringify({
          subtotal: 120,
          pack_discount: 10,
          promotion_discount: 5,
          loyalty_discount: 0,
          shipping_amount: 7,
          total: 112,
          total_amount: 112,
          items: [],
          warnings: [],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      )
    }
    return new Response(
      JSON.stringify({
        id: "ord_123",
        shipping: { full_name: "Ada", email: "ada@example.com", phone: "1", address_line1: "a", postal_code: "1", city: "Paris", country: "France" },
        total_amount: 120,
        status: "pending",
        order_status: "pending",
        payment_status: "unpaid",
        fulfillment_status: "unfulfilled",
        created_at: "2026-06-25T00:00:00Z",
        updated_at: "2026-06-25T00:00:00Z",
      }),
      { status: 201, headers: { "Content-Type": "application/json" } },
    )
  }

  globalThis.FormData = class FormDataMock {
    append() {}
  }
  globalThis.window = {}
  globalThis.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  }

  const payload = {
    items: [{ product_id: "prod_1", color: "Black", size: "M", qty: 2, variant_id: null, variant_item_id: "item-black-m", sku: "SKU-BM" }],
    shipping: {
      full_name: "Ada",
      email: "ada@example.com",
      phone: "1",
      address_line1: "a",
      postal_code: "1",
      city: "Paris",
      country: "France",
    },
    payment_method: "cod",
    promo_code: "WELCOME",
    loyalty_points_to_use: 20,
    pack_items: [{ pack_id: "pack_1", qty: 1, items: [{ component_id: "top", product_id: "prod_1", color: "Black", size: "M", qty: 1, variant_id: null, variant_item_id: "item-black-m", sku: "SKU-BM" }] }],
    user_id: "user_1",
  }

  const quote = await api.quoteOrder(payload)
  await api.createOrder(payload, "idem-123")

  assert.equal(quote.total, 112)
  assert.equal(calls.length, 2)
  assert.equal(calls[0].url.endsWith("/orders/quote"), true)
  assert.equal(calls[0].options.headers["Idempotency-Key"], undefined)
  assert.equal(calls[1].url.endsWith("/orders/"), true)
  assert.equal(calls[1].options.headers.get("Idempotency-Key"), "idem-123")

  const createPayload = JSON.parse(calls[1].options.body)
  assert.deepEqual(createPayload.items[0], { product_id: "prod_1", variant_id: "item-black-m", sku: "SKU-BM", qty: 2 })
  assert.equal(createPayload.promo_code, "WELCOME")
  assert.equal(createPayload.user_id, "user_1")
  assert.equal(createPayload.loyalty_points_to_use, 20)
  assert.equal(createPayload.pack_items, undefined)
  assert.deepEqual(createPayload.items[1], {
    product_id: "pack_1",
    variant_id: null,
    sku: null,
    qty: 1,
    bundle_selection: {
      components: [{ component_id: "top", variant_id: "item-black-m" }],
    },
  })
})
