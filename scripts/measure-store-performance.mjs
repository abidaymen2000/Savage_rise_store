// Read-only browser laboratory. Never submits a production order or analytics event.
import { chromium } from '../.tmp/qa/node_modules/@playwright/test/index.mjs'
import { mkdir, writeFile } from 'node:fs/promises'
const base = process.env.PERF_BASE || 'https://www.savagerise.com'
const out = process.env.PERF_OUTPUT || 'artifacts/black-performance/evidence/public-browser'
const profiles = process.env.PERF_PROFILE ? [process.env.PERF_PROFILE] : ['desktop', 'mobile']
const samples = Number(process.env.PERF_SAMPLES || 1)
await mkdir(out, { recursive: true })
const report = { base, started: new Date().toISOString(), kind: 'lab; no field INP or field p75', runs: [], blockedWrites: [] }
const save = () => writeFile(out + '/measurements.json', JSON.stringify(report, null, 2))
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const ombra = '/products/sr-ombra-oversized-hoodie'
try {
  for (const profile of profiles) for (let repetition = 1; repetition <= samples; repetition++) {
    const mobile = profile === 'mobile'
    const context = await browser.newContext({ viewport: { width: mobile ? 390 : 1440, height: mobile ? 844 : 1000 }, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile })
    await context.addInitScript(() => {
      window.__perf = { lcp: null, shifts: [], events: [], longTasks: [] }
      for (const type of ['largest-contentful-paint', 'layout-shift', 'event', 'longtask']) {
        try { new PerformanceObserver(list => { for (const e of list.getEntries()) {
          if (type === 'largest-contentful-paint') window.__perf.lcp = { ms: e.startTime, url: e.url, element: e.element?.outerHTML.slice(0, 200) }
          if (type === 'layout-shift' && !e.hadRecentInput) window.__perf.shifts.push({ start: e.startTime, value: e.value })
          if (type === 'event' && e.interactionId) window.__perf.events.push({ start: e.startTime, duration: e.duration, name: e.name, interactionId: e.interactionId })
          if (type === 'longtask') window.__perf.longTasks.push({ start: e.startTime, duration: e.duration })
        } }).observe({ type, buffered: true, ...(type === 'event' ? { durationThreshold: 16 } : {}) }) } catch {}
      }
    })
    const page = await context.newPage(), cdp = await context.newCDPSession(page)
    await cdp.send('Network.enable')
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: false })
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: mobile ? 4 : 1 })
    if (mobile) await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1_600_000 / 8, uploadThroughput: 750_000 / 8, connectionType: 'cellular4g' })
    // CDP interception preserves the HTTP cache, unlike Playwright page.route.
    await cdp.send('Fetch.enable', { patterns: [{ urlPattern: '*', requestStage: 'Request' }] })
    cdp.on('Fetch.requestPaused', async e => {
      try {
        if (!['GET', 'HEAD'].includes(e.request.method)) {
          report.blockedWrites.push({ method: e.request.method, url: e.request.url.split('?')[0] })
          await cdp.send('Fetch.failRequest', { requestId: e.requestId, errorReason: 'Aborted' })
        } else await cdp.send('Fetch.continueRequest', { requestId: e.requestId })
      } catch {}
    })
    const network = new Map(), errors = []
    let current
    cdp.on('Network.requestWillBeSent', e => network.set(e.requestId, { url: e.request.url, method: e.request.method, type: e.type, start: e.timestamp, step: current?.name }))
    cdp.on('Network.responseReceived', e => { const n = network.get(e.requestId); if(n) Object.assign(n, { status: e.response.status, mime: e.response.mimeType, cache: Boolean(e.response.fromDiskCache || e.response.fromServiceWorker), headers: Object.fromEntries(Object.entries(e.response.headers).filter(([k]) => /^(cache-control|age|etag|vary|x-vercel.*|x-matched-path|server|server-timing)$/i.test(k))), ttfbMs: (e.timestamp - n.start) * 1000 }) })
    cdp.on('Network.loadingFinished', e => { const n = network.get(e.requestId); if(n) Object.assign(n, { bytes: e.encodedDataLength, ms: (e.timestamp - n.start) * 1000 }) })
    page.on('pageerror', e => errors.push({ step: current?.name, message: e.message, stack: e.stack }))
    page.on('response', async r => {
      if (new URL(r.url()).searchParams.has('_rsc') && current) {
        const step = current
        try {
          const text = await r.text(); step.rsc ??= []; step.rsc.push({ path: new URL(r.url()).pathname, bytes: Buffer.byteLength(text), darkBlack: text.includes('Dark Black'), black: text.includes('"Black"') })
          await writeFile(`${out}/${profile}-${repetition}-${step.name}-${step.rsc.length}.rsc.txt`, text)
        } catch {}
      }
    })
    async function step(name, action, ready) {
      const fixture = process.env.PERF_FIXTURE
      const apiStart = fixture ? (await (await fetch(fixture+'/__test/metrics')).json()).length : 0
      const start = performance.now(), browserStart = await page.evaluate(() => performance.now()).catch(() => 0)
      current = { profile, repetition, name, network: [], cpu: mobile ? 4 : 1, networkProfile: mobile ? '1.6Mbps down / 750Kbps up / 150ms RTT' : 'unthrottled', coldContext: name === 'cold-home' }
      const s = current
      try {
        const response = await action()
        if (response?.status) { s.status = response.status(); s.documentTtfbMs = (await response.request().timing()).responseStart; const html = await response.text(); s.ssrDarkBlack = html.includes('Dark Black'); await writeFile(`${out}/${profile}-${repetition}-${name}.html`, html) }
        if (ready) await page.locator(ready).first().waitFor({ state: 'visible', timeout: 90000 })
        if (s.status !== 404) await page.locator('[data-studio-hydrated="true"]').waitFor({ state: 'attached', timeout: 60000 })
        s.contentReadyMs = performance.now() - start
        await page.waitForTimeout(mobile ? 3500 : 2500)
        s.browser = await page.evaluate(({ documentLoad, browserStart }) => {
          const p = window.__perf, nav = performance.getEntriesByType('navigation')[0], since = documentLoad ? 0 : browserStart
          const shifts = p.shifts.filter(e => e.start >= since)
          let cls = 0, group = 0, first = 0, last = 0
          for (const s of shifts) { if(s.start - last > 1000 || s.start - first > 5000) { group = 0; first = s.start }; group += s.value; cls = Math.max(cls, group); last = s.start }
          const events = p.events.filter(e => e.start >= since)
          return { ttfb: documentLoad ? nav?.responseStart : null, lcp: documentLoad ? p.lcp : null, cls, interactionLatencyLabMax: events.length ? Math.max(...events.map(e => e.duration)) : null, eventCount: events.length, longTasks: p.longTasks.filter(e => e.start >= since), images: [...document.images].filter(i => i.complete && i.naturalWidth).map(i => ({ src: i.currentSrc, sizes: i.sizes, width: i.clientWidth, naturalWidth: i.naturalWidth, loading: i.loading, priority: i.fetchPriority })), overflow: document.documentElement.scrollWidth > innerWidth, entrance: document.documentElement.dataset.storeEntrancePending }
        }, { documentLoad: Boolean(response?.status), browserStart })
        s.url = page.url(); s.darkBlackButtons = await page.getByRole('button', { name: /Dark Black/i }).count(); s.blackButtons = await page.getByRole('button', { name: /Black/i }).evaluateAll(els => els.map(e => ({ label: e.getAttribute('aria-label') || e.textContent, background: getComputedStyle(e.querySelector('span') || e).backgroundColor })))
        if (/ombra|id-|on-|cold-home/.test(name)) await page.screenshot({ path: `${out}/${profile}-${repetition}-${name}.png` })
      } catch (e) { s.error = e.message }
      s.totalMs = performance.now() - start; s.network = [...network.values()].filter(n => n.step === name); s.errors = errors.filter(e => e.step === name)
      s.jsBytes = s.network.filter(n => /javascript/.test(n.mime || '')).reduce((sum, n) => sum + (n.bytes || 0), 0)
      s.imageRequests = s.network.filter(n => n.type === 'Image').length
      s.browserApi = s.network.filter(n => n.url.includes('/api/core/'))
      if (fixture) {
        s.serverApi = (await (await fetch(fixture+'/__test/metrics')).json()).slice(apiStart)
        s.productDataMs = Math.max(0, ...s.serverApi.filter(n=>n.path.startsWith('/catalog/products')).map(n=>n.at + (n.ms||0))) - Math.min(...s.serverApi.filter(n=>n.path.startsWith('/catalog/products')).map(n=>n.at))
      }
      s.navigationRequests = s.network.filter(n => n.type === 'Document' || n.url.includes('_rsc='))
      report.runs.push(s); await save(); console.log(JSON.stringify({ profile, repetition, name, ready: Math.round(s.contentReadyMs || 0), lcp: s.browser?.lcp?.ms, darkBlack: s.darkBlackButtons, error: s.error, pageErrors: s.errors.length }))
      return s
    }
    async function nav(href) {
      await page.locator('[data-studio-hydrated="true"]').waitFor({ state: 'attached', timeout: 120000 })
      let link = page.locator(`.store-header a[href="${href}"]`).filter({ visible: true }).first()
      if (!await link.count()) { const menu = page.getByRole('button', { name: /Open menu|Toggle menu/i }); if(await menu.count()) await menu.first().click(); link = page.locator(`a[href="${href}"]`).filter({ visible: true }).first() }
      await link.click(); await page.waitForURL(base + href, { timeout: 90000 })
    }
    const goto = path => page.goto(base + path, { waitUntil: 'domcontentloaded', timeout: 120000 })
    await step('cold-home', () => goto('/'), '.store-product-card')
    await step('home-shop', () => nav('/products'), '.store-catalog .store-product-card')
    await step('shop-ombra', async () => { await page.locator(`a[href="${ombra}"]`).first().click(); await page.waitForURL(base + ombra, { timeout: 90000 }) }, '.store-product-detail')
    await step('ombra-shop', () => page.getByRole('link', { name: 'Back to Shop', exact: true }).click(), '.store-catalog .store-product-card')
    await step('shop-ombra-warm', async () => { await page.locator(`a[href="${ombra}"]`).first().click(); await page.waitForURL(base + ombra, { timeout: 90000 }) }, '.store-product-detail')
    await step('refresh-ombra', () => page.reload({ waitUntil: 'domcontentloaded', timeout: 120000 }), '.store-product-detail')
    await step('id-ombra', () => goto('/products/6b032d527b49ec9b6c39ec4d'), '.store-product-detail')
    await step('about', () => nav('/about'), 'main')
    await step('back', () => page.goBack({ waitUntil: 'domcontentloaded', timeout: 120000 }), '.store-product-detail')
    await step('on-route', () => goto('/on'), 'body')
    await step('on-shop', () => nav('/products'), '.store-catalog .store-product-card')
    await context.close()
  }
} finally { await browser.close(); report.finished = new Date().toISOString(); await save() }
