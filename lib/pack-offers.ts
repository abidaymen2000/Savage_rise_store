import type { CartItem, Pack, PackComponent, PackOrderComponent, Product } from "@/types/api"
import { getVariantSize, isSizePurchasable } from "@/lib/inventory"

function getPackComponents(pack: Pack) {
  return pack.components ?? []
}

export function findRelatedPack(productId: string, packs: Pack[]) {
  return packs.find((pack) => getPackComponents(pack).some((component) => component.product_id === productId)) ?? null
}

export function findPackComponent(pack: Pack | null | undefined, productId: string) {
  if (!pack) return null
  return getPackComponents(pack).find((component) => component.product_id === productId) ?? null
}

export function findCompanionComponents(pack: Pack | null | undefined, productId: string) {
  if (!pack) return []
  return getPackComponents(pack).filter((component) => component.product_id !== productId)
}

export function isTwoPiecePack(pack: Pack | null | undefined) {
  return (pack?.components ?? []).length === 2
}

export function getPackSavingsLabel(pack: Pack) {
  return pack.savings_value ?? pack.discount_value ?? 0
}

export function getPackOriginalPrice(pack: Pack) {
  return pack.original_price ?? 0
}

export function getPackPrice(pack: Pack) {
  return pack.pack_price ?? 0
}

export function getProductColorOptions(product: Product | null | undefined) {
  return product?.variants.map((variant) => variant.color) ?? []
}

export function getProductVariantByColor(product: Product | null | undefined, color: string | null | undefined) {
  if (!product || !color) return null
  return product.variants.find((variant) => variant.color === color) ?? null
}

export function getProductImageForColor(product: Product | null | undefined, color: string | null | undefined) {
  const variant = getProductVariantByColor(product, color)
  return variant?.images?.[0]?.url ?? product?.variants?.[0]?.images?.[0]?.url ?? "/placeholder.svg"
}

export function getAvailableSizesForColor(product: Product | null | undefined, color: string | null | undefined) {
  const variant = getProductVariantByColor(product, color)
  return variant?.sizes.filter((size) => isSizePurchasable(size)).map((size) => size.size) ?? []
}

function resolveColor(product: Product | undefined, component: PackComponent, preferredColor?: string | null, overrideColor?: string | null) {
  if (overrideColor) return overrideColor
  if (component.color) return component.color
  if (preferredColor && getProductColorOptions(product).includes(preferredColor)) return preferredColor
  return product?.variants?.[0]?.color ?? ""
}

function resolveSize(
  product: Product | undefined,
  component: PackComponent,
  color: string,
  preferredSize?: string | null,
  overrideSize?: string | null,
) {
  if (overrideSize) return overrideSize
  if (component.size) return component.size

  const sizeOptions = getAvailableSizesForColor(product, color)
  if (preferredSize && sizeOptions.includes(preferredSize)) return preferredSize
  return sizeOptions[0] ?? ""
}

export function buildPackSelections(
  pack: Pack,
  productsById: Record<string, Product | undefined>,
  options?: {
    preferredColor?: string | null
    preferredSize?: string | null
    overrides?: Record<string, { color?: string | null; size?: string | null }>
  },
) {
  const selections: PackOrderComponent[] = []

  for (const component of getPackComponents(pack)) {
    const product = productsById[component.product_id]
    const override = options?.overrides?.[component.product_id]
    const color = resolveColor(product, component, options?.preferredColor, override?.color)
    const size = resolveSize(product, component, color, options?.preferredSize, override?.size)
    const variant = getProductVariantByColor(product, color)
    const variantSize = getVariantSize(variant, size)
    const unitPrice = product?.price ?? component.product.price

    if (!color || !size || unitPrice === undefined || unitPrice === null) {
      return null
    }

    selections.push({
      component_id: component.id,
      product_id: component.product_id,
      variant_id: component.variant_id ?? variant?.id ?? null,
      variant_item_id: component.variant_item_id ?? variantSize?.variant_item_id ?? null,
      sku: component.sku ?? variantSize?.sku ?? null,
      color,
      size,
      qty: component.qty ?? 1,
      unit_price: unitPrice,
    })
  }

  return selections
}

export function findCartUpgradeCandidate(items: CartItem[], packItems: { pack: Pack }[], packs: Pack[]) {
  for (const item of items) {
    const relatedPack = findRelatedPack(item.product.id, packs)
    if (!relatedPack || !isTwoPiecePack(relatedPack)) continue
    if (packItems.some((packItem) => packItem.pack.id === relatedPack.id)) continue

    const companions = findCompanionComponents(relatedPack, item.product.id)
    if (companions.length !== 1) continue

    const companion = companions[0]
    const companionAlreadyInCart = items.some(
      (cartItem) =>
        cartItem.product.id === companion.product_id &&
        cartItem.selectedVariant.color === item.selectedVariant.color,
    )

    if (companionAlreadyInCart) continue

    return { item, pack: relatedPack, companion }
  }

  return null
}
