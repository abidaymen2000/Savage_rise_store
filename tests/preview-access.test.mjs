import assert from "node:assert/strict"
import test from "node:test"
import { NextRequest } from "next/server.js"
import { getApiBaseUrl, GATEWAY_ORIGIN } from "../lib/api/gateway-config.mjs"
import { previewFailure, studioOrigin, verifiedPreviewLifetime } from "../lib/preview-access.ts"
import { POST, GET as verifyCookie } from "../app/api/preview/route.ts"
import { GET } from "../app/preview/route.ts"

process.env.NEXT_PUBLIC_API_BASE_URL="http://127.0.0.1:8775"
process.env.NEXT_PUBLIC_STOREFRONT_DOMAIN="store.example"
const previewContext={version:1,session_id:"a".repeat(32),store_id:"s_1111111111111111",template_id:"savage-rise",draft_fingerprint:"b".repeat(64),published_revision:1}
const id = "s_1111111111111111", origin = "https://store.example"
const token = () => Buffer.from(JSON.stringify({ exp: Date.now() / 1000 + 90 })).toString("base64url") + ".local-test-signature"
const request = (body, from = origin) => new NextRequest(`${origin}/${id}/api/preview`, { method: "POST", headers: { origin: from, host: "store.example", "content-type": "application/json", "x-yovo-base-path": `/${id}`, "x-yovo-domain": "store.example" }, body: JSON.stringify(body) })
const run = (body, from) => POST(request(body, from), { params: { storeId: id } })
function env(t, key, value) { const previous = process.env[key]; process.env[key] = value; t.after(() => { if (previous === undefined) delete process.env[key]; else process.env[key] = previous }) }

test("an absent Gateway preview route is a routing failure, never token expiry", async t => {
  t.mock.method(globalThis, "fetch", async () => Response.json({ message: "no Route matched with those values" }, { status: 404 }))
  const r = await run({ token: token() })
  assert.equal(r.status, 502)
  assert.deepEqual(await r.json(), { error: "Preview is not configured correctly. Report this issue to your administrator.", code: "PREVIEW_ROUTE_MISSING", stage: "exchange", upstream_status: 404, retryable: false })
  assert.equal(r.headers.get("set-cookie"), null)
  assert.match(r.headers.get("cache-control"), /no-store/)
})

test("an authenticated exchange sets a private HTTPS cookie capped by token expiry", async t => {
  env(t, "STOREFRONT_PROXY_SECRET", "local-server-only-test")
  const credential = token()
  t.mock.method(globalThis, "fetch", async (url, init) => {
    assert.equal(url, "http://127.0.0.1:8775/api/core/storefront/studio/preview")
    assert.equal(init.headers["X-Store-Domain"], "store.example")
    assert.equal(init.headers["X-Store-Domain"], "store.example")
    assert.equal(init.headers["X-Store-Preview-Token"], credential)
    assert.equal(init.headers["X-Store-Proxy-Key"], "local-server-only-test")
    assert.equal(init.redirect, "manual")
    assert.equal(init.cache, "no-store")
    return Response.json({ preview: true, pages: [], theme: {}, preview_context:previewContext, manifest:{template_id:"savage-rise"}, studio:{} })
  })
  const r = await run({ token: credential, path: "/pages/a-propos" })
  assert.equal(r.status, 200)
  const cookie = r.headers.get('set-cookie')
  assert.match(cookie, /HttpOnly/); assert.match(cookie, /Secure/); assert.match(cookie, /SameSite=None/); assert.match(cookie, /Partitioned/)
  const age=Number(cookie.match(/Max-Age=(\d+)/)[1]);assert.ok(age>0&&age<=90)
  assert.ok(cookie.includes(encodeURIComponent(credential)))
  const body = await r.text()
  assert.equal(body, JSON.stringify({ location: "/pages/a-propos" }))
  assert.ok(!body.includes(credential) && !body.includes("local-server-only-test"))
})

test("foreign origins and missing credentials cannot reach Core or set cookies", async t => {
  let called = false
  t.mock.method(globalThis, "fetch", async () => { called = true })
  for (const from of ["https://other.example", "http://store.example", "null"]) {
    const r = await run({ token: token() }, from)
    assert.equal(r.status, 403)
    assert.equal(r.headers.get("set-cookie"), null)
  }
  assert.equal((await run({})).status, 401)
  assert.equal(called, false)
})

