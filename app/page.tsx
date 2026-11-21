import nextDynamic from "next/dynamic"
import { cache } from "react"
import Hero from "./components/Hero"
import FeaturedProducts from "./components/FeaturedProducts"
import { api } from "@/lib/api"
import type { Category, DropCountdown, HeaderVideo, Pack, Product } from "@/types/api"

const Newsletter = nextDynamic(() => import("./components/Newsletter"), {
  loading: () => null,
})

export const dynamic = "force-dynamic"

// Only editorial content is cached; cards must receive current availability.
const getHomeContent = cache(async () => {
  const [categories, headerVideo, drop] = await Promise.all([
    api.getCategories().catch(() => [] as Category[]),
    api.getHeaderVideo().catch(() => null as HeaderVideo | null),
    api.getDropCountdown().catch(() => null as DropCountdown | null),
  ])
  return { categories, headerVideo, drop }
})

async function getHomePageData() {
  const [products, packs, content] = await Promise.all([
    api.getProducts(0, 12).catch(() => [] as Product[]),
    api.getPacks(0, 3).catch(() => [] as Pack[]),
    getHomeContent(),
  ])
  return { products, packs, ...content }
}

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

