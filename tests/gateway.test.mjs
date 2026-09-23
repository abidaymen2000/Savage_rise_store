import assert from "node:assert/strict"
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import test from "node:test"
import { CORE_SCHEMA_URL, GATEWAY_ORIGIN, getStorefrontHeaders, normalizeCoreBaseUrl } from "../lib/api/gateway-config.mjs"
import { downloadCoreSchema, generateApi, getRequiredOperations, normalizeCoreSchema } from "../scripts/generate-api.mjs"
// Deliberately import a standalone SSR consumer before the aggregate API.
import { getStorePage } from "../lib/api/store-pages-api.ts"
import { api } from "../lib/api.ts"

const coreBase = "https://yovo-api-gateway-a8da1d8e66a3.herokuapp.com/api/core"
const schema = () => ({
  openapi: "3.1.0", info: { title: "Core", version: "2" }, servers: [{ url: "/" }],
  paths: { "/api/core/catalog/products": { get: { operationId: "listProducts", responses: { 200: { description: "OK" } } } } },
})

test("gateway base accepts origin or Core base, rejecting malformed/doubled prefixes and credentials", () => {
  for (const base of [GATEWAY_ORIGIN, `${GATEWAY_ORIGIN}/`, `${GATEWAY_ORIGIN}/api/core`, `${GATEWAY_ORIGIN}/api/core/`]) {
    assert.equal(normalizeCoreBaseUrl(base), `${GATEWAY_ORIGIN}/api/core`)
  }
  assert.equal(normalizeCoreBaseUrl(), coreBase)
  assert.equal(normalizeCoreBaseUrl("https://store-api.example.invalid"), "https://store-api.example.invalid/api/core")
  for (const base of [`${coreBase}/api/core`, `${coreBase}/catalog`, `${GATEWAY_ORIGIN}?token=secret`, "https://user:secret@example.com", "ftp://example.com"]) {
    assert.throws(() => normalizeCoreBaseUrl(base))
  }
})

test("normalization preserves operation IDs, schemas and parameters with exactly one public prefix", () => {
  const input = schema()
  const output = normalizeCoreSchema(input, [{ method: "get", path: "/catalog/products" }])
  assert.equal(output.servers[0].url + Object.keys(output.paths)[0], `${GATEWAY_ORIGIN}/api/core/catalog/products`)
  assert.deepEqual(output.paths["/catalog/products"], input.paths["/api/core/catalog/products"])
  assert.equal(input.servers[0].url, "/")
  assert.throws(() => normalizeCoreSchema(input, [{ method: "post", path: "/orders/" }]), /missing storefront operations/)
  for (const input of [{}, { ...schema(), servers: [{ url: "/api/core" }] }, { ...schema(), paths: { "/catalog/products": schema().paths["/api/core/catalog/products"] } }]) {
    assert.throws(() => normalizeCoreSchema(input, []))
  }
})

test("schema download authenticates only to the discovered docs URL and fails on HTTP errors", async () => {
  let calls = 0
  await assert.rejects(downloadCoreSchema({ username: "", password: "", fetchImpl: () => { calls++; } }), /DOCS_USERNAME/)
  assert.equal(calls, 0)
  await assert.rejects(downloadCoreSchema({ username: "test", password: "test-secret", fetchImpl: async (url, init) => {
    assert.equal(url, CORE_SCHEMA_URL)
    assert.equal(init.redirect, "error")
    assert.equal(init.headers.Authorization, `Basic ${Buffer.from("test:test-secret").toString("base64")}`)
    return new Response("Unauthorized", { status: 401 })
  } }), /HTTP 401/)
})

