export type QuickPurchase<T> = { id: string; scope: string; state: T; returnTo: string; expires: number }
type StoragePort = Pick<Storage, "getItem" | "setItem" | "removeItem">

export function saveQuickPurchase<T>(storage: StoragePort, scope: string, state: T, returnTo: string, now = Date.now()): QuickPurchase<T> {
  if (!returnTo.startsWith("/") || returnTo.startsWith("//")) throw new Error("Invalid product return link.")
  const intent = {id: crypto.randomUUID(), scope, state, returnTo, expires: now + 2 * 60 * 60 * 1000}
  storage.setItem(scope + ":" + intent.id, JSON.stringify(intent))
  return intent
}
export function readQuickPurchase<T>(storage: StoragePort, scope: string, id: string, now = Date.now()): QuickPurchase<T> | null {
  if (!/^[a-f0-9-]{36}$/i.test(id)) return null
  try {
    const intent = JSON.parse(storage.getItem(scope + ":" + id) || "null")
    if (intent?.id !== id || intent.scope !== scope || !(intent.expires > now) || !intent.returnTo?.startsWith("/") || intent.returnTo.startsWith("//")) return null
    if (!intent.state || !Array.isArray(intent.state.items) || !Number.isFinite(intent.state.total) || intent.state.itemCount < 1) return null
    return intent
  } catch { return null }
}
export function removeQuickPurchase(storage: StoragePort, scope: string, id: string) { try { storage.removeItem(scope + ":" + id) } catch {} }