test("Next loopback normalization preserves exact origin and port protection", async t => {
  t.mock.method(globalThis, "fetch", async () => Response.json({ preview: true, pages: [], theme: {}, preview_context:previewContext, manifest:{template_id:"savage-rise"}, studio:{} }))
  for (const [source, status] of [["http://127.0.0.1:3009", 200], ["http://localhost:3009", 403], ["http://127.0.0.1:3008", 403], ["https://127.0.0.1:3009", 403]]) {
    const r = await POST(new NextRequest(`http://127.0.0.1:3009/${id}/api/preview`, { method: "POST", headers: { origin: source, host: "127.0.0.1:3009", "x-forwarded-host": new URL(source).host, "content-type": "application/json" }, body: JSON.stringify({ token: token() }) }), { params: { storeId: id } })
    assert.equal(r.status, status)
    if (status !== 200) assert.equal(r.headers.get("set-cookie"), null)
  }
})

test("expiry, forbidden tenant, initialization and contradictory domain stay distinct", async t => {
  for (const [status, body, expected] of [[401, { code: "PREVIEW_EXPIRED" }, "PREVIEW_EXPIRED"], [403, { code: "PREVIEW_INVALID" }, "PREVIEW_INVALID"], [409, { code: "STORE_CONTEXT_MISMATCH" }, "STORE_CONTEXT_MISMATCH"], [409, { detail: { code: "STORE_NOT_INITIALIZED" } }, "STORE_NOT_INITIALIZED"], [404, { code: "STORE_ID_UNKNOWN" }, "STORE_ID_UNKNOWN"], [423, {}, "PREVIEW_STORE_LOCKED"]]) {
    const mock = t.mock.method(globalThis, "fetch", async () => Response.json(body, { status }))
    const r = await run({ token: token() })
    assert.equal(r.status, status)
    assert.equal((await r.json()).code, expected)
    assert.equal(r.headers.get("set-cookie"), null)
    mock.mock.restore()
  }
})

test("network, timeout, redirects and incompatible successful responses never mint a cookie", async t => {
  for (const [reply, expectedStatus, code] of [[() => { throw new TypeError("private upstream details") }, 503, "PREVIEW_UNAVAILABLE"], [() => { throw new DOMException("private details", "TimeoutError") }, 504, "PREVIEW_UNAVAILABLE"], [() => new Response(null, { status: 302, headers: { location: "https://other.example" } }), 503, "PREVIEW_UNAVAILABLE"], [() => Response.json({ ok: true }), 502, "PREVIEW_CONTRACT_INVALID"]]) {
    const mock = t.mock.method(globalThis, "fetch", reply)
    const r = await run({ token: token() })
    assert.equal(r.status, expectedStatus)
    assert.equal((await r.json()).code, code)
    assert.equal(r.headers.get("set-cookie"), null)
    mock.mock.restore()
  }
})

test("preview destinations cannot redirect outside the current store", async t => {
  t.mock.method(globalThis, "fetch", async () => Response.json({ preview: true, pages: [], theme: {}, preview_context:previewContext, manifest:{template_id:"savage-rise"}, studio:{} }))
  for (const path of ["//other.example", "/../other", "/pages/a?token=x", "https://other.example"]) assert.equal((await (await run({ token: token(), path })).json()).location, "/")
  assert.equal(verifiedPreviewLifetime("invalid"), 0)
  assert.equal(previewFailure(503).code, "PREVIEW_UNAVAILABLE")
})

test("bootstrap removes the fragment and reports only a bounded failure to the trusted Studio", async t => {
  env(t, "NEXT_PUBLIC_STUDIO_ORIGIN", "https://app.yovoflow.com/")
  assert.equal(studioOrigin(), "https://app.yovoflow.com")
  assert.equal(studioOrigin("https://app.yovoflow.com/admin"), null)
  assert.equal(studioOrigin("https://user:private@app.yovoflow.com"), null)
  const r = GET(new NextRequest(`${origin}/${id}/preview`, { headers: { "x-yovo-base-path": `/${id}` } }))
  assert.match(r.headers.get("content-security-policy"), /frame-ancestors 'self' https:\/\/app\.yovoflow\.com/)
  const html = await r.text()
  assert.ok(html.indexOf("history.replaceState") < html.indexOf("const response=await fetch"))
  assert.match(html, /yovo:store-preview-error/)
  assert.match(html, /Return to Studio/)
  assert.match(html, /AbortSignal.timeout\(25000\)/)
})

test('browser cookie probe refuses silently falling back to the public Store',async()=>{
  const absent=verifyCookie(new NextRequest(origin+'/api/preview'),{params:{storeId:id}})
  assert.equal(absent.status,401);assert.equal((await absent.json()).code,'PREVIEW_COOKIE_UNAVAILABLE')
  const present=verifyCookie(new NextRequest(origin+'/api/preview',{headers:{cookie:'yovo_studio_preview=temporary'}}),{params:{storeId:id}})
  assert.equal(present.status,200);assert.match(present.headers.get('cache-control'),/no-store/)
})
