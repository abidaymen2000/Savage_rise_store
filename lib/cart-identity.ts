import type { CartItem, Variant } from "@/types/api"
import { getVariantSize } from "@/lib/inventory"

export function resolveVariantItemId(variant: Variant, size: string) {
  return getVariantSize(variant, size)?.variant_item_id ?? null
}

export function getProductCartKey(productId: string, variant: Variant, size: string, variantItemId?: string | null) {
  const stableVariantItemId = variantItemId ?? resolveVariantItemId(variant, size)
  if (stableVariantItemId) return `${productId}-${stableVariantItemId}`
  return `${productId}-${variant.color}-${size}`
}

export function matchesCartItem(
  item: CartItem,
  payload: { productId: string; color: string; size: string; variantItemId?: string | null },
) {
  if (item.product.id !== payload.productId) return false
  const itemVariantItemId = item.selectedVariantItemId ?? resolveVariantItemId(item.selectedVariant, item.selectedSize)
  if (payload.variantItemId || itemVariantItemId) {
    return itemVariantItemId === (payload.variantItemId ?? null)
  }
  return item.selectedVariant.color === payload.color && item.selectedSize === payload.size
}
