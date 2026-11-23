import { chromium } from '../.tmp/qa/node_modules/@playwright/test/index.mjs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { Script } from 'node:vm'

const base = 'http://127.0.0.1:49176'
const out = 'artifacts/entrance-restoration/javascript-diagnostic'
await mkdir(out, { recursive: true })
const report = { base, started: new Date().toISOString(), runs: [] }
const rounds = Number(process.env.ENTRANCE_DIAGNOSTIC_ROUNDS || 3)
const successful = report => report.runs.length === rounds * 2 && report.runs.every(run =>
  run.dom?.hydrated === 'true' && !run.errors.length && !run.failedParsing.length &&
  // Tracking is deliberately blocked by the browser route above; it is not
  // an application chunk failure and must remain visible in the raw evidence.
  run.failedRequests.every(request => request.url === 'https://connect.facebook.net/en_US/fbevents.js') &&
  run.network.length > 0 && run.network.every(response => response.status === 200 && response.bytes > 0 && response.parse === 'PASS'))
if (process.argv.includes('--verify-report')) {
  const captured = JSON.parse(await readFile(out + '/checks.json', 'utf8'))
  captured.passed = successful(captured)
  captured.validationNote = 'Rechecked existing raw captures; the explicitly blocked Meta tracking script is excluded from application chunk failures. No browser run invented.'
  await writeFile(out + '/checks.json', JSON.stringify(captured, null, 2))
  console.log(`${captured.passed ? 'PASS' : 'FAIL'} ${captured.runs.length} captured visits; JavaScript response and hydration checks`)
  process.exit(captured.passed ? 0 : 1)
}
// Match the existing browser suite: complete cold development compilation
// before measuring a fresh browser visit. Production compilation is separate.
for (const path of ['/', '/products', '/products/sr-ombra-oversized-hoodie']) {
  const response = await fetch(base + path)
  if (!response.ok) throw new Error(`Warmup ${path}: ${response.status}`)
  await response.arrayBuffer()
}
const browser = await chromium.launch({ channel: 'chrome', headless: true })
try {
  for (let round = 0; round < rounds; round++) for (const width of [390, 768]) {
    const result = { round, width, started: new Date().toISOString(), errors: [], exceptions: [], failedParsing: [], network: [], failedRequests: [], sockets: [] }
    const context = await browser.newContext({ viewport: { width, height: 900 } })
    await context.route('**/*', route => {
      const url = new URL(route.request().url())
      if (['127.0.0.1', 'localhost'].includes(url.hostname)) return route.continue()
      if (url.hostname === 'ik.imagekit.io' && ['GET', 'HEAD'].includes(route.request().method())) return route.continue()
      return route.abort()
    })
    await context.addInitScript(() => { if (location.protocol !== 'about:') localStorage.setItem('theme', 'light') })
    const page = await context.newPage()
    const cdp = await context.newCDPSession(page)
    const pending = []
    page.on('pageerror', e => result.errors.push({ name: e.name, message: e.message, stack: e.stack }))
    page.on('requestfailed', r => { if (r.resourceType() === 'script') result.failedRequests.push({ url: r.url(), error: r.failure() }) })
    page.on('websocket', socket => socket.on('framereceived', ({ payload }) => { const text = String(payload); if (/building|built|sync|reload/.test(text)) result.sockets.push({ at: Date.now(), message: text.slice(0, 1200) }) }))
    page.on('response', response => {
      if (response.request().resourceType() !== 'script') return
      pending.push((async () => {
        const item = { url: response.url(), status: response.status(), headers: await response.allHeaders(), at: Date.now() }
        try {
          const body = await response.body()
          item.bytes = body.length
          item.sha256 = createHash('sha256').update(body).digest('hex')
          try { new Script(body.toString('utf8'), { filename: item.url }); item.parse = 'PASS' }
          catch (error) {
            item.parse = 'FAIL'; item.parseError = error.stack
            const name = `invalid-${round}-${width}-${result.network.length}.js`
            await writeFile(out + '/' + name, body); item.savedAs = name
          }
        } catch (error) { item.bodyError = error.message }
        result.network.push(item)
      })())
    })
    cdp.on('Runtime.exceptionThrown', event => result.exceptions.push(event.exceptionDetails))
    cdp.on('Debugger.scriptFailedToParse', event => {
      result.failedParsing.push(event)
      pending.push(cdp.send('Debugger.getScriptSource', { scriptId: event.scriptId }).then(async source => {
        const file = `parse-${round}-${width}-${event.scriptId}.js`
        await writeFile(out + '/' + file, source.scriptSource); event.savedAs = file
      }).catch(error => { event.sourceError = error.message }))
    })
    await cdp.send('Runtime.enable')
    await cdp.send('Debugger.enable')
    try {
      await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 120000 })
      await page.waitForFunction(() => document.querySelector('[data-studio-hydrated="true"]'), null, { timeout: 30000 }).catch(e => { result.hydrationError = e.message })
      await page.waitForTimeout(7000)
      result.dom = await page.evaluate(() => ({ entrance: document.documentElement.dataset.storeEntrance, hydrated: document.querySelector('[data-studio-hydrated]')?.getAttribute('data-studio-hydrated'), readyState: document.readyState, hero: document.querySelector('[data-hero-media]')?.outerHTML.slice(0, 500), scriptCount: document.scripts.length }))
    } catch (error) { result.navigationError = error.message }
    await Promise.allSettled(pending)
    result.finished = new Date().toISOString()
    report.runs.push(result)
    await writeFile(out + '/checks.json', JSON.stringify(report, null, 2))
    console.log(JSON.stringify({ round, width, errors: result.errors, failedParsing: result.failedParsing.length, invalidResponses: result.network.filter(r => r.parse === 'FAIL').map(r => ({url:r.url,bytes:r.bytes,savedAs:r.savedAs})), hydrated: result.dom?.hydrated, scripts: result.network.length }))
    await context.close()
  }
} finally {
  await browser.close()
  report.finished = new Date().toISOString()
  report.devServerLog = await readFile('artifacts/entrance-restoration/closure-dev-server.log', 'utf8').catch(() => '')
  report.passed = successful(report)
  await writeFile(out + '/checks.json', JSON.stringify(report, null, 2))
  if (!report.passed) process.exitCode = 1
}
