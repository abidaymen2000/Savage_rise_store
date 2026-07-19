import type { CartItem, Variant } from "@/types/api"

export function resolveVariantItemId(variant: Variant | null | undefined, size: string | null | undefined) {
  if (!variant || !size) return variant?.id ?? null
  return variant.sizes?.find((item) => item.size === size)?.variant_item_id ?? variant.items?.find((item) => item.size === size)?.id ?? variant.id ?? null
}

export function getProductCartKey(productId: string, variant: Variant, size: string, variantItemId?: string | null) {
  const resolvedVariantItemId = variantItemId ?? resolveVariantItemId(variant, size)
  return resolvedVariantItemId ? `${productId}-${resolvedVariantItemId}` : `${productId}-${variant.id ?? variant.color}-${size}`
}

export function matchesCartItem(item: CartItem, target: { productId: string; color: string; size: string; variantItemId?: string | null }) {
  if (item.product.id !== target.productId) return false
  if (target.variantItemId && item.selectedVariantItemId) return item.selectedVariantItemId === target.variantItemId
  return item.selectedVariant.color === target.color && item.selectedSize === target.size
}
