"use client"
import { useEffect, useRef, useState, useCallback } from "react"
import { retryReadOnly, isTemporaryReadError } from "@/lib/read-retry"
import { buildCheckoutFingerprint } from "@/lib/checkout-fingerprint"
import { quoteForInput, quoteRequestGate } from "@/lib/checkout-quote-state"
import type { OrderCreatePayload, OrderQuoteOut } from "@/types/api"

export function useCheckoutQuote(payload: OrderCreatePayload, enabled: boolean, load: (value: OrderCreatePayload) => Promise<OrderQuoteOut>, currency: string) {
  const inputKey = currency + ":" + buildCheckoutFingerprint(payload)
  const gate = useRef(quoteRequestGate())
  const latestPayload = useRef(payload)
  latestPayload.current = payload
  const [retry, setRetry] = useState(0)
  const key = inputKey + ":" + retry
  const [result, setResult] = useState<{ key: string; quote: OrderQuoteOut } | null>(null)
  const [failure, setFailure] = useState<{ key: string; message: string } | null>(null)
  const refresh = useCallback(() => setRetry(value => value + 1), [])

  useEffect(() => {
    const request = gate.current.start()
    const controller = new AbortController()
    let recovery: ReturnType<typeof setTimeout> | undefined
    setResult(null)
    setFailure(null)
    if (!enabled) return () => gate.current.cancel()
    const requestPayload = latestPayload.current
    const timeout = setTimeout(async () => {
      try {
        const quote = await retryReadOnly(() => load(requestPayload), controller.signal)
        if (!quote.quote_token || quote.currency !== currency || !Number.isFinite(quote.total)) {
          throw new Error("Le devis n’a pas pu être validé. Réessayez dans un instant.")
        }
        if (gate.current.accepts(request)) setResult({ key, quote })
      } catch (error) {
        if (gate.current.accepts(request)) {
          const temporary = isTemporaryReadError(error)
          setFailure({ key, message: temporary ? "Connexion momentanément indisponible. La vérification reprend automatiquement." : error instanceof Error ? error.message : "Le total n’a pas pu être validé." })
          if (temporary) recovery = setTimeout(refresh, 15000)
        }
      }
    }, 400)
    return () => { clearTimeout(timeout); clearTimeout(recovery); controller.abort(); gate.current.cancel() }
  }, [key, enabled, load, currency, refresh])

  // Invalidate during render, before the debounce/effect: a stale total can
  // never enable submission after an address/cart change.
  const quote = quoteForInput(result, key, enabled)
  const error = failure?.key === key ? failure.message : null
  useEffect(() => {
    if (!enabled || !error) return
    window.addEventListener("online", refresh)
    window.addEventListener("focus", refresh)
    return () => { window.removeEventListener("online", refresh); window.removeEventListener("focus", refresh) }
  }, [enabled, error, refresh])
  return { quote, error, loading: enabled && !quote && !error, refresh }
}
