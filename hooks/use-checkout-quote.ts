"use client"
import { useEffect, useRef, useState, useCallback } from "react"
import { retryReadOnly, isTemporaryReadError } from "@/lib/read-retry"
import { pricingInput, pricingKey, destinationReady, requiredDestinationFromError, type ShippingPolicy, type CommercialQuote } from "@/lib/checkout-flow"

export function useCheckoutQuote<P extends { shipping: object }, Q extends CommercialQuote>(
  payload: P, enabled: boolean, load: (value: P) => Promise<Q>, currency: string,
  loadPolicy: (country: string) => Promise<ShippingPolicy>,
) {
  const country = String((payload.shipping as { country?: string }).country ?? "")
  const [policyResult, setPolicy] = useState<{country: string; value: ShippingPolicy} | null>(null)
  const [policyError, setPolicyError] = useState<string | null>(null)
  const policy = policyResult?.country === country ? policyResult.value : null
  const inputKey = currency + ":" + pricingKey(payload, policy)
  const policyRef = useRef(policy)
  const latest = useRef(payload)
  useEffect(() => { latest.current = payload; policyRef.current = policy }, [payload, policy])
  const [retry, setRetry] = useState(0)
  const key = inputKey + ":" + retry
  const [result, setResult] = useState<{key: string; quote: Q} | null>(null)
  const [failure, setFailure] = useState<{key: string; message: string} | null>(null)
  const pending = useRef<{key: string; promise: Promise<Q>} | null>(null)
  const refresh = useCallback(() => setRetry(value => value + 1), [])

  useEffect(() => {
    if (!enabled || !country) return
    const controller = new AbortController()
    let recovery: ReturnType<typeof setTimeout> | undefined
    setPolicyError(null)
    retryReadOnly(() => loadPolicy(country), controller.signal).then(value => {
      if (!controller.signal.aborted) setPolicy({country, value})
    }).catch(() => {
      if (!controller.signal.aborted) {
        setPolicyError("Connexion momentanément indisponible. La vérification reprend automatiquement.")
        recovery = setTimeout(refresh, 15000)
      }
    })
    return () => { controller.abort(); clearTimeout(recovery) }
  }, [enabled, country, loadPolicy, retry, refresh])

  const ready = enabled && !!currency && destinationReady(payload.shipping, policy)
  useEffect(() => {
    if (!ready) return
    const controller = new AbortController()
    let recovery: ReturnType<typeof setTimeout> | undefined
    const started = performance.now()
    const promise = retryReadOnly(() => load(pricingInput(latest.current, policyRef.current)), controller.signal).then(quote => {
      if (!quote.quote_token || quote.currency !== currency || !Number.isFinite(quote.total ?? quote.total_amount)) throw new Error("Le montant ne peut pas être confirmé.")
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
      const fields = requiredDestinationFromError(error)
      if (fields) { setPolicy({country, value: {configured: true, required_fields: fields}}); return }
      setFailure({key, message: isTemporaryReadError(error) ? "Connexion momentanément indisponible. La vérification reprend automatiquement." : error instanceof Error ? error.message : "Le total ne peut pas être validé."})
      if (isTemporaryReadError(error)) recovery = setTimeout(refresh, 15000)
    })
    return () => { controller.abort(); clearTimeout(recovery) }
  }, [key, ready, load, currency, refresh, country])

  const quote = ready && result?.key === key ? result.quote : null
  const error = policyError || (failure?.key === key ? failure.message : null)
  useEffect(() => {
    if (!enabled || !error) return
    window.addEventListener("online", refresh); window.addEventListener("focus", refresh)
    return () => { window.removeEventListener("online", refresh); window.removeEventListener("focus", refresh) }
  }, [enabled, error, refresh])
  const acceptQuote = (value: Q) => { setResult({key, quote: value}); setFailure(null) }
  const ensureQuote = async () => quote ?? (pending.current?.key === key ? pending.current.promise.catch(() => null) : null)
  return {quote, error, loading: enabled && !quote && !error && (!policy || ready), refresh, acceptQuote, ensureQuote,
    destinationMessage: policy && !ready ? (policy.configured ? "Renseignez votre ville pour connaître la livraison." : "La livraison n’est pas disponible pour ce pays.") : null}
}
