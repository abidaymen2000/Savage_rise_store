import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
const { test, expect } = createRequire(import.meta.url)('@playwright/test')
const video = readFileSync(process.env.STORE_TEST_VIDEO)
const pageErrors = new WeakMap()

test.beforeAll(async ({ request }) => {
  // Compile shared development chunks before Chrome loads them. Concurrent
  // first-route compilation can otherwise replace a chunk during its response.
  for (const path of ['/', '/products', '/products/hoodie']) {
    const response = await request.get(path, { timeout: 120000 })
    expect(response.ok()).toBe(true)
  }
})

test.beforeEach(async ({ page, request }) => {
  const errors = []
  pageErrors.set(page, errors)
  page.on('pageerror', error => errors.push({ message: error.message, stack: error.stack }))
  // No browser request can reach production, tracking services, or ImageKit.
  await page.route('**/*', async route => {
    const url = new URL(route.request().url())
    if (url.hostname === '127.0.0.1' || url.hostname === 'localhost') return route.continue()
    if (/\.(mp4|webm)$/i.test(url.pathname)) return route.fulfill({ contentType: 'video/webm', body: video })
    if (url.hostname === 'ik.imagekit.io') return route.fulfill({ contentType: 'image/svg+xml', body: await (await request.get('http://127.0.0.1:49171/images/Brown.svg')).body() })
    return route.fulfill({ contentType: 'application/javascript', body: '' })
  })
  await page.addInitScript(() => {
    sessionStorage.setItem('savage_rise_visited', 'true')
    window.videoEvents = []
    window.motionTimers = new Set()
    const timeout = window.setTimeout.bind(window), cancel = window.clearTimeout.bind(window)
    window.setTimeout = (fn, delay, ...args) => {
      if (delay !== 2000 || typeof fn !== 'function') return timeout(fn, delay, ...args)
      const id = timeout(() => { window.motionTimers.delete(id); fn(...args) }, delay)
      window.motionTimers.add(id); return id
    }
    window.clearTimeout = id => { window.motionTimers.delete(id); cancel(id) }
    for (const type of ['playing', 'ended', 'error']) document.addEventListener(type, event => {
      if (event.target instanceof HTMLVideoElement) window.videoEvents.push({ type, mode: event.target.closest('[data-playback]')?.dataset.playback, time: performance.now() })
    }, true)
  })
})

test.afterEach(async ({ page }) => {
  expect(pageErrors.get(page) || [], 'No JavaScript errors during media and gallery interactions').toEqual([])
})

for (const width of [375, 768, 1440]) test(`layout and real playback at ${width}px`, async ({ page }, testInfo) => {
  await page.setViewportSize({ width, height: 900 })
  const errors = []; page.on('pageerror', e => errors.push(e.message))
  await page.goto('/')
  await expect(page.locator('[data-studio-hydrated="true"]')).toHaveCount(1, {timeout:30000})
  const hero = page.locator('[data-playback="hero-cycle"]')
  await expect(hero.locator('img')).toBeVisible()
  await expect(page.locator('text=52 DT')).toHaveCount(0)
  await expect(page.getByRole('button', { name: /pause|lire la vidéo/i })).toHaveCount(0)
  await expect(hero).toHaveAttribute('data-playback-state', 'video', { timeout: 15000 })
  expect(await hero.locator('video').evaluate(v => ({ loop: v.loop, muted: v.muted, inline: v.playsInline, controls: v.controls }))).toEqual({ loop: false, muted: true, inline: true, controls: false })
  await hero.screenshot({ path: testInfo.outputPath(`hero-${width}.png`) })
  await expect(hero).toHaveAttribute('data-playback-state', 'poster')
  await expect(hero).toHaveAttribute('data-playback-state', 'video')
  const events = await page.evaluate(() => window.videoEvents.filter(e => e.mode === 'hero-cycle'))
  const end = events.find(e => e.type === 'ended'), restart = events.find(e => e.type === 'playing' && e.time > end?.time)
  expect(restart.time - end.time).toBeGreaterThanOrEqual(1950)
  expect(restart.time - end.time).toBeLessThan(3000)
  const faza = page.locator('[data-playback="loop"]').first()
  await faza.scrollIntoViewIfNeeded()
  await expect(faza).toHaveAttribute('data-playback-state', 'video')
  expect(await faza.locator('video').evaluate(v => v.loop && v.muted && v.playsInline && !v.controls)).toBe(true)
  await faza.locator('video').evaluate(v => { window.wraps = 0; let last = 0; v.addEventListener('timeupdate', () => { if (v.currentTime < last) window.wraps++; last = v.currentTime }) })
  await expect.poll(() => page.evaluate(() => window.wraps), { timeout: 8000 }).toBeGreaterThanOrEqual(2)
  await page.getByRole('heading', { name: 'New Arrivals' }).scrollIntoViewIfNeeded()
  const card = page.locator('article').filter({ hasText: 'SR OMBRA' }).first()
  await expect(card.locator('[data-color-slides]')).toHaveAttribute('data-color-slides', '6')
  await card.scrollIntoViewIfNeeded()
  const before = await card.locator('[data-color-slide]').getAttribute('data-color-slide')
  await expect(card.locator('[data-color-slide]')).not.toHaveAttribute('data-color-slide', before, { timeout: 6000 })
  await page.screenshot({ path: testInfo.outputPath(`catalog-${width}.png`) })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  expect(errors).toEqual([])
})

