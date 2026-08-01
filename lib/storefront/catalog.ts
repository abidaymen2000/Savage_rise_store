import type { Product } from "@/types/api"
import type { StorefrontCategoryFeature } from "@/types/storefront-content"

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()
}

export function productMatchesCategoryFeature(product: Product, feature: StorefrontCategoryFeature) {
  const haystack = normalize([product.name, product.full_name, product.description, product.product_kind, ...(product.categories ?? [])].filter(Boolean).join(" "))
  return feature.matchers.some((matcher) => haystack.includes(normalize(matcher)))
}

export function getVisibleCategoryFeatures(products: Product[], features: StorefrontCategoryFeature[]) {
  if (products.length === 0) return features.filter((feature) => feature.key !== "accessories")
  return features.filter((feature) =>
    feature.key === "packs"
      ? products.some((product) => product.product_kind === "bundle")
      : products.some((product) => productMatchesCategoryFeature(product, feature)),
  )
}

function isValidCategoryImageUrl(value: unknown): value is string {
  if (typeof value !== "string") return false
  const url = value.trim()
  if (!url) return false
  if (url.startsWith("/")) return true

  try {
    const parsed = new URL(url)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}

export function getCategoryImageUrl(category: { image?: unknown } | null | undefined) {
  const image = category?.image
  if (isValidCategoryImageUrl(image)) return image.trim()
  if (!image || typeof image !== "object" || Array.isArray(image)) return null

  const imageRecord = image as { url?: unknown; file_url?: unknown; src?: unknown }
  const url = imageRecord.url ?? imageRecord.file_url ?? imageRecord.src
  return isValidCategoryImageUrl(url) ? url.trim() : null
}
