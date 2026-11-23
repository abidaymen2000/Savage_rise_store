import nextDynamic from "next/dynamic"
import { cache } from "react"
import { getStudioDocument } from "@/lib/studio-server"
import Hero from "./components/Hero"
import FeaturedProducts from "./components/FeaturedProducts"
import { api } from "@/lib/api"
import { loadCatalogProducts } from "@/lib/storefront/catalog-data"
import { loadCatalogCategories } from "@/lib/storefront/catalog-categories"
import { createCatalogDiagnostics } from "@/lib/storefront/catalog-diagnostics"
import type { DropCountdown, HeaderVideo, Pack } from "@/types/api"

const Newsletter = nextDynamic(() => import("./components/Newsletter"), {
  loading: () => null,
})

export const dynamic = "force-dynamic"
export const fetchCache = "default-no-store"

// Only editorial content is cached; cards must receive current availability.
const getHomeContent = cache(async () => {
  const [headerVideo, drop] = await Promise.all([
    getStudioDocument().then(doc => doc ? null : api.getHeaderVideo().catch(() => null as HeaderVideo | null)),
    api.getDropCountdown().catch(() => null as DropCountdown | null),
  ])
  return { headerVideo, drop }
})

async function getHomePageData() {
  const diagnostics = createCatalogDiagnostics("/")
  const [products, categories, packs, content] = await Promise.all([
    loadCatalogProducts((skip, limit, query) => api.getProductsPage(skip, limit, query, diagnostics.observe), { productKind: "physical" }, diagnostics.observe).catch(() => null),
    loadCatalogCategories(() => api.getCategories(diagnostics.observe)),
    api.getPacks(0, 3).catch(() => [] as Pack[]),
    getHomeContent(),
  ])
  diagnostics.finish({ outcome: products ? "complete" : "unavailable", loaded: products?.length ?? 0, categoriesAvailable: categories.available })
  return { products: products ?? [], productsAvailable: products !== null, categories: categories.items, categoriesAvailable: categories.available, packs, ...content }
}

export default async function Home() {
  const { products, productsAvailable, packs, categories, categoriesAvailable, headerVideo, drop } = await getHomePageData()

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Hero headerVideo={headerVideo} drop={drop} />
      <FeaturedProducts products={products} productsAvailable={productsAvailable} packs={packs} storeCategories={categories} categoriesAvailable={categoriesAvailable} />
      <Newsletter />
    </main>
  )
}

