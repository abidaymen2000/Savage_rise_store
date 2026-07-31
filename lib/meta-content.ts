import type { Product, SizeStock, Variant } from "@/types/api"
import { getVariantSize, isSizePurchasable } from "@/lib/inventory"

export function getVariantSizeByName(variant: Variant | null | undefined, selectedSize: string | null | undefined) {
  return getVariantSize(variant, selectedSize)
}

export function getMetaContentId(params: { product?: Product | null; variant?: Variant | null; size?: SizeStock | null; selectedSize?: string | null }) {
  const size = params.size ?? getVariantSize(params.variant, params.selectedSize)
  return size?.meta_content_id ?? size?.variant_item_id ?? params.variant?.meta_content_id ?? params.variant?.id ?? params.product?.id ?? null
}

export function getCartItemMetaContentId(item: { product: Product; selectedVariant: Variant; selectedSize: string }) {
  return getMetaContentId({ product: item.product, variant: item.selectedVariant, selectedSize: item.selectedSize })
}

export function getFirstAvailableVariantSelection(product: Product | null | undefined) {
  if (product?.product_kind === "bundle") {
    const variant = product.variants?.[0] ?? null
    return variant ? { variant, color: variant.color, size: variant.sizes?.[0] ?? { size: "" } } : null
  }
  const variant = product?.variants?.find((item) => item.sizes?.some(isSizePurchasable)) ?? product?.variants?.[0] ?? null
  const size = variant?.sizes?.find(isSizePurchasable) ?? variant?.sizes?.[0] ?? null
  return variant && size ? { variant, color: variant.color, size } : null
}
