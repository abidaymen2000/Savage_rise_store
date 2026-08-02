import type { Product, SizeStock, Variant } from "@/types/api"
import { getVariantSize, isSizePurchasable } from "@/lib/inventory"

export function metaProductId(productId: string) {
  return `product:${productId}`
}

export function metaVariantId(variantId: string) {
  return `variant:${variantId}`
}

function nullableMetaVariantId(variantId: string | null | undefined) {
  return variantId ? metaVariantId(variantId) : null
}

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

export function getCartItemMetaVariantId(item: { selectedVariant: Pick<Variant, "id"> }) {
  return nullableMetaVariantId(item.selectedVariant.id)
}

export function getPackSelectionMetaVariantId(selection: { variant_id?: string | null }) {
  return nullableMetaVariantId(selection.variant_id)
}

export function buildMetaProductContent(product: Pick<Product, "id" | "price">, quantity = 1) {
  return {
    id: metaProductId(product.id),
    quantity,
    item_price: product.price,
  }
}

export function buildMetaCartItemContent(item: { product: Pick<Product, "price">; selectedVariant: Pick<Variant, "id">; quantity: number }) {
  const id = getCartItemMetaVariantId(item)
  if (!id) return null
  return {
    id,
    quantity: item.quantity,
    item_price: item.product.price,
  }
}

export function buildMetaPackSelectionContent(selection: { variant_id?: string | null; qty?: number; unit_price: number }, packQuantity = 1) {
  const id = getPackSelectionMetaVariantId(selection)
  if (!id) return null
  return {
    id,
    quantity: (selection.qty ?? 1) * packQuantity,
    item_price: selection.unit_price,
  }
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
