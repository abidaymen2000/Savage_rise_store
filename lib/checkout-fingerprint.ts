import type { MetaEventContext, OrderCreatePayload, OrderQuoteOut } from "@/types/api"

function stableSerialize(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value)
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableSerialize(item)).join(",")}]`
  }

  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([, entryValue]) => entryValue !== undefined)
    .sort(([left], [right]) => left.localeCompare(right))

  return `{${entries.map(([key, entryValue]) => `${JSON.stringify(key)}:${stableSerialize(entryValue)}`).join(",")}}`
}

function hashString(input: string): string {
  let hash = 5381
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 33) ^ input.charCodeAt(index)
  }
  return `chk_${(hash >>> 0).toString(16)}`
}

function normalizeMeta(meta?: MetaEventContext | null) {
  if (!meta) return null
  return {
    has_fbp: Boolean(meta.fbp),
    has_fbc: Boolean(meta.fbc),
    has_fbclid: Boolean(meta.fbclid),
    consent: meta.consent ?? null,
    source_host: meta.event_source_url ? new URL(meta.event_source_url).host : null,
  }
}

export function buildQuoteSignature(quote: OrderQuoteOut | null): string | null {
  if (!quote) return null

  return hashString(
    stableSerialize({
      currency: quote.currency ?? null,
      subtotal: quote.subtotal,
      pack_discount: quote.pack_discount,
      promotion_discount: quote.promotion_discount,
      loyalty_discount: quote.loyalty_discount,
      shipping_amount: quote.shipping_amount,
      shipping_rate_id: quote.shipping_rate_id ?? null,
      total: quote.total,
      total_amount: quote.total_amount,
      items: (quote.items ?? []).map((item) => ({
        item_type: item.item_type ?? null,
        product_id: item.product_id,
        variant_id: item.variant_id ?? null,
        color: item.color,
        size: item.size,
        qty: item.qty,
        line_total: item.line_total ?? null,
        stock_available: item.stock_available ?? null,
        pack_id: item.pack_id ?? null,
        pack_component_id: item.pack_component_id ?? null,
      })),
      pack_items: (quote.pack_items ?? []).map((packItem) => ({
        pack_id: packItem.pack_id ?? null,
        qty: packItem.qty ?? null,
        total_price: packItem.total_price ?? null,
      })),
      warnings: quote.warnings ?? [],
    }),
  )
}

export function buildCheckoutFingerprint(payload: OrderCreatePayload, quoteSignature: string | null): string {
  return hashString(
    stableSerialize({
      items: payload.items.map((item) => ({
        product_id: item.product_id,
        variant_id: item.variant_id ?? null,
        color: item.color,
        size: item.size,
        qty: item.qty,
      })),
      pack_items: (payload.pack_items ?? []).map((packItem) => ({
        pack_id: packItem.pack_id,
        qty: packItem.qty,
        items: packItem.items.map((item) => ({
          component_id: item.component_id ?? null,
          product_id: item.product_id,
          variant_id: item.variant_id ?? null,
          color: item.color,
          size: item.size,
          qty: item.qty,
        })),
      })),
      payment_method: payload.payment_method ?? "cod",
      promo_code: payload.promo_code ?? null,
      loyalty_points_to_use: payload.loyalty_points_to_use ?? 0,
      country: payload.shipping.country,
      city: payload.shipping.city,
      postal_code: payload.shipping.postal_code,
      quote_signature: quoteSignature,
      meta: normalizeMeta(payload.meta),
    }),
  )
}