test('six-color complete cycle, one-color static, SOLD OUT and unchanged commerce', async ({ page }) => {
  await page.goto('/products')
  await expect(page.locator('[data-studio-hydrated="true"]')).toHaveCount(1, {timeout:30000})
  const card = page.locator('article').filter({ hasText: 'SR OMBRA' }).first()
  await card.scrollIntoViewIfNeeded()
  const before = await page.evaluate(() => JSON.stringify(localStorage))
  const seen = new Set()
  for (let n = 0; n < 7; n++) {
    const index = await card.locator('[data-color-slide]').getAttribute('data-color-slide')
    seen.add(index)
    await expect(card.locator('[data-color-slide]')).not.toHaveAttribute('data-color-slide', index, { timeout: 5000 })
    await expect(card.getByText(/89,900/).first()).toBeVisible()
  }
  expect(seen.size).toBe(6)
  await expect(page.locator('article').filter({ hasText: 'Recette one-color' }).locator('[data-color-slides]')).toHaveAttribute('data-color-slides', '1')
  await expect(page.locator('article').filter({ hasText: 'Recette sold-out' }).getByText('SOLD OUT', { exact: true }).first()).toBeVisible()
  expect(await page.evaluate(() => JSON.stringify(localStorage))).toBe(before)
  await card.locator('a').first().click()
  await expect(page).toHaveURL(/\/products\/hoodie$/, { timeout: 30000 })
})

test('detail preserves manual image across M to L, changes gallery with color', async ({ page }, testInfo) => {
  await page.goto('/products/hoodie')
  await expect(page.locator('[data-studio-hydrated="true"]')).toHaveCount(1, {timeout:30000})
  const main = page.locator('.store-gallery-main > img')
  await expect(main).toHaveAttribute('src', /Black\.svg/)
  await page.getByRole('button').filter({ has: page.locator('img[alt="Black détail"]') }).click()
  const src = await main.getAttribute('src')
  await page.getByRole('button', { name: 'L', exact: true }).click()
  await expect(main).toHaveAttribute('src', src)
  await page.waitForTimeout(2400)
  await expect(main).toHaveAttribute('src', src)
  await expect(page.locator('[data-color-slide]')).toHaveCount(0)
  await page.getByRole('button', { name: 'Color Bordeaux', exact: true }).click()
  await expect(main).toHaveAttribute('src', /Bordeaux\.svg/)
  await expect(page.getByRole('button', { name: /Add to Bag/ }).first()).toBeEnabled()
  await page.screenshot({ path: testInfo.outputPath('product-detail.png') })
})

