import { unstable_cache } from "next/cache"
import { Package } from "lucide-react"
import { api } from "@/lib/api"
import { isActiveBundlePack } from "@/lib/product-kind"
import type { Pack, Product } from "@/types/api"
import CollectionViewTracker from "@/app/components/CollectionViewTracker"
import PackCardClient from "./pack-card-client"

export const revalidate = 60

const getPacksPageData = unstable_cache(async () => {
  const packs = (await api.getPacks(0, 20).catch(() => [] as Pack[])).filter(isActiveBundlePack)
  const packProductIds = Array.from(
    new Set(packs.flatMap((pack) => pack.components?.map((component) => component.product_id) ?? [])),
  )
  const products = await Promise.all(packProductIds.map((productId) => api.getProduct(productId).catch(() => null)))
  const productLookup = products.reduce<Record<string, Product>>((map, product) => {
    if (product) map[product.id] = product
    return map
  }, {})
  return {
    packs: [...packs].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    productLookup,
  }
}, ["storefront-packs"], { revalidate: 60, tags: ["store-packs", "store-products"] })

function PackCard({ pack, productLookup }: { pack: Pack; productLookup: Record<string, Product> }) {
  return (
    <div className="theme-aware-pack-card contents">
      <PackCardClient pack={pack} productLookup={productLookup} />
    </div>
  )
}

export default async function PacksPage() {
  const { packs, productLookup } = await getPacksPageData()

  return (
    <main className="min-h-screen bg-background pt-24 text-foreground">
      <CollectionViewTracker collection="packs" metadata={{ type: "packs" }} />
      <div className="container mx-auto px-4 py-10">
        <div className="mb-10 max-w-3xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-gold">Savage Rise Packs</p>
          <h1 className="font-playfair text-4xl font-bold sm:text-5xl">Build the full look, unlock the better price.</h1>
          <p className="mt-4 leading-7 text-muted-foreground">
            Same-color sets, separate size selection, and a clearer path from standout piece to full outfit.
          </p>
        </div>

        {packs.length === 0 ? (
          <div className="rounded-md border border-border bg-card p-8 text-center">
            <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">No active packs available yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {packs.map((pack) => (
              <PackCard key={pack.id} pack={pack} productLookup={productLookup} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
