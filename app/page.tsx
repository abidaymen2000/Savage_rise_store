import dynamic from "next/dynamic"
import { unstable_cache } from "next/cache"
import Hero from "./components/Hero"
import FeaturedProducts from "./components/FeaturedProducts"
import { api } from "@/lib/api"
import type { Category, DropCountdown, HeaderVideo, Pack, Product } from "@/types/api"

const Newsletter = dynamic(() => import("./components/Newsletter"), {
  loading: () => null,
})

export const revalidate = 60

const getHomePageData = unstable_cache(async () => {
  const [products, packs, categories, headerVideo, drop] = await Promise.all([
    api.getProducts(0, 12).catch(() => [] as Product[]),
    api.getPacks(0, 3).catch(() => [] as Pack[]),
    api.getCategories().catch(() => [] as Category[]),
    api.getHeaderVideo().catch(() => null as HeaderVideo | null),
    api.getDropCountdown().catch(() => null as DropCountdown | null),
  ])
  return { products, packs, categories, headerVideo, drop }
}, ["storefront-home"], { revalidate: 60, tags: ["storefront-home", "store-products", "store-packs", "store-cms"] })

export default async function Home() {
  const { products, packs, categories, headerVideo, drop } = await getHomePageData()

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Hero headerVideo={headerVideo} drop={drop} />
      <FeaturedProducts products={products} packs={packs} storeCategories={categories} />
      <Newsletter />
    </main>
  )
}

