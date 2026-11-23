import { chromium, expect as pwExpect } from '../.tmp/qa/node_modules/@playwright/test/index.mjs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const base = process.env.ENTRANCE_TEST_URL || 'http://127.0.0.1:49176'
const fixture = process.env.ENTRANCE_FIXTURE_URL || 'http://127.0.0.1:49175'
const out = 'artifacts/entrance-restoration/resilience'
const expect = pwExpect.configure({ timeout: 25000 })
const report = { base, checks: [], failures: [] }
const state = value => fetch(fixture + '/__test/state', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(value) })
const reset = () => fetch(fixture + '/__test/reset', { method: 'POST' })
if (!(await (await fetch(fixture + '/health')).json()).fixture) throw new Error('Local fixture required')
await mkdir(out, { recursive: true })
const film = await readFile('.tmp/qa/test-video.webm')
// Reuse the published poster for deterministic timing, never a substitute product image.
const published = JSON.parse(await readFile('artifacts/store-redesign/before/studio.json', 'utf8')).studio.hero
const posterUrl = new URL(published.poster.url)
posterUrl.searchParams.set('tr', 'w-1200,q-75,f-auto')
const posterResponse = await fetch(posterUrl, { signal: AbortSignal.timeout(30000) })
if (!posterResponse.ok) throw new Error('Published poster download failed: ' + posterResponse.status)
const poster = Buffer.from(await posterResponse.arrayBuffer())
const posterType = posterResponse.headers.get('content-type')
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const capture = async (page, path) => {
  const session = await page.context().newCDPSession(page)
  const { data } = await session.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
  await writeFile(path, Buffer.from(data, 'base64'))
  await session.detach()
}