test('video failure, refused autoplay and reduced motion preserve the poster', async ({ page }) => {
  await page.addInitScript(() => { HTMLMediaElement.prototype.play = () => Promise.reject(new DOMException('Denied', 'NotAllowedError')) })
  await page.goto('/')
  await expect(page.locator('[data-studio-hydrated="true"]')).toHaveCount(1, {timeout:30000})
  const hero = page.locator('[data-playback="hero-cycle"]')
  await expect(hero).toHaveAttribute('data-playback-state', 'blocked')
  await expect(hero.locator('img')).toBeVisible()
  await hero.locator('video').evaluate(v => v.dispatchEvent(new Event('error')))
  await expect(hero).toHaveAttribute('data-media-state', 'error')
  await expect(hero.locator('img')).toBeVisible()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/products')
  await expect(page.locator('[data-studio-hydrated="true"]')).toHaveCount(1, {timeout:30000})
  const card = page.locator('[data-color-slides="6"]').first()
  await card.scrollIntoViewIfNeeded()
  await page.waitForTimeout(2300)
  await expect(card).toHaveAttribute('data-color-slide', '0')
  await expect(card.locator('img')).toHaveCount(1)
})

test('two-color interval, single color and broken image fallback', async ({ page }) => {
  await page.route('**/images/Black.svg', route => route.fulfill({ status: 404, body: 'Missing fixture image' }))
  await page.goto('/products')
  await expect(page.locator('[data-studio-hydrated="true"]')).toHaveCount(1, {timeout:30000})
  const two = page.locator('article').filter({ hasText: 'Recette two-colors' }).locator('[data-color-slide]')
  await two.scrollIntoViewIfNeeded()
  await expect(two).toHaveAttribute('data-color-slides', '2')
  const times = []
  for (let i = 0; i < 3; i++) {
    const previous = await two.getAttribute('data-color-slide')
    await expect(two).not.toHaveAttribute('data-color-slide', previous, { timeout: 5000 }).catch(async error => {
      console.log(await two.evaluate(el => ({ motion: {...el.dataset}, reduced: matchMedia('(prefers-reduced-motion: reduce)').matches, active: document.visibilityState, timers: window.motionTimers.size, focus: el.closest('article').matches(':focus-within'), rect: el.getBoundingClientRect().toJSON(), images: [...el.querySelectorAll('img')].map(img => ({ src: img.src, complete: img.complete, width: img.naturalWidth })) })))
      throw error
    })
    times.push(Date.now())
    expect(await two.locator('img[aria-hidden="false"]').evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true)
  }
  expect(times[2] - times[1]).toBeGreaterThan(1700)
  expect(times[2] - times[1]).toBeLessThan(2700)
  const one = page.locator('article').filter({ hasText: 'Recette one-color' }).locator('[data-color-slide]')
  await one.scrollIntoViewIfNeeded()
  await page.waitForTimeout(2500)
  await expect(one).toHaveAttribute('data-color-slide', '0')
  await expect(one.locator('img')).toHaveCount(1)
  const missing = page.locator('article').filter({ hasText: 'Recette missing' }).locator('img')
  await missing.scrollIntoViewIfNeeded()
  await expect(missing).toHaveAttribute('src', /placeholder/)
  expect(await missing.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true)
})

test('navigation cleanup removes all decorative two-second timers', async ({ page }) => {
  await page.goto('/products')
  await expect(page.locator('[data-studio-hydrated="true"]')).toHaveCount(1, {timeout:30000})
  const card = page.locator('article').filter({ hasText: 'SR OMBRA' }).first()
  await card.scrollIntoViewIfNeeded()
  await expect.poll(() => page.evaluate(() => window.motionTimers.size)).toBeGreaterThan(0)
  await card.locator('a').first().click()
  await expect(page).toHaveURL(/\/products\/hoodie$/, { timeout: 30000 })
  await expect.poll(() => page.evaluate(() => window.motionTimers.size)).toBe(0)
})
