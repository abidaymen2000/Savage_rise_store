import type { Metadata } from "next"
import { unstable_cache } from "next/cache"
import { notFound } from "next/navigation"
import ProductDetailClient from "./ProductDetailClient"
import { api } from "@/lib/api"
import { findCompanionComponents, findRelatedPack } from "@/lib/pack-offers"
import type { Pack, Product } from "@/types/api"

export const revalidate = 60

type ProductPageProps = {
  params: { id: string }
}

const getProductOrNull = unstable_cache(async (id: string) => {
  try {
    return await api.getProduct(id)
  } catch {
    return null
  }
}, ["storefront-product-detail"], { revalidate: 60, tags: ["store-products"] })

const getRelatedData = unstable_cache(async (productId: string) => {
  const packs = await api.getPacks(0, 50).catch(() => [] as Pack[])
  const relatedPack = findRelatedPack(productId, packs)
  if (!relatedPack) return { relatedPack: null, relatedProducts: {} }

  const companionIds = findCompanionComponents(relatedPack, productId).map((component) => component.product_id)
  const companionProducts = await Promise.all(companionIds.map((companionId) => api.getProduct(companionId).catch(() => null)))
  const relatedProducts = companionProducts.reduce<Record<string, Product>>((map, companionProduct) => {
    if (companionProduct) map[companionProduct.id] = companionProduct
    return map
  }, {})
  return { relatedPack, relatedProducts }
}, ["storefront-product-related"], { revalidate: 60, tags: ["store-products", "store-packs"] })

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductOrNull(params.id)
  if (!product) return { title: "Produit introuvable | Savage Rise" }

  const image = product.images?.[0]?.url
  return {
    title: `${product.name} | Savage Rise`,
    description: product.description ?? product.full_name ?? "Produit Savage Rise",
    openGraph: {
      title: product.name,
      description: product.description ?? product.full_name ?? undefined,
      images: image ? [{ url: image, alt: product.name }] : undefined,
    },
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await getProductOrNull(params.id)
  if (!product) notFound()

  const { relatedPack, relatedProducts } = await getRelatedData(product.id)

  return <ProductDetailClient product={product} initialRelatedPack={relatedPack} initialRelatedProducts={relatedProducts} />
}
