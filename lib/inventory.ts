import { availabilityStatus, knownStock, isSoldOut, type AvailabilityStatus } from "@/lib/availability"
import type { Product, SizeStock, Variant } from "@/types/api"

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
    availability_status: item.availability_status,
    low_stock: item.low_stock,
    sku: item.sku,
    status: item.status,
    variant_item_id: item.id,
    meta_content_id: item.id,
  }))
}

export const getAvailableStock = knownStock

export function isSizePurchasable(size: SizeStock | null | undefined): boolean {
  return availabilityStatus(size) === "available"
}

export function isSizeTracked(size: SizeStock | null | undefined): boolean {
  return size?.track_inventory !== false
}

export function getSelectableQuantityLimit(size: SizeStock | null | undefined): number {
  if (!size || !isSizePurchasable(size)) return 0
  // UI cap only: the server validates real quantities without revealing stock.
  return Math.min(99, getAvailableStock(size) ?? 99)
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

export function getProductAvailability(product: Product | null | undefined): AvailabilityStatus {
  if (!product) return "unknown"
  const state = availabilityStatus(product)
  if (product.availability_status === "unknown") return "unknown"
  if (state !== "available" && state !== "unknown") return state
  if (product.product_kind === "bundle" || !product.variants?.length) return state
  const states = product.variants.flatMap(v => sizeRows(v).map(availabilityStatus))
  if (states.includes("available")) return "available"
  if (!states.length || states.includes("unknown")) return "unknown"
  return states.every(isSoldOut) ? "out_of_stock" : "unavailable"
}

export function productHasPurchasableVariant(product: Product | null | undefined): boolean {
  return getProductAvailability(product) === "available"
}

export function getStockForProductSelection(product: Product | null | undefined, color: string | null | undefined, sizeName: string | null | undefined): number | undefined {
  if (!product || !color || !sizeName) return undefined
  const variant = getProductVariantForSelection(product, color, sizeName)
  return getAvailableStock(getVariantSize(variant, sizeName))
}

export function getProductVariantForSelection(product: Product | null | undefined, color: string | null | undefined, sizeName: string | null | undefined) {
  if (!product || !color) return null
  const colorVariants = product.variants.filter((variant) => variant.color === color)
  if (!sizeName) return colorVariants[0] ?? null
  return colorVariants.find((variant) => sizeRows(variant).some((size) => size.size === sizeName)) ?? null
}
