import nextDynamic from "next/dynamic"
import { cache, Suspense } from "react"
import { getStudioDocument } from "@/lib/studio-server"
import Hero from "./components/Hero"
import FeaturedProducts from "./components/FeaturedProducts"
import { api } from "@/lib/api"
import { loadCatalogProducts } from "@/lib/storefront/catalog-data"
import { getCatalogCategories } from "@/lib/storefront/catalog-server"
import { createCatalogDiagnostics } from "@/lib/storefront/catalog-diagnostics"
import type { DropCountdown, HeaderVideo, Pack } from "@/types/api"

const Newsletter = nextDynamic(() => import("./components/Newsletter"), {
  loading: () => null,
})

export const dynamic = "force-dynamic"
export const fetchCache = "default-no-store"

// Only editorial content is cached; cards must receive current availability.
const getHomeContent = cache(async () => {
  if (await getStudioDocument()) return { headerVideo: null, drop: null }
  const [headerVideo, drop] = await Promise.all([
    api.getHeaderVideo().catch(() => null as HeaderVideo | null),
    process.env.NEXT_PUBLIC_ENABLE_DROP_COUNTDOWN === "true" ? api.getDropCountdown().catch(() => null as DropCountdown | null) : null,
  ])
  return { headerVideo, drop }
})

async function getHomePageData() {
  const diagnostics = createCatalogDiagnostics("/")
  const [products, categories, packs] = await Promise.all([
    loadCatalogProducts((skip, limit, query) => api.getProductCardsPage(skip, limit, query, diagnostics.observe), { productKind: "physical" }, diagnostics.observe).catch(() => null),
    getCatalogCategories(),
    api.getPacks(0, 3).catch(() => [] as Pack[]),
  ])
  diagnostics.finish({ outcome: products ? "complete" : "unavailable", loaded: products?.length ?? 0, categoriesAvailable: categories.available })
  return { products: products ?? [], productsAvailable: products !== null, categories: categories.items, categoriesAvailable: categories.available, packs }
}

async function HomeHero() {
  const { headerVideo, drop } = await getHomeContent()
  return <Hero headerVideo={headerVideo} drop={drop} />
}

async function HomeCollection() {
  const { products, productsAvailable, packs, categories, categoriesAvailable } = await getHomePageData()
  return <FeaturedProducts products={products} productsAvailable={productsAvailable} packs={packs} storeCategories={categories} categoriesAvailable={categoriesAvailable} />
}

export default function Home() {
  return (
    <main className="flow-root min-h-screen bg-background text-foreground">
      <Suspense fallback={null}><HomeHero /></Suspense>
      <Suspense fallback={<section aria-busy="true" aria-label="Loading the collection" className="store-container min-h-screen py-16"><div className="store-product-grid" aria-hidden="true">{[0, 1, 2, 3].map(index => <div key={index} className="aspect-[3/4] bg-muted motion-safe:animate-pulse" />)}</div></section>}><HomeCollection /></Suspense>
      <Newsletter />
    </main>
  )
}

