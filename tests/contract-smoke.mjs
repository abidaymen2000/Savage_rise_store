import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { pathToFileURL } from "node:url"
import ts from "typescript"

const repoRoot = process.cwd()

async function importTranspiledModule(relativePath) {
  const sourcePath = path.join(repoRoot, relativePath)
  const source = await fs.readFile(sourcePath, "utf8")
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: sourcePath,
  })

  const tempPath = path.join(
    os.tmpdir(),
    `savage-rise-${path.basename(relativePath, path.extname(relativePath))}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.mjs`,
  )
  await fs.writeFile(tempPath, output.outputText, "utf8")
  return import(`${pathToFileURL(tempPath).href}?t=${Date.now()}`)
}

test("inventory helper uses stock_available only", async () => {
  const inventory = await importTranspiledModule("lib/inventory.ts")

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

test("checkout idempotency key is stable until cleared", async () => {
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

  const idempotency = await importTranspiledModule("lib/checkout-idempotency.ts")

  assert.equal(idempotency.getOrCreateCheckoutIdempotencyKey(), "uuid-123")
  assert.equal(idempotency.getOrCreateCheckoutIdempotencyKey(), "uuid-123")
  assert.equal(idempotency.getOrCreateCheckoutIdempotencyKey("fingerprint-a"), "uuid-123")
  assert.equal(idempotency.getStoredCheckoutFingerprint(), null)
  idempotency.clearCheckoutIdempotencyKey()
  Object.defineProperty(globalThis, "crypto", {
    configurable: true,
    value: {
      randomUUID: () => "uuid-456",
    },
  })
  assert.equal(idempotency.getOrCreateCheckoutIdempotencyKey("fingerprint-a"), "uuid-456")
  assert.equal(idempotency.getStoredCheckoutFingerprint(), "fingerprint-a")
  Object.defineProperty(globalThis, "crypto", {
    configurable: true,
    value: {
      randomUUID: () => "uuid-789",
    },
  })
  assert.equal(idempotency.getOrCreateCheckoutIdempotencyKey("fingerprint-b"), "uuid-789")
  assert.equal(idempotency.getStoredCheckoutFingerprint(), "fingerprint-b")
})

test("order status helpers cover the new contract", async () => {
  const statusHelpers = await importTranspiledModule("lib/order-status.ts")

  assert.equal(statusHelpers.getCanonicalOrderStatus({ status: "pending", order_status: "confirmed" }), "confirmed")
  assert.equal(statusHelpers.canCancelOrder({ status: "pending" }), true)
  assert.equal(statusHelpers.canCancelOrder({ status: "preparing" }), false)
  assert.equal(statusHelpers.getOrderStatusLabel("return_in_transit"), "Return in transit")
  assert.equal(statusHelpers.getPaymentStatusLabel("partially_refunded"), "Partially refunded")
  assert.equal(statusHelpers.getFulfillmentStatusLabel("reserved"), "Reserved")
})

test("buildOrderPayload strips prices and unexpected fields", async () => {
  const { buildOrderPayload } = await importTranspiledModule("lib/order-payload.ts")

  const payload = buildOrderPayload({
    items: [
      {
        product: { id: "prod_1", price: 120 },
        selectedVariant: { color: "Black", sizes: [], images: [], meta_content_id: "meta-1" },
        selectedSize: "M",
        quantity: 2,
        unit_price: 999,
        line_total: 1998,
      },
    ],
    packItems: [
      {
        pack: { id: "pack_1" },
        quantity: 1,
        selections: [
          {
            component_id: "top",
            product_id: "prod_top",
            color: "Black",
            size: "L",
            qty: 1,
            unit_price: 55,
            product_name: "Hidden",
          },
        ],
      },
    ],
    shipping: {
      full_name: "Ada",
      email: "ada@example.com",
      phone: "1",
      address_line1: "a",
      address_line2: "",
      postal_code: "1",
      city: "Paris",
      country: "France",
    },
    promo_code: "WELCOME",
    loyalty_points_to_use: 20,
    user_id: "user_1",
  })

  assert.deepEqual(payload.items, [{ product_id: "prod_1", color: "Black", size: "M", qty: 2 }])
  assert.deepEqual(payload.pack_items, [
    {
      pack_id: "pack_1",
      qty: 1,
      items: [{ component_id: "top", product_id: "prod_top", color: "Black", size: "L", qty: 1 }],
    },
  ])
  assert.equal(payload.shipping.address_line2, null)
  assert.equal("unit_price" in payload.items[0], false)
  assert.equal("line_total" in payload.items[0], false)
  assert.equal("product_name" in payload.pack_items[0].items[0], false)
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

  const { api } = await importTranspiledModule("lib/api.ts")

  const payload = {
    items: [{ product_id: "prod_1", color: "Black", size: "M", qty: 2 }],
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
    pack_items: [{ pack_id: "pack_1", qty: 1, items: [{ component_id: "top", product_id: "prod_1", color: "Black", size: "M", qty: 1 }] }],
    user_id: "user_1",
  }

  const quote = await api.quoteOrder(payload)
  await api.createOrder(payload, "idem-123")

  assert.equal(quote.total, 112)
  assert.equal(calls.length, 2)
  assert.equal(calls[0].url.endsWith("/orders/quote"), true)
  assert.equal(calls[0].options.headers["Idempotency-Key"], undefined)
  assert.equal(calls[1].url.endsWith("/orders/"), true)
  assert.equal(calls[1].options.headers["Idempotency-Key"], "idem-123")

  const createPayload = JSON.parse(calls[1].options.body)
  assert.deepEqual(createPayload.items[0], { product_id: "prod_1", color: "Black", size: "M", qty: 2 })
  assert.equal("unit_price" in createPayload.items[0], false)
  assert.equal(createPayload.promo_code, "WELCOME")
  assert.equal(createPayload.user_id, "user_1")
  assert.equal(createPayload.loyalty_points_to_use, 20)
  assert.equal(createPayload.pack_items[0].pack_id, "pack_1")
})
