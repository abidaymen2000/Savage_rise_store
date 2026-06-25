import type {
  CartItem,
  CartPackItem,
  OrderCreatePayload,
  OrderShippingCreate,
  PackOrderSelection,
} from "@/types/api"

function normalizeOptionalString(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  return trimmed ? trimmed : null
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
}): OrderCreatePayload {
  const {
    items,
    packItems,
    shipping,
    payment_method = "cod",
    promo_code = null,
    loyalty_points_to_use = 0,
    user_id,
  } = params

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
      full_name: shipping.full_name,
      email: shipping.email,
      phone: shipping.phone,
      address_line1: shipping.address_line1,
      address_line2: normalizeOptionalString(shipping.address_line2),
      postal_code: shipping.postal_code,
      city: shipping.city,
      country: shipping.country,
    },
    payment_method,
    promo_code: normalizeOptionalString(promo_code),
    loyalty_points_to_use: Math.max(0, Math.floor(loyalty_points_to_use)),
  }
}
