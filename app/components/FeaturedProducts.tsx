import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/storefront/product-card"
import StorefrontMedia from "@/components/storefront/media/storefront-media"
import { getActiveBundles, getFeaturedPhysicalProducts } from "@/lib/home-products"
import { getStorefrontContent } from "@/lib/storefront/content"
import { getHomepageCategories } from "@/lib/storefront/catalog"
import { sortProductsByStockStatus } from "@/lib/utils"
import type { Category, Pack, Product } from "@/types/api"

function ActivePackCard({ pack }: { pack: Pack }) {
  return (
    <Link href={`/packs/${pack.id}`} className="group flex min-h-40 flex-col justify-between border border-accent/25 bg-card p-5 text-card-foreground transition-colors hover:border-accent">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Pack</p>
        <h3 className="mt-3 text-xl font-semibold text-card-foreground">{pack.title}</h3>
        {pack.description && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{pack.description}</p>}
      </div>
      <span className="mt-5 inline-flex items-center text-sm font-semibold text-card-foreground group-hover:text-accent">
        Composer le pack
        <ArrowRight className="ml-2 h-4 w-4" />
      </span>
    </Link>
  )
}

export default function FeaturedProducts({
  products,
  packs,
  storeCategories,
}: {
  products: Product[]
  packs: Pack[]
  storeCategories: Category[]
}) {
  const content = getStorefrontContent()
  const activeBundles = getActiveBundles(packs)
  const featuredProducts = sortProductsByStockStatus(getFeaturedPhysicalProducts(products, activeBundles))
  const categories = getHomepageCategories(storeCategories, featuredProducts)

  return (
    <div className="store-home bg-background text-foreground" id="studio-catalog">
      {categories.length > 0 && (
        <section className="store-container store-category-section" aria-labelledby="categories-heading">
          <div className="store-section-heading">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Acces rapide</p>
              <h2 id="categories-heading" className="font-playfair">Boutique</h2>
            </div>
            <span className="store-heading-rule" aria-hidden="true" />
            <Link href="/products" className="store-text-link">
              Voir tout <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <div className="studio-grid-categories store-category-grid">
            {categories.map((category) => (
              <Link key={category.key} href={category.href} className="store-category-card group">
                {category.image && <StorefrontMedia
                  media={{ type: "image", src: category.image, alt: category.alt }}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="absolute inset-0"
                  imageClassName="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-5">
                  <span className="font-playfair text-2xl uppercase tracking-[0.06em] text-white">{category.label}</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="store-container store-new-section" aria-labelledby="new-products-heading">
        <div className="store-section-heading">
          <div>
            <h2 id="new-products-heading" className="font-playfair">Nouveautés</h2>
          </div>
          <span className="store-heading-rule" aria-hidden="true" />
          <Link href="/products" className="store-text-link">Voir la collection <ArrowRight aria-hidden="true" /></Link>
        </div>
        {featuredProducts.length > 0 ? (
          <div className="studio-grid-catalog store-product-grid">
            {featuredProducts.slice(0, 4).map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 2} />
            ))}
          </div>
        ) : (
          <div className="border border-border bg-card p-8 text-center text-sm text-muted-foreground">Aucun produit actif disponible pour le moment.</div>
        )}
      </section>

      {activeBundles.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="mb-7">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Drops</p>
            <h2 className="mt-2 font-playfair text-3xl text-foreground sm:text-4xl">Packs actifs</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {activeBundles.slice(0, 3).map((pack) => (
              <ActivePackCard key={pack.id} pack={pack} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:py-20">
        <StorefrontMedia media={content.faza.media} sizes="(min-width: 1024px) 45vw, 100vw" className="aspect-[4/5] lg:aspect-auto" />
        <div className="flex flex-col justify-center border-y border-border py-8 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">{content.faza.eyebrow}</p>
          <h2 className="mt-4 max-w-2xl font-playfair text-4xl leading-tight text-foreground sm:text-5xl">{content.faza.title}</h2>
          <p className="mt-5 max-w-xl leading-7 text-muted-foreground">{content.faza.body}</p>
          <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row">
            <Button asChild className="rounded-none bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground">
              <Link href={content.faza.primaryCta.href}>{content.faza.primaryCta.label}</Link>
            </Button>
            {content.faza.secondaryCta && (
              <Button asChild variant="outline" className="rounded-none border-border bg-transparent text-foreground hover:bg-primary hover:text-primary-foreground">
                <Link href={content.faza.secondaryCta.href}>{content.faza.secondaryCta.label}</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {featuredProducts.length >= 2 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="mb-7">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Silhouette</p>
            <h2 className="mt-2 font-playfair text-3xl text-foreground sm:text-4xl">Complete the look</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <h2 className="mb-7 font-playfair text-3xl text-foreground sm:text-4xl">{content.lookbook.title}</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {content.lookbook.items.map((item, index) => (
            <StorefrontMedia key={`${item.src}-${index}`} media={item} sizes="(min-width: 1024px) 25vw, 50vw" className="aspect-[3/4]" />
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-px px-4 py-12 sm:px-6 md:grid-cols-4 lg:py-16">
        {content.reassurances.map((item) => (
          <div key={item.title} className="border border-border bg-card p-5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-card-foreground">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
