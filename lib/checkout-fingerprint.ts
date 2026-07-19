import type { CartItem, CartPackItem, OrderShippingCreate } from "@/types/api"

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`
  if (value && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`)
      .join(",")}}`
  }
  return JSON.stringify(value)
}

export function buildCheckoutFingerprint(params: any, quoteSignature?: string | null) {
  if (!params || !Array.isArray(params.items) || !("packItems" in params) || (params.items[0] && !("product" in params.items[0]))) {
    return stableStringify({ payload: params, quoteSignature: quoteSignature ?? null })
  }
  const cartParams = params as {
    items: CartItem[]
    packItems?: CartPackItem[]
    shipping?: Partial<OrderShippingCreate> | null
    promoCode?: string | null
    loyaltyPoints?: number
  }
  return stableStringify({
    items: cartParams.items.map((item) => ({
      product_id: item.product.id,
      variant_id: item.selectedVariant.id,
      size: item.selectedSize,
      quantity: item.quantity,
    })),
    bundles: (cartParams.packItems ?? []).map((item) => ({
      product_id: item.pack.id,
      quantity: item.quantity,
      selections: item.selections.map((selection) => ({
        component_id: selection.component_id,
        variant_id: selection.variant_id ?? selection.variant_item_id,
        qty: selection.qty ?? 1,
      })),
    })),
    shipping: cartParams.shipping ?? null,
    promoCode: cartParams.promoCode?.trim().toUpperCase() ?? null,
    loyaltyPoints: cartParams.loyaltyPoints ?? 0,
    quoteSignature: quoteSignature ?? null,
  })
}

export function buildQuoteSignature(quote: unknown) {
  return stableStringify(quote)
}
