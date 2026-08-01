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
