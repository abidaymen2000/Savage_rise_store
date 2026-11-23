import type { Product, ProductImage, Variant } from "@/types/api"

export const PRODUCT_IMAGE_FALLBACK = "/placeholder.svg?height=400&width=300"
const colorAxes = new Set(["color", "colour", "couleur"])
const normalize = (value: string) => value.normalize("NFKC").trim().toLowerCase()

export function variantColor(variant: Variant): string {
  const options = Object.entries(variant.option_values ?? {})
  if (variant.color_value) return variant.color
  const entry = options.find(([axis]) => colorAxes.has(normalize(axis)))
  const color = entry ? variant.option_value_labels?.[entry[0]] || entry[1] : undefined
  // A size-only product must not turn its sizes into image colors.
  return color?.trim() ? color : (options.length ? "" : variant.color || "")
}

function orderedImages(images: ProductImage[]): ProductImage[] {
  return images.filter(image => Boolean(image.url?.trim())).slice().sort((a, b) =>
    Number(Boolean(b.is_primary)) - Number(Boolean(a.is_primary)) || (a.order ?? 0) - (b.order ?? 0))
}

function uniqueImages(images: ProductImage[]): ProductImage[] {
  const ids = new Set<string>()
  const urls = new Set<string>()
  return images.filter(image => {
    if ((image.id && ids.has(image.id)) || urls.has(image.url)) return false
    if (image.id) ids.add(image.id)
    urls.add(image.url)
    return true
  })
}

export function productImageFallback(product: Product): ProductImage {
  return orderedImages(product.images ?? [])[0] ?? {
    id: "placeholder", url: PRODUCT_IMAGE_FALLBACK, alt_text: product.name,
  }
}

export function getProductColorGalleries(product: Product) {
  const groups = new Map<string, { key: string; color: string; variants: Variant[] }>()
  // Preserve ERP position, then ID for deterministic ties, independently of selected size.
  const variants = [...(product.variants ?? [])].sort((a, b) =>
    (a.position ?? 0) - (b.position ?? 0) || String(a.id ?? "").localeCompare(String(b.id ?? "")))
  for (const variant of variants) {
    const color = variantColor(variant)
    if (!color) continue
    const key = normalize(color)
    const group = groups.get(key) ?? { key, color, variants: [] }
    group.variants.push(variant)
    groups.set(key, group)
  }
  return [...groups.values()].map(group => {
    // Explicit primaries always win over gallery order, including a later size's primary.
    // When sizes have different explicit primaries, the first ERP-positioned one wins.
    const images = uniqueImages(group.variants.flatMap(v => orderedImages(v.images ?? []))
      .sort((a, b) => Number(Boolean(b.is_primary)) - Number(Boolean(a.is_primary))))
    return { key: group.key, color: group.color, colorCode: group.variants[0]?.color_code, images }
  })
}

export function getProductColorSlides(product: Product): ProductImage[] {
  const fallback = productImageFallback(product)
  const slides = getProductColorGalleries(product).map(group => {
    const image = group.images[0] ?? fallback
    return { ...image, alt_text: image.alt_text || `${product.name} — ${group.color}` }
  })
  return uniqueImages(slides.length ? slides : [fallback])
}

export function getProductImagesForColor(product: Product, color: string): ProductImage[] {
  const gallery = getProductColorGalleries(product).find(group => group.key === normalize(color))
  return gallery?.images.length ? gallery.images : [productImageFallback(product)]
}
