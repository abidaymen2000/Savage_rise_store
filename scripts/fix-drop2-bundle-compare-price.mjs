const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://savage-rise-backend-8f0f0a23c13f.herokuapp.com"
const ADMIN_TOKEN = process.env.SAVAGE_RISE_ADMIN_TOKEN
const SLUG = "savage-rise-drop-2-pack"
const EXPECTED_BASE_PRICE = "129.99"
const EXPECTED_COMPARE_AT_PRICE = "151.80"

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(ADMIN_TOKEN ? { Authorization: `Bearer ${ADMIN_TOKEN}` } : {}),
      ...options.headers,
    },
  })
  const text = await response.text()
  const body = text ? JSON.parse(text) : null
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${JSON.stringify(body)}`)
  }
  return body
}

const product = await request(`/catalog/products/${SLUG}`)
if (product.product_kind !== "bundle") {
  throw new Error(`${SLUG} is ${product.product_kind}, expected bundle`)
}

const variant = product.variants?.[0]
if (!variant) throw new Error(`${SLUG} has no bundle variant`)

if (String(variant.base_price) !== EXPECTED_BASE_PRICE) {
  throw new Error(`${SLUG} base_price is ${variant.base_price}, expected ${EXPECTED_BASE_PRICE}`)
}

if (String(variant.compare_at_price) === EXPECTED_COMPARE_AT_PRICE) {
  console.log(`${SLUG} already has compare_at_price=${EXPECTED_COMPARE_AT_PRICE}`)
  process.exit(0)
}

if (!ADMIN_TOKEN) {
  throw new Error("Set SAVAGE_RISE_ADMIN_TOKEN to patch compare_at_price")
}

await request(`/admin/catalog/variants/${variant.id}`, {
  method: "PATCH",
  body: JSON.stringify({
    base_price: EXPECTED_BASE_PRICE,
    compare_at_price: EXPECTED_COMPARE_AT_PRICE,
    expected_version: variant.version,
  }),
})

const updated = await request(`/catalog/products/${SLUG}`)
const updatedVariant = updated.variants?.[0]
console.log(`${SLUG} compare_at_price=${updatedVariant?.compare_at_price}`)
