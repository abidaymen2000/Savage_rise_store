import type { Pack, PackBundleComponent, PackComponent, Product, ProductImage, Variant } from "@/types/api"

function normalize(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? ""
}

function uniqueColors(colors: Array<string | null | undefined>) {
  const seen = new Set<string>()
  const result: string[] = []
  for (const color of colors) {
    const key = normalize(color)
    if (!key || seen.has(key)) continue
    seen.add(key)
    result.push(color!.trim())
  }
  return result
}

function getAllowedColors(pack: Pack) {
  return uniqueColors(
    (pack.bundle_definition?.components ?? []).flatMap((component: PackBundleComponent) => {
      const values = component.allowed_option_values?.color ?? []
      return Array.isArray(values) ? values : []
    }),
  )
}

function getVariantColors(product: Product | null | undefined) {
  return uniqueColors((product?.variants ?? []).map((variant) => variant.option_values?.color ?? variant.color))
}

export function getBundleColorOptions(pack: Pack, productLookup: Record<string, Product>) {
  const allowedColors = getAllowedColors(pack)
  const componentProducts = (pack.bundle_definition?.components ?? [])
    .map((component: PackBundleComponent) => productLookup[component.product_id])
    .filter((product): product is Product => Boolean(product))

  if (componentProducts.length === 0) return allowedColors

  const common = componentProducts.reduce<string[]>((colors: string[], product: Product, index: number) => {
    const productColors = getVariantColors(product)
    if (index === 0) return productColors
    return colors.filter((color) => productColors.some((productColor) => normalize(productColor) === normalize(color)))
  }, [])

  if (allowedColors.length === 0) return common
  return allowedColors.filter((color) => common.some((commonColor) => normalize(commonColor) === normalize(color)))
}

export function findComponentVariantByColor(product: Product | null | undefined, selectedColor: string | null | undefined): Variant | null {
  const color = normalize(selectedColor)
  if (!product || !color) return null
  return (
    product.variants?.find((variant) => variant.status !== "archived" && variant.status !== "inactive" && normalize(variant.option_values?.color ?? variant.color) === color) ??
    null
  )
}

function getPrimaryImage(images: ProductImage[] | undefined) {
  if (!images?.length) return null
  return images.find((image) => image.is_primary)?.url ?? images[0]?.url ?? null
}

export function getComponentImageForColor(params: {
  product: Product | null | undefined
  selectedColor: string | null | undefined
  fallback?: string | null
}) {
  const variant = findComponentVariantByColor(params.product, params.selectedColor)
  return getPrimaryImage(variant?.images) ?? params.fallback ?? getPrimaryImage(params.product?.images) ?? "/placeholder.svg"
}

export function getBundlePreviewItems(pack: Pack, productLookup: Record<string, Product>, selectedColor: string | null | undefined) {
  const components: Array<PackBundleComponent | PackComponent> = pack.bundle_definition?.components ?? pack.components ?? []
  return components.map((component) => {
    const product = productLookup[component.product_id]
    const summary = pack.components?.find((item) => item.product_id === component.product_id)?.product
    const qty = "quantity" in component ? component.quantity ?? 1 : (component as PackComponent).qty ?? 1
    return {
      id: "component_id" in component ? component.component_id : component.id,
      name: product?.name ?? summary?.name ?? "Pack item",
      image: getComponentImageForColor({
        product,
        selectedColor,
        fallback: summary?.image_url ?? pack.image_url,
      }),
      qty,
    }
  })
}