async function run(name, options = {}) {
  await reset()
  await state({ video: true, ...(options.noPoster ? { hero: { poster: null } } : {}), ...(options.imageOnly ? { video: false, hero: { media: { ...published.poster, mime: 'image/jpeg' } } } : {}) })
  const viewport = { width: options.width || 390, height: options.width === 1440 ? 900 : 844 }
  const context = await browser.newContext({ viewport, reducedMotion: options.reduced ? 'reduce' : 'no-preference', javaScriptEnabled: !options.noJS,
    ...(options.record ? { recordVideo: { dir: out, size: viewport } } : {}) })
  const errors = [], analytics = []
  const held = []
  await context.route('**/*', async route => {
    const url = new URL(route.request().url())
    if (url.pathname.includes('/analytics/') && route.request().method() === 'POST') {
      const body = route.request().postDataJSON()
      analytics.push({ event: body.event_name, session: body.session_id, page: body.page_path })
    }
    if (options.noChunks && url.pathname.includes('/_next/') && url.pathname.endsWith('.js')) return route.abort()
    if (url.pathname.endsWith('/film.webm')) {
      if (options.videoFailure) return route.abort()
      if (options.videoHang) { held.push(route); return }
      return route.fulfill({ contentType: 'video/webm', body: film })
    }
    if (url.pathname.includes('/store/hero/images/') && url.pathname.includes('9934b6')) {
      if (options.imageFailure) return route.abort()
      if (options.imageCorrupt) return route.fulfill({ contentType: 'image/jpeg', body: 'not a decodable image' })
      if (options.imageHang || options.releaseLate) { held.push(route); return }
      if (options.delay) await new Promise(resolve => setTimeout(resolve, options.delay))
      return route.fulfill({ contentType: posterType, body: poster })
    }
    if (['localhost', '127.0.0.1'].includes(url.hostname)) return route.continue()
    if (url.hostname === 'ik.imagekit.io' && ['GET', 'HEAD'].includes(route.request().method())) return route.continue()
    return route.abort()
  })
  await context.addInitScript(({ storageBlocked }) => {
    localStorage.setItem('theme', 'light')
    if (storageBlocked) Object.defineProperty(window, 'sessionStorage', { get() { throw new DOMException('Storage disabled', 'SecurityError') } })
    window.resilienceQA = { states: [], posters: [], videos: [], emptyFrames: [], unlock: null }
    // The controller starts before first paint. Capture its synchronous event:
    // requestAnimationFrame can start late when fonts or chunks are blocked.
    window.addEventListener('savage-rise:entrance-change', () => {
      const stage = document.documentElement.dataset.storeEntrance
      if (stage && stage !== window.resilienceQA.states.at(-1)?.stage) window.resilienceQA.states.push({ stage, time: performance.now() })
    })
    const sample = () => {
      const qa = window.resilienceQA, now = performance.now()
      const stage = document.documentElement.dataset.storeEntrance
      if (stage && stage !== qa.states.at(-1)?.stage) qa.states.push({ stage, time: now })
      const hero = document.querySelector('[data-hero-media]')
      if (hero) {
        const image = hero.querySelector('img'), fallback = hero.querySelector('[data-hero-fallback]'), video = hero.querySelector('video')
        const hasImage = !!image?.complete && image.naturalWidth > 0 && +getComputedStyle(image).opacity > 0
        const hasFallback = !!fallback && fallback.getBoundingClientRect().height > 0 && getComputedStyle(fallback).display !== 'none' && getComputedStyle(fallback).backgroundColor !== 'rgba(0, 0, 0, 0)'
        const hasVideo = !!video && !video.paused && video.readyState >= 2 && +getComputedStyle(video).opacity > 0
        const posterState = hero.querySelector('[data-hero-poster]')?.dataset.heroPosterState
        if (posterState && posterState !== qa.posters.at(-1)?.state) qa.posters.push({ state: posterState, time: now })
        if (['revealing', 'complete'].includes(stage) && !hasImage && !hasFallback && !hasVideo) qa.emptyFrames.push(now)
      }
      if (!qa.unlock && document.querySelector('[data-store-entrance-pending="false"]')) qa.unlock = now
      requestAnimationFrame(sample)
    }
    requestAnimationFrame(sample)
    for (const type of ['playing', 'ended']) document.addEventListener(type, event => {
      if (event.target instanceof HTMLVideoElement && event.target.closest('[data-playback="hero-cycle"]')) window.resilienceQA.videos.push({ type, time: performance.now() })
    }, true)
  }, options)
  const page = await context.newPage()
  page.on('pageerror', e => { if (errors.length < 12) errors.push({ message: e.message, stack: e.stack }) })
  let cdp
  if (options.throttled) {
    cdp = await context.newCDPSession(page)
    await cdp.send('Network.enable')
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 300, downloadThroughput: 192000, uploadThroughput: 64000 })
  }
  let data
  try {
    await page.goto(base, { waitUntil: 'commit', timeout: 120000 })
    if (options.skip) {
      await expect(page.locator('.store-entrance-skip')).toBeVisible()
      await page.locator('.store-entrance-skip').click()
    }
    if (!options.noJS) await expect(page.locator('html')).toHaveAttribute('data-store-entrance', 'complete')
    await expect(page.locator('main').first()).toBeVisible()
    if (options.throttled) {
      // Prove the pre-hydration transition under a slow connection, then let
      // the large development-only bundles finish on a recovered connection.
      await expect(page.locator('[data-hero-fallback]').first()).toBeVisible()
      await capture(page, join(out, name + '-before-hydration.png'))
      await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 })
    }
    const hero = page.locator('[data-hero-media]').first()
    if (!options.throttled && (options.delay || options.imageFailure || options.imageCorrupt || options.imageHang || options.releaseLate || options.noPoster || options.noJS)) {
      await expect(hero.locator('[data-hero-poster]')).toHaveAttribute('data-hero-poster-state', 'fallback')
      await expect(hero.locator('[data-hero-fallback]')).toBeVisible()
    }
    // Observe the reveal itself, before waiting for hydration or font decoding.
    await capture(page, join(out, name + '-reveal.png'))
    if (!options.noJS && !options.noChunks) await expect(page.locator('[data-studio-hydrated="true"]')).toHaveCount(1)
    if (options.noJS || options.noChunks) {
      expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflowY)).not.toBe('hidden')
    } else if (!options.reduced && !options.imageOnly && !options.videoFailure && !options.videoHang) {
      await expect(hero).toHaveAttribute('data-playback-state', 'video')
      if (options.releaseLate) {
        for (const route of held.splice(0)) await route.fulfill({ contentType: posterType, body: poster })
        await expect(hero.locator('[data-hero-poster]')).toHaveAttribute('data-hero-poster-state', 'ready')
        await expect(hero).toHaveAttribute('data-playback-state', 'poster')
        await expect(hero).toHaveAttribute('data-playback-state', 'video')
      }
      await expect.poll(() => page.evaluate(() => window.resilienceQA.videos.filter(v => v.type === 'playing').length)).toBeGreaterThanOrEqual(options.releaseLate ? 3 : 2)
    } else if (options.videoHang) {
      await page.waitForTimeout(3000)
      await expect(hero).toHaveAttribute('data-playback-state', 'poster')
    } else if (options.videoFailure) {
      await expect(hero).toHaveAttribute('data-media-state', 'error')
    } else if (options.reduced) {
      await expect(hero).toHaveAttribute('data-playback-state', 'poster')
    }
    if (!options.noJS) {
      data = await page.evaluate(() => window.resilienceQA)
      expect(data.emptyFrames).toEqual([])
      const start = data.states.find(s => s.stage === 'pending')?.time
      const end = data.states.find(s => s.stage === 'complete')?.time
      expect(end - start).toBeLessThan(options.reduced ? 1000 : 4300)
      if (!options.skip && !options.reduced) expect(end - start).toBeGreaterThanOrEqual(3250)
      if (data.videos.length) {
        expect(data.videos[0].time - Math.max(end, data.unlock)).toBeGreaterThanOrEqual(1950)
        const ready = data.posters.find(p => p.state === 'ready')
        if (ready) {
          const nextPlay = data.videos.find(v => v.type === 'playing' && v.time > ready.time)
          if (nextPlay) expect(nextPlay.time - Math.max(ready.time, data.unlock)).toBeGreaterThanOrEqual(1950)
        }
        const ended = data.videos.find(v => v.type === 'ended')
        const restart = data.videos.find(v => v.type === 'playing' && v.time > ended?.time)
        if (restart) expect(restart.time - ended.time).toBeGreaterThanOrEqual(1950)
      }
    }
    await page.evaluate(() => scrollTo(0, 500))
    expect(await page.evaluate(() => scrollY)).toBeGreaterThan(0)
    if (options.storageBlocked) {
      await page.locator('.store-header a[href="/products"]').first().click()
      await expect(page).toHaveURL(/\/products$/)
      await page.locator('a[href="/products/sr-ombra-oversized-hoodie"]').first().click()
      await expect(page).toHaveURL(/sr-ombra-oversized-hoodie$/)
      await expect(page.locator('.store-add-button')).toBeEnabled()
      await page.locator('.store-header a[href="/"]').first().click()
      await expect(page).toHaveURL(base + '/')
      await expect(page.locator('[data-studio-hydrated="true"]')).toHaveCount(1)
      await expect(page.locator('.store-entrance')).toHaveCount(0)
      expect(await page.evaluate(() => { try { return window.sessionStorage !== undefined } catch { return false } })).toBe(false)
      expect(new Set(analytics.map(e => e.session)).size).toBe(1)
      expect(analytics.every(e => typeof e.session === 'string' && e.session.length > 0)).toBe(true)
      expect(analytics.some(e => e.event === 'page_view' && e.page === '/products')).toBe(true)
      data.analytics = { events: analytics.map(({event,page})=>({event,page})), uniqueSessions: new Set(analytics.map(e=>e.session)).size }
    }
    expect(errors).toEqual([])
    report.checks.push({ name, passed: true, options, data })
    console.log('PASS ' + name)
  } catch (error) {
    data = await page.evaluate(() => window.resilienceQA).catch(() => null)
    report.failures.push({ name, error: error.message, errors, data })
    await page.screenshot({ path: join(out, name + '-failure.png') }).catch(() => {})
    console.log('FAIL ' + name + ': ' + error.message.split('Call log:')[0])
  } finally {
    for (const route of held) await route.abort().catch(() => {})
    const video = page.video()
    await context.close()
    if (video) await video.saveAs(join(out, name + '.webm'))
    await writeFile(join(out, process.argv.includes('--storage-only') ? 'storage-checks.json' : 'checks.json'), JSON.stringify(report, null, 2))
  }
}

