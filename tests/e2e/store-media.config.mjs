import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
const cwd = fileURLToPath(new URL('../../', import.meta.url))
const { defineConfig } = createRequire(import.meta.url)('@playwright/test')
export default defineConfig({
  testDir: '.', testMatch: 'store-media.spec.mjs', workers: 1, timeout: 90000,
  reporter: [['list'], ['json', { outputFile: process.env.STORE_TEST_RESULTS || 'test-results/store-media.json' }]],
  outputDir: process.env.STORE_TEST_OUTPUT || 'test-results/store-media',
  use: { baseURL: 'http://127.0.0.1:49172', channel: 'chrome', headless: true, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  webServer: [
    { cwd, command: 'node tests/e2e/store-media-server.mjs', url: 'http://127.0.0.1:49171/health', reuseExistingServer: false },
    { cwd, command: 'node node_modules/next/dist/bin/next ' + (process.env.STORE_TEST_PRODUCTION ? 'start' : 'dev') + ' -H 127.0.0.1 -p 49172', url: 'http://127.0.0.1:49172/icon.svg', timeout: 180000, reuseExistingServer: false,
      env: { NEXT_PUBLIC_API_BASE_URL: 'http://127.0.0.1:49171', NEXT_PUBLIC_STOREFRONT_DOMAIN: 'fixture.local', NEXT_PUBLIC_META_PIXEL_ID: '', NEXT_TELEMETRY_DISABLED: '1' } },
  ],
})
