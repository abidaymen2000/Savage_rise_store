// Local-only browser fixture. No production calls or real orders are possible.
import { createServer } from "node:http"
import { FALLBACK_STORE_CONFIG } from "../../lib/store-config-shared.ts"

const product = {
  id: "fixture-product", name: "Produit de test local", slug: "fixture-product", product_kind: "physical", status: "active",
  category_ids: ["fixture-category"], default_currency: "TND", media: [{ url: "/placeholder.svg" }],
  variants: ["M", "L"].map((size, index) => ({
    id: `fixture-${size}`, title: `Black / ${size}`, option_values: { size, color: "Black" }, sku: `TEST-${size}`,
    base_price: String(100 + index * 10), effective_price: String(80 + index * 10), currency: "TND", status: "active",
    media: [{ url: "/placeholder.svg" }],
    inventory: { track_inventory: true, stock_available: 3, stock_on_hand: 3, stock_reserved: 0, in_stock: true },
  })),
}

createServer(async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "http://localhost:3101")
  response.setHeader("Access-Control-Allow-Headers", "content-type,x-store-domain,authorization,idempotency-key")
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
  response.setHeader("Content-Type", "application/json")
  const url = new URL(request.url, "http://localhost")
  const route = url.pathname.replace(/^\/api\/core/, "")
  const reply = (data, status = 200) => { response.statusCode = status; response.end(JSON.stringify(data)) }
  if (route.startsWith("/analytics/")) return reply({ message: "Simulated analytics failure" }, 503)
  if (request.method === "OPTIONS") return reply({})
  if (request.headers["x-store-domain"] !== "savagerise.com") return reply({ code: "STORE_DOMAIN_UNKNOWN" }, 404)
  if (route === "/orders/" && request.method === "POST") return reply({ message: "Order creation disabled in this fixture" }, 405)
  if (route === "/orders/quote" && request.method === "POST") {
    let body = ""
    for await (const chunk of request) body += chunk
    const payload = JSON.parse(body)
    const subtotal = payload.items.reduce((sum, item) => sum + item.qty * (item.variant_id === "fixture-L" ? 90 : 80), 0)
    return reply({ subtotal, total: subtotal + 7, total_amount: subtotal + 7, shipping_amount: 7, promotion_discount: 0, loyalty_discount: 0, bundle_discount: 0, currency: "TND", items: [], warnings: [] })
  }
  if (route === "/catalog/categories") return reply([{ id: "fixture-category", name: "T-shirts", slug: "t-shirts" }])
  if (route === "/catalog/products") {
    const items = url.searchParams.get("product_kind") === "bundle" ? [] : [product]
    return reply({ items, total: items.length, page: 1, page_size: Number(url.searchParams.get("page_size") || 100), pages: items.length ? 1 : 0 })
  }
  if (route === "/catalog/products/fixture-product") return reply(product)
  if (route === "/storefront/config") return reply({ ...FALLBACK_STORE_CONFIG, feature_flags: { wishlist: false, reviews: false, loyalty: false, packs: true } })
  if (route === "/storefront/navigation") return reply({ menus: [] })
  return reply({ detail: "Fixture resource not found" }, 404)
}).listen(18101, "127.0.0.1", () => console.log("SIMULATED API ready on 127.0.0.1:18101; production order creation is impossible"))
