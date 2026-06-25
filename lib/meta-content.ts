import type { CartItem, Product, SizeStock, Variant } from "@/types/api"
import { isSizePurchasable } from "@/lib/inventory"

export function getVariantSizeByName(variant: Variant | null | undefined, size: string | null | undefined) {
  if (!variant || !size) return null
  return variant.sizes.find((variantSize) => variantSize.size === size) ?? null
}

export function getMetaContentId(options: {
  product?: Product | null
  variant?: Variant | null
  size?: SizeStock | null
  selectedSize?: string | null
}) {
  const explicitSize = options.size ?? null
  const resolvedSize = explicitSize ?? getVariantSizeByName(options.variant, options.selectedSize ?? null)

  return (
    resolvedSize?.meta_content_id ??
    options.variant?.meta_content_id ??
    options.product?.meta_item_group_id ??
    options.product?.id ??
    null
  )
}

export function getCartItemMetaContentId(item: CartItem) {
  return getMetaContentId({
    product: item.product,
    variant: item.selectedVariant,
    selectedSize: item.selectedSize,
  })
}

export function getFirstAvailableVariantSelection(product: Product) {
  for (const variant of product.variants ?? []) {
    const size = variant.sizes.find((variantSize) => isSizePurchasable(variantSize))
    if (size) {
      return { variant, size }
    }
  }

  return null
}
