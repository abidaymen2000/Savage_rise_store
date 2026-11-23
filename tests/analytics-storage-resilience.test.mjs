import test from 'node:test'
import assert from 'node:assert/strict'
import { initializeAnalytics, getAnalyticsContext, getOrCreateSessionId, getOrCreateCheckoutId, clearCheckoutId, createPageView, getCurrentPageViewId, markDeduplicationKeySent, hasDeduplicationKeyBeenSent } from '../lib/analytics-context.ts'

function storage(failingMethod) {
  const data = new Map()
  return {
    getItem(key) { if (failingMethod === 'getItem') throw new Error('Denied read'); return data.get(key) ?? null },
    setItem(key, value) { if (failingMethod === 'setItem') throw new Error('Quota exceeded'); data.set(key, value) },
    removeItem(key) { if (failingMethod === 'removeItem') throw new Error('Denied removal'); data.delete(key) },
  }
}

for (const failure of ['getter', 'getItem', 'setItem', 'removeItem']) test(`analytics tolerates ${failure} failure with stable page-lifetime IDs`, () => {
  const previousWindow = global.window, previousDocument = global.document
  try {
    global.window = { location: new URL('https://savagerise.com/?utm_source=test'), localStorage: storage(failure), sessionStorage: storage(failure) }
    global.document = { referrer: '', cookie: '' }
    if (failure === 'getter') for (const name of ['localStorage', 'sessionStorage']) Object.defineProperty(window, name, { get() { throw new Error('Storage disabled') } })
    const initialized = initializeAnalytics()
    assert.ok(initialized.session_id)
    assert.equal(getAnalyticsContext().session_id, initialized.session_id)
    assert.equal(getAnalyticsContext().anonymous_id, initialized.anonymous_id)
    const checkout = getOrCreateCheckoutId()
    assert.equal(getOrCreateCheckoutId(), checkout)
    clearCheckoutId()
    assert.notEqual(getOrCreateCheckoutId(), checkout)
    const page = createPageView('/products')
    assert.equal(getCurrentPageViewId(), page)
    assert.equal(createPageView('/products'), page)
    markDeduplicationKeySent('fixture-event')
    assert.equal(hasDeduplicationKeyBeenSent('fixture-event'), true)
    const session = getOrCreateSessionId()
    // A new browser document cannot inherit a denied store's volatile values.
    global.window = { location: new URL('https://savagerise.com/'), localStorage: storage('getItem'), sessionStorage: storage('getItem') }
    assert.notEqual(getOrCreateSessionId(), session)
  } finally {
    if (previousWindow === undefined) delete global.window; else global.window = previousWindow
    if (previousDocument === undefined) delete global.document; else global.document = previousDocument
  }
})
