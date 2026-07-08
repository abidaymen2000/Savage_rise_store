import type { Product, SizeStock, Variant } from "@/types/api"

function sizeRows(variant: Variant | null | undefined): SizeStock[] {
  if (!variant) return []
  if (variant.sizes?.length) return variant.sizes
  return (variant.items ?? []).map((item) => ({
    size: item.size,
    stock_on_hand: item.stock_on_hand,
    stock_reserved: item.stock_reserved,
    stock_available: item.stock_available,
    sku: item.sku,
    status: item.status,
    variant_item_id: item.id,
  }))
}

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
  return sizeRows(variant).find((size) => size.size === sizeName) ?? null
}

export function getPurchasableSizes(variant: Variant | null | undefined): SizeStock[] {
  if (!variant) return []
  return sizeRows(variant).filter(isSizePurchasable)
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
