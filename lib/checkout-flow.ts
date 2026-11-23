import { retryReadOnly } from "./read-retry"

export type ShippingPolicy = { required_fields: string[]; configured: boolean; revision?: string; max_age_seconds?: number }
export type CommercialQuote = { currency?: string; quote_token?: string | null; quote_expires_at?: number | null; total?: number; total_amount?: number }

export function stableKey(value: unknown): string {
  if (Array.isArray(value)) return "[" + value.map(stableKey).join(",") + "]"
  if (value && typeof value === "object") return "{" + Object.entries(value).sort(([a],[b]) => a.localeCompare(b)).map(([k,v]) => JSON.stringify(k)+":"+stableKey(v)).join(",") + "}"
  return JSON.stringify(value) ?? "null"
}

/** Quotes need the cart, not delivery coordinates. Final orders keep the full payload. */
export function pricingInput<T extends { shipping: object }>(payload: T): T {
  return { ...payload, shipping: { full_name: "", phone: "", email: null, address_line1: "", address_line2: null, postal_code: "", city: "", country: "" } }
}

export function pricingKey(payload: object): string {
  const value = payload as Record<string, unknown>
  return stableKey(Object.fromEntries(["items", "pack_items", "payment_method", "promo_code", "loyalty_points_to_use", "user_id"].map(key => [key, value[key] ?? null])))
}

export function commercialSignature(quote: CommercialQuote): string {
  const value = quote as unknown as Record<string, unknown>
  return stableKey({ currency: quote.currency, total: quote.total ?? quote.total_amount,
    ...Object.fromEntries(["subtotal", "shipping_amount", "tax_total", "promotion_discount", "bundle_discount", "loyalty_discount"].map(key => [key, value[key] ?? 0])) })
}

function validQuote<Q extends CommercialQuote>(quote: Q, currency: string): Q {
  if (!quote.quote_token || quote.currency !== currency || !Number.isFinite(quote.total ?? quote.total_amount)) throw new Error("The order total could not be confirmed. Please try again.")
  return quote
}

function errorCode(error: unknown): string | undefined {
  const value = error as { code?: string; body?: { detail?: { code?: string }; code?: string } }
  return value?.code ?? value?.body?.detail?.code ?? value?.body?.code
}

/** Same payload and key on every transport retry. A new price always needs a new click. */
export async function confirmCheckout<P extends object, Q extends CommercialQuote, O>(options: {
  payload: P; quote: Q | null; preparedQuote?: Q | null; currency: string; idempotencyKey: string;
  load: (payload: P) => Promise<Q>; submit: (payload: P & { quote_token: string }, key: string) => Promise<O>;
  signal?: AbortSignal;
}): Promise<{ kind: "review"; quote: Q } | { kind: "confirmed"; quote: Q; order: O }> {
  const signal = options.signal ?? new AbortController().signal
  let quote = options.quote
  const load = async () => validQuote(await retryReadOnly(() => options.load(options.payload), signal), options.currency)
  if (!quote || !quote.quote_token || (quote.quote_expires_at && quote.quote_expires_at * 1000 <= Date.now() + 5000)) {
    const next = !quote && options.preparedQuote ? validQuote(options.preparedQuote, options.currency) : await load()
    if (!quote || commercialSignature(next) !== commercialSignature(quote)) return { kind: "review", quote: next }
    quote = next
  }
  validQuote(quote, options.currency)
  for (let recalculation = 0; ; recalculation++) {
    const frozen = { ...options.payload, quote_token: quote.quote_token! }
    try {
      // Creation is safe to resume ONLY with the identical idempotency key.
      const order = await retryReadOnly(() => options.submit(frozen, options.idempotencyKey), signal)
      return { kind: "confirmed", quote, order }
    } catch (error) {
      if (errorCode(error) !== "QUOTE_CHANGED" || recalculation >= 1) throw error
      const next = await load()
      if (commercialSignature(next) !== commercialSignature(quote)) return { kind: "review", quote: next }
      quote = next
    }
  }
}
