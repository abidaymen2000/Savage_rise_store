import dynamic from "next/dynamic"
import Link from "next/link"
import { unstable_cache } from "next/cache"
import Hero from "./components/Hero"
import FeaturedProducts from "./components/FeaturedProducts"
import { api } from "@/lib/api"
import type { DropCountdown, HeaderVideo } from "@/types/api"

const Newsletter = dynamic(() => import("./components/Newsletter"), {
  loading: () => null,
})

export const revalidate = 60

const getHomePageData = unstable_cache(async () => {
  const [products, packs, categories, headerVideo, drop] = await Promise.all([
    api.getProducts(0, 12),
    api.getPacks(0, 3),
    api.getCategories(),
    api.getHeaderVideo().catch(() => null as HeaderVideo | null),
    api.getDropCountdown().catch(() => null as DropCountdown | null),
  ])
  return { products, packs, categories, headerVideo, drop }
}, ["storefront-home"], { revalidate: 60, tags: ["storefront-home", "store-products", "store-packs", "store-cms"] })

export default async function Home() {
  // Keep failed loads out of the cache and distinguish unavailable from empty.
  const data = await getHomePageData().catch(() => null)

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Hero headerVideo={data?.headerVideo} drop={data?.drop} />
      {data ? <FeaturedProducts products={data.products} packs={data.packs} storeCategories={data.categories} /> : (
        <section role="alert" className="mx-auto max-w-3xl border border-border bg-card p-8 text-center">
          <h2 className="text-2xl font-semibold">Le catalogue est momentanément indisponible</h2>
          <p className="mt-3 text-muted-foreground">Nous ne pouvons pas vérifier les prix et les disponibilités pour le moment.</p>
          <Link className="mt-5 inline-block underline" href="/products" prefetch={false}>Réessayer le catalogue</Link>
        </section>
      )}
      <Newsletter />
    </main>
  )
}

