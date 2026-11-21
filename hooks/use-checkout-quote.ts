"use client"
import { useEffect, useRef, useState, useCallback } from "react"
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
    setResult(null)
    setFailure(null)
    if (!enabled) return () => gate.current.cancel()
    const requestPayload = latestPayload.current
    const timeout = setTimeout(async () => {
      try {
        const quote = await load(requestPayload)
        if (!quote.quote_token || quote.currency !== currency || !Number.isFinite(quote.total)) {
          throw new Error("Le devis n’a pas pu être validé. Réessayez dans un instant.")
        }
        if (gate.current.accepts(request)) setResult({ key, quote })
      } catch (error) {
        if (gate.current.accepts(request)) setFailure({ key, message: error instanceof Error ? error.message : "Le calcul du total a échoué. Réessayez." })
      }
    }, 400)
    return () => { clearTimeout(timeout); gate.current.cancel() }
  }, [key, enabled, load, currency])

  // Invalidate during render, before the debounce/effect: a stale total can
  // never enable submission after an address/cart change.
  const quote = quoteForInput(result, key, enabled)
  const error = failure?.key === key ? failure.message : null
  return { quote, error, loading: enabled && !quote && !error, refresh }
}
