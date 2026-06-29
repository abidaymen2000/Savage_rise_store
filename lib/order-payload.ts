import type {
  CreateOrderAnalyticsContext,
  CartItem,
  CartPackItem,
  MetaEventContext,
  OrderCreatePayload,
  OrderShippingCreate,
  PackOrderSelection,
} from "@/types/api"

function normalizeOptionalString(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  return trimmed ? trimmed : null
}

function normalizeRequiredString(value: string): string {
  return value.trim()
}

export function buildPackOrderSelections(packItems: CartPackItem[]): PackOrderSelection[] {
  return packItems.map((packItem) => ({
    pack_id: packItem.pack.id,
    qty: packItem.quantity,
    items: packItem.selections.map((selection) => ({
      component_id: selection.component_id ?? null,
      product_id: selection.product_id,
      color: selection.color,
      size: selection.size,
      qty: selection.qty ?? 1,
    })),
  }))
}

export function buildOrderPayload(params: {
  items: CartItem[]
  packItems: CartPackItem[]
  shipping: OrderShippingCreate
  payment_method?: OrderCreatePayload["payment_method"]
  promo_code?: string | null
  loyalty_points_to_use?: number
  user_id?: string | null
  meta?: MetaEventContext | null
  analytics_context?: CreateOrderAnalyticsContext | null
  meta_event_id?: string | null
}): OrderCreatePayload {
  const {
    items,
    packItems,
    shipping,
    payment_method = "cod",
    promo_code = null,
    loyalty_points_to_use = 0,
    user_id,
    meta = null,
    analytics_context = null,
    meta_event_id = null,
  } = params

  const mergedMeta: MetaEventContext | null =
    analytics_context || meta_event_id
      ? {
          event_id: meta_event_id ?? analytics_context?.meta_event_id ?? analytics_context?.event_id ?? meta?.event_id ?? null,
          event_source_url: meta?.event_source_url ?? analytics_context?.page_url ?? null,
          fbp: meta?.fbp ?? analytics_context?.fbp ?? null,
          fbc: meta?.fbc ?? analytics_context?.fbc ?? null,
          fbclid: meta?.fbclid ?? analytics_context?.fbclid ?? null,
          consent: meta?.consent ?? null,
        }
      : meta

  return {
    ...(user_id ? { user_id } : {}),
    items: items.map((item) => ({
      product_id: item.product.id,
      color: item.selectedVariant.color,
      size: item.selectedSize,
      qty: item.quantity,
    })),
    pack_items: buildPackOrderSelections(packItems),
    shipping: {
      full_name: normalizeRequiredString(shipping.full_name),
      email: normalizeOptionalString(shipping.email),
      phone: normalizeRequiredString(shipping.phone),
      address_line1: normalizeRequiredString(shipping.address_line1),
      address_line2: normalizeOptionalString(shipping.address_line2),
      postal_code: normalizeRequiredString(shipping.postal_code),
      city: normalizeRequiredString(shipping.city),
      country: normalizeRequiredString(shipping.country),
    },
    payment_method,
    promo_code: normalizeOptionalString(promo_code)?.toUpperCase() ?? null,
    loyalty_points_to_use: Math.max(0, Math.floor(loyalty_points_to_use)),
    ...(mergedMeta ? { meta: mergedMeta } : {}),
    anonymous_id: analytics_context?.anonymous_id ?? null,
    session_id: analytics_context?.session_id ?? null,
    page_view_id: analytics_context?.page_view_id ?? null,
    checkout_id: analytics_context?.checkout_id ?? null,
    meta_event_id: meta_event_id ?? analytics_context?.meta_event_id ?? null,
    referrer: analytics_context?.referrer ?? null,
    landing_page: analytics_context?.landing_page ?? null,
    utm_source: analytics_context?.utm_source ?? null,
    utm_medium: analytics_context?.utm_medium ?? null,
    utm_campaign: analytics_context?.utm_campaign ?? null,
    utm_content: analytics_context?.utm_content ?? null,
    utm_term: analytics_context?.utm_term ?? null,
    fbclid: analytics_context?.fbclid ?? null,
    fbp: analytics_context?.fbp ?? null,
    fbc: analytics_context?.fbc ?? null,
    first_touch_attribution: analytics_context?.first_touch_attribution ?? null,
    last_touch_attribution: analytics_context?.last_touch_attribution ?? null,
    session_attribution: analytics_context?.session_attribution ?? null,
  }
}
