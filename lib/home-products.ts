import type { Pack, Product } from "@/types/api"
import { isActiveBundlePack, isBundleProduct, isShopProduct } from "@/lib/product-kind"

function normalizeId(value: string | null | undefined) {
  return value?.trim() ?? ""
}

export function getActiveBundles(packs: Pack[]) {
  return packs.filter(isActiveBundlePack)
}

export function getFeaturedPhysicalProducts(products: Product[], activeBundles: Pack[]) {
  const bundleIds = new Set(activeBundles.map((pack) => normalizeId(pack.id)).filter(Boolean))
  const seenProductIds = new Set<string>()
  const featuredProducts: Product[] = []

  for (const product of products) {
    const productId = normalizeId(product.id)
    if (!productId || seenProductIds.has(productId)) continue
    if (bundleIds.has(productId) || isBundleProduct(product) || !isShopProduct(product)) continue

    seenProductIds.add(productId)
    featuredProducts.push(product)
  }

  return featuredProducts
}