try {
  if (process.argv.includes('--storage-only')) await run('storage-denied', { storageBlocked: true, width: 1440 })
  else {
    await run('slow-poster-desktop', { width: 1440, delay: 7000, record: true })
    await run('slow-poster-mobile', { delay: 7000, record: true })
    await run('throttled-network', { throttled: true, delay: 7000 })
    await run('failed-poster', { imageFailure: true })
    await run('corrupt-poster', { imageCorrupt: true })
    await run('stalled-poster', { imageHang: true })
    await run('poster-arrives-during-video', { releaseLate: true })
    await run('missing-poster', { noPoster: true })
    await run('failed-poster-and-video', { imageFailure: true, videoFailure: true })
    await run('stalled-video', { videoHang: true })
    await run('static-hero-failed-image', { imageOnly: true, imageFailure: true })
    await run('skip-with-slow-poster', { skip: true, delay: 7000 })
    await run('reduced-with-failed-image', { reduced: true, imageFailure: true })
    await run('no-javascript-failed-image', { noJS: true, imageFailure: true })
    await run('missing-chunks-failed-image', { noChunks: true, imageFailure: true })
  }
} finally {
  await browser.close()
  await reset()
  await writeFile(join(out, process.argv.includes('--storage-only') ? 'storage-checks.json' : 'checks.json'), JSON.stringify(report, null, 2))
  if (report.failures.length) process.exitCode = 1
}
