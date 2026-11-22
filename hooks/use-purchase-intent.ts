"use client"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { readQuickPurchase, removeQuickPurchase, type QuickPurchase } from "@/lib/quick-purchase"

/** Session-only intention: the regular cart is never overwritten or cleared. */
export function usePurchaseIntent<T>(cart: T, scope: string, clearCart: () => void) {
  const id = useSearchParams().get("buy")
  const [resolved, setResolved] = useState<{scope: string; id: string | null; intent: QuickPurchase<T> | null} | null>(null)
  useEffect(() => {
    let intent: QuickPurchase<T> | null = null
    try { intent = id ? readQuickPurchase<T>(sessionStorage, scope, id) : null } catch {}
    setResolved({scope, id, intent})
  }, [scope, id])
  const loaded = resolved?.scope === scope && resolved.id === id
  const intent = loaded ? resolved.intent : null
  return {state: intent?.state ?? cart, loaded, quick: !!id, invalid: loaded && !!id && !intent, returnTo: intent?.returnTo,
    clear: () => { if (intent) removeQuickPurchase(sessionStorage, scope, intent.id); else if (!id) clearCart() } }
}
