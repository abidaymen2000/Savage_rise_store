import type { CartItem, Product } from "@/types/api"
import { getProductAvailability, getProductVariantForSelection, getVariantSize } from "@/lib/inventory"
import { availabilityStatus } from "@/lib/availability"

export function cartItemAvailability(item: CartItem) {
  const parent = getProductAvailability(item.product)
  return parent === "available" ? availabilityStatus(getVariantSize(item.selectedVariant, item.selectedSize)) : parent
}

export function refreshCartSelection(item: CartItem, product?: Product): CartItem {
  if (!product) return item
  const id = item.selectedVariantItemId
  const variant = id
    ? product.variants.find(v => v.id === id || v.items?.some(i => i.id === id))
    : getProductVariantForSelection(product, item.selectedVariant.color, item.selectedSize)
  return { ...item, product, selectedVariant: variant ?? { ...item.selectedVariant,
    sizes: item.selectedVariant.sizes.map(size => ({ ...size, availability_status: "invalid_variant", in_stock: false })) } }
}
