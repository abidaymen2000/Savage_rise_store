import type { Pack, Product } from "@/types/api"

export const SHOP_PRODUCT_KIND = "physical"
export const PACK_PRODUCT_KIND = "bundle"

export function isShopProduct(product: Product | null | undefined) {
  return product?.product_kind === SHOP_PRODUCT_KIND
}

export function isBundleProduct(product: Product | null | undefined) {
  return product?.product_kind === PACK_PRODUCT_KIND
}

export function isBundlePack(pack: Pack | null | undefined) {
  return pack?.product_kind === PACK_PRODUCT_KIND
}

export function isActiveBundlePack(pack: Pack | null | undefined) {
  return isBundlePack(pack) && pack?.status === "active"
}

export function getShopProducts(products: Product[]) {
  return products.filter(isShopProduct)
}

export function getActiveBundlePacks(packs: Pack[]) {
  return packs.filter(isActiveBundlePack)
}
