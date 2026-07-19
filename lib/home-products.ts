import type { Pack, Product } from "@/types/api"

function normalizeId(value: string | null | undefined) {
  return value?.trim() ?? ""
}

export function isBundleProduct(product: Product | null | undefined) {
  return product?.product_kind === "bundle"
}

export function isPhysicalProduct(product: Product | null | undefined) {
  return product?.product_kind === "physical"
}

export function getActiveBundles(packs: Pack[]) {
  return packs.filter((pack) => pack.status === "active" && pack.product_kind === "bundle")
}

export function getFeaturedPhysicalProducts(products: Product[], activeBundles: Pack[]) {
  const bundleIds = new Set(activeBundles.map((pack) => normalizeId(pack.id)).filter(Boolean))
  const seenProductIds = new Set<string>()
  const featuredProducts: Product[] = []

  for (const product of products) {
    const productId = normalizeId(product.id)
    if (!productId || seenProductIds.has(productId)) continue
    if (bundleIds.has(productId) || isBundleProduct(product) || !isPhysicalProduct(product)) continue

    seenProductIds.add(productId)
    featuredProducts.push(product)
  }

  return featuredProducts
}