test("failed downloads and incomplete schemas leave the existing client untouched", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "savage-gateway-test-"))
  try {
    const destination = path.join(root, "lib/api/generated")
    await mkdir(destination, { recursive: true })
    const sentinel = path.join(destination, "index.ts")
    await writeFile(sentinel, "existing client")
    await assert.rejects(generateApi({ root, download: async () => { throw new Error("unavailable") } }), /unavailable/)
    await assert.rejects(generateApi({ root, download: async () => schema() }), /missing storefront operations/)
    assert.equal(await readFile(sentinel, "utf8"), "existing client")
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test("generation validates storefront routes used across all wrappers", async () => {
  const required = await getRequiredOperations()
  assert.ok(!required.some((operation) => operation.path === "/health"))
  assert.ok(required.some((operation) => operation.path === "/contact"))
  assert.ok(required.some((operation) => operation.path === "/analytics/{company_slug}/events"))
  for (const route of ["/catalog/products", "/auth/token", "/orders/", "/storefront/config", "/storefront/pages/{slug}", "/storefront/navigation"]) {
    assert.ok(required.some((operation) => operation.path === route), route)
  }
})

test("successful staged generation uses the existing fetch generator and replaces the client only after success", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "savage-gateway-generation-"))
  try {
    const destination = path.join(root, "lib/api/generated")
    await mkdir(destination, { recursive: true })
    await writeFile(path.join(destination, "index.ts"), "previous client")
    const input = schema()
    input.paths["/api/core/analytics/{company_slug}/events"] = {
      post: { operationId: "trackEvent", parameters: [{ name: "company_slug", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "OK" } } },
    }
    await generateApi({ root, download: async () => input })
    assert.ok((await readFile(path.join(destination, "core/OpenAPI.ts"), "utf8")).includes(`BASE: '${GATEWAY_ORIGIN}/api/core'`))
    assert.ok((await readFile(path.join(destination, "core/request.ts"), "utf8")).includes("fetch(url, request)"))
    const service = await readFile(path.join(destination, "services/DefaultService.ts"), "utf8")
    assert.match(service, /public static trackEvent\(\{/)
    assert.ok(service.includes("url: '/analytics/{company_slug}/events'"))
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test("standalone CMS SSR and browser requests use Core with public store selection, preserving token, query and idempotency", async () => {
  const saved = { fetch: globalThis.fetch, window: globalThis.window, localStorage: globalThis.localStorage }
  const calls = []
  globalThis.fetch = async (url, options) => {
    calls.push({ url: String(url), options })
    return new Response(JSON.stringify({ id: "test", slug: "about", items: [], total: 0, page: 1, page_size: 1, pages: 0 }), { headers: { "Content-Type": "application/json" } })
  }
  try {
    delete globalThis.window
    await getStorePage("about")
    assert.equal(calls[0].url, `${coreBase}/storefront/pages/about`)
    assert.equal(calls[0].options.headers.get("Origin"), null)
    assert.equal(calls[0].options.headers.get("X-Store-Domain"), "savagerise.com")
    globalThis.window = {}
    globalThis.localStorage = { getItem: () => "customer-token" }
    await api.getProductsPage(0, 1, { q: "hoodie blue", categoryId: "tops" })
    assert.equal(calls[1].url, `${coreBase}/catalog/products?page=1&page_size=1&q=hoodie%20blue&category_id=tops`)
    assert.equal(calls[1].options.headers.get("Origin"), null)
    assert.equal(calls[1].options.headers.get("X-Store-Domain"), "savagerise.com")
    assert.equal(calls[1].options.headers.get("Authorization"), "Bearer customer-token")
    assert.equal(calls[1].options.credentials, undefined)
    await api.createOrder({ items: [], shipping: { full_name: "Test", email: "test@example.com", phone: "1", address_line1: "a", postal_code: "1", city: "Tunis", country: "Tunisia" } }, "gateway-test-key")
    assert.equal(calls[2].url, `${coreBase}/orders/`)
    assert.equal(calls[2].options.headers.get("Idempotency-Key"), "gateway-test-key")
    assert.equal(calls[2].options.method, "POST")
    assert.deepEqual(JSON.parse(calls[2].options.body).items, [])
    assert.deepEqual(getStorefrontHeaders(), { "X-Store-Domain": "savagerise.com" })
  } finally {
    for (const [key, value] of Object.entries(saved)) {
      if (value === undefined) delete globalThis[key]
      else globalThis[key] = value
    }
  }
})

test("verification navigation relays store context and accepts only the store auth redirect", async () => {
  const { GET } = await import("../app/api/auth/verify-email/route.ts")
  const original = globalThis.fetch
  try {
    globalThis.fetch = async (url, init) => {
      assert.equal(String(url), `${coreBase}/auth/verify-email?token=fixture`)
      assert.equal(init.headers["X-Store-Domain"], "savagerise.com")
      assert.equal(init.redirect, "manual")
      return new Response(null, { status: 302, headers: { Location: "https://savagerise.com/verify-success?access_token=fixture" } })
    }
    const response = await GET(new Request("http://localhost:3000/api/auth/verify-email?token=fixture"))
    assert.equal(response.status, 303)
    assert.equal(response.headers.get("location"), "http://localhost:3000/verify-success?access_token=fixture")
    for (const target of ["https://chaussuretanit.com/verify-success", "https://evil.invalid/verify-success", "https://savagerise.com/admin"]) {
      globalThis.fetch = async () => new Response(null, { status: 302, headers: { Location: target } })
      assert.equal((await GET(new Request("http://localhost:3000/api/auth/verify-email?token=fixture"))).headers.get("location"),
        "http://localhost:3000/email-verification-failed")
    }
  } finally { globalThis.fetch = original }
})
