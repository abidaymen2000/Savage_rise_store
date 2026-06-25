import type { Product, SizeStock, Variant } from "@/types/api"

export function getAvailableStock(size: SizeStock | null | undefined): number {
  if (!size) return 0
  if (typeof size.stock_available === "number") return size.stock_available
  return 0
}

export function isSizePurchasable(size: SizeStock | null | undefined): boolean {
  return getAvailableStock(size) > 0
}

export function getVariantSize(variant: Variant | null | undefined, sizeName: string | null | undefined) {
  if (!variant || !sizeName) return null
  return variant.sizes.find((size) => size.size === sizeName) ?? null
}

export function getPurchasableSizes(variant: Variant | null | undefined): SizeStock[] {
  if (!variant) return []
  return variant.sizes.filter(isSizePurchasable)
}

export function variantHasPurchasableSize(variant: Variant | null | undefined): boolean {
  return getPurchasableSizes(variant).length > 0
}

export function productHasPurchasableVariant(product: Product | null | undefined): boolean {
  if (!product?.variants?.length) return false
  return product.variants.some(variantHasPurchasableSize)
}

export function getStockForProductSelection(
  product: Product | null | undefined,
  color: string | null | undefined,
  sizeName: string | null | undefined,
): number {
  if (!product || !color || !sizeName) return 0
  const variant = product.variants.find((item) => item.color === color)
  return getAvailableStock(getVariantSize(variant, sizeName))
}
