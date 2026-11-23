"use client"
import { useEffect, useRef, useState, useCallback } from "react"
import { retryReadOnly, isTemporaryReadError } from "@/lib/read-retry"
import { pricingInput, pricingKey, type CommercialQuote } from "@/lib/checkout-flow"

export function useCheckoutQuote<P extends { shipping: object }, Q extends CommercialQuote>(
  payload: P, enabled: boolean, load: (value: P) => Promise<Q>, currency: string,
) {
  const inputKey = currency + ":" + pricingKey(payload)
  const latest = useRef(payload)
  useEffect(() => { latest.current = payload }, [payload])
  const [retry, setRetry] = useState(0)
  const key = inputKey + ":" + retry
  const [result, setResult] = useState<{key: string; quote: Q} | null>(null)
  const [failure, setFailure] = useState<{key: string; message: string} | null>(null)
  const pending = useRef<{key: string; promise: Promise<Q>} | null>(null)
  const refresh = useCallback(() => setRetry(value => value + 1), [])

  const ready = enabled && !!currency
  useEffect(() => {
    if (!ready) return
    const controller = new AbortController()
    let recovery: ReturnType<typeof setTimeout> | undefined
    const started = performance.now()
    const promise = retryReadOnly(() => load(pricingInput(latest.current)), controller.signal).then(quote => {
      if (!quote.quote_token || quote.currency !== currency || !Number.isFinite(quote.total ?? quote.total_amount)) throw new Error("The order total could not be confirmed.")
      return quote
    })
    pending.current = {key, promise}
    promise.then(quote => {
      if (!controller.signal.aborted) {
        setResult({key, quote}); setFailure(null)
        performance.measure("yovo.checkout.quote", {start: started, end: performance.now()})
      }
    }).catch(error => {
      if (controller.signal.aborted) return
      setFailure({key, message: isTemporaryReadError(error) ? "Connection temporarily unavailable. Verification will resume automatically." : error instanceof Error ? error.message : "The order total could not be verified."})
      if (isTemporaryReadError(error)) recovery = setTimeout(refresh, 15000)
    })
    return () => { controller.abort(); clearTimeout(recovery) }
  }, [key, ready, load, currency, refresh])

  const quote = ready && result?.key === key ? result.quote : null
  const error = failure?.key === key ? failure.message : null
  useEffect(() => {
    if (!enabled || !error) return
    window.addEventListener("online", refresh); window.addEventListener("focus", refresh)
    return () => { window.removeEventListener("online", refresh); window.removeEventListener("focus", refresh) }
  }, [enabled, error, refresh])
  const acceptQuote = (value: Q) => { setResult({key, quote: value}); setFailure(null) }
  const ensureQuote = async () => quote ?? (pending.current?.key === key ? pending.current.promise.catch(() => null) : null)
  return {quote, error, loading: ready && !quote && !error, refresh, acceptQuote, ensureQuote}
}
