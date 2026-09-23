// Analytics persistence is optional. Storage restrictions must never break a
// cart action or a successful order confirmation; fall back to this tab's memory.
const stores = new Map<string, Storage>()

export function getAnalyticsStorage(kind: "localStorage" | "sessionStorage"): Storage {
  const existing = stores.get(kind)
  if (existing) return existing
  const memory = new Map<string, string>()
  const storage: Storage = {
    getItem(key) {
      try { return window[kind].getItem(key) } catch { return memory.get(key) ?? null }
    },
    setItem(key, value) {
      memory.set(key, String(value))
      try { window[kind].setItem(key, value) } catch { /* optional persistence */ }
    },
    removeItem(key) {
      memory.delete(key)
      try { window[kind].removeItem(key) } catch { /* optional persistence */ }
    },
    clear() {
      memory.clear()
      try { window[kind].clear() } catch { /* optional persistence */ }
    },
    key(index) {
      try { return window[kind].key(index) } catch { return Array.from(memory.keys())[index] ?? null }
    },
    get length() {
      try { return window[kind].length } catch { return memory.size }
    },
  }
  stores.set(kind, storage)
  return storage
}
