import type { Product, SizeStock, Variant } from "@/types/api"

const UNTRACKED_SELECTION_LIMIT = 1

function sizeRows(variant: Variant | null | undefined): SizeStock[] {
  if (!variant) return []
  if (variant.sizes?.length) return variant.sizes
  return (variant.items ?? []).map((item) => ({
    size: item.size,
    stock_on_hand: item.stock_on_hand,
    stock_reserved: item.stock_reserved,
    stock_available: item.stock_available,
    stock: item.stock_available,
    track_inventory: item.track_inventory,
    in_stock: item.in_stock,
    sku: item.sku,
    status: item.status,
    variant_item_id: item.id,
    meta_content_id: item.id,
  }))
}

export function getAvailableStock(size: SizeStock | null | undefined): number {
  if (!size) return 0
  if (size.track_inventory === false) return 0
  if (typeof size.stock_available === "number") return size.stock_available
  if (typeof size.stock === "number") return size.stock
  if (typeof size.stock_on_hand === "number" && typeof size.stock_reserved === "number") {
    return Math.max(0, size.stock_on_hand - size.stock_reserved)
  }
  return 0
}

export function isSizePurchasable(size: SizeStock | null | undefined): boolean {
  if (!size) return false
  if (size.status && !["active", "in_stock", "available"].includes(size.status)) return false
  if (size.track_inventory === false) return size.in_stock !== false
  return getAvailableStock(size) > 0
}

export function isSizeTracked(size: SizeStock | null | undefined): boolean {
  return size?.track_inventory !== false
}

export function getSelectableQuantityLimit(size: SizeStock | null | undefined): number {
  if (!size || !isSizePurchasable(size)) return 0
  return isSizeTracked(size) ? getAvailableStock(size) : UNTRACKED_SELECTION_LIMIT
}

export function getVariantSize(variant: Variant | null | undefined, sizeName: string | null | undefined) {
  if (!variant || !sizeName) return null
  return sizeRows(variant).find((size) => size.size === sizeName) ?? null
}

export function getPurchasableSizes(variant: Variant | null | undefined): SizeStock[] {
  return sizeRows(variant).filter(isSizePurchasable)
}

export function variantHasPurchasableSize(variant: Variant | null | undefined): boolean {
  return getPurchasableSizes(variant).length > 0
}

export function productHasPurchasableVariant(product: Product | null | undefined): boolean {
  if (!product?.variants?.length) return Boolean(product?.in_stock)
  return product.variants.some(variantHasPurchasableSize)
}

export function getStockForProductSelection(product: Product | null | undefined, color: string | null | undefined, sizeName: string | null | undefined): number {
  if (!product || !color || !sizeName) return 0
  const variant = getProductVariantForSelection(product, color, sizeName)
  return getAvailableStock(getVariantSize(variant, sizeName))
}

export function getProductVariantForSelection(product: Product | null | undefined, color: string | null | undefined, sizeName: string | null | undefined) {
  if (!product || !color) return null
  const colorVariants = product.variants.filter((variant) => variant.color === color)
  if (!sizeName) return colorVariants[0] ?? null
  return colorVariants.find((variant) => sizeRows(variant).some((size) => size.size === sizeName)) ?? colorVariants[0] ?? null
}
