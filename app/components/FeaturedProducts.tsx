import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/storefront/product-card"
import StorefrontMedia from "@/components/storefront/media/storefront-media"
import { getActiveBundles, getFeaturedPhysicalProducts } from "@/lib/home-products"
import { getStorefrontContent } from "@/lib/storefront/content"
import { getCategoryImageUrl, getVisibleCategoryFeatures } from "@/lib/storefront/catalog"
import { sortProductsByStockStatus } from "@/lib/utils"
import type { Category, Pack, Product } from "@/types/api"

function ActivePackCard({ pack }: { pack: Pack }) {
  return (
    <Link href={`/packs/${pack.id}`} className="theme-aware-pack-card group flex min-h-40 flex-col justify-between border border-[#D4AF37]/25 bg-[#080807] p-5 transition-colors hover:border-[#D4AF37]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">Pack</p>
        <h3 className="mt-3 text-xl font-semibold text-white">{pack.title}</h3>
        {pack.description && <p className="mt-2 line-clamp-2 text-sm text-stone-400">{pack.description}</p>}
      </div>
      <span className="mt-5 inline-flex items-center text-sm font-semibold text-white group-hover:text-[#D4AF37]">
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
  const productsAndPacks: Product[] = [
    ...featuredProducts,
    ...activeBundles.map((pack) => ({
      id: pack.id,
      style_id: pack.id,
      name: pack.title,
      full_name: pack.title,
      description: pack.description,
      categories: ["packs"],
      price: pack.pack_price ?? 0,
      compare_at_price: pack.compare_at_price ?? pack.original_price ?? null,
      in_stock: pack.status === "active",
      variants: [],
      images: pack.image_url ? [{ id: pack.id, url: pack.image_url, alt_text: pack.title }] : [],
      slug: pack.id,
      product_kind: "bundle",
    } as Product)),
  ]
  const categories = getVisibleCategoryFeatures(productsAndPacks, content.categoryFeatures).slice(0, 3)
  const categoryImageByFeatureKey = categories.reduce<Record<string, string>>((images, feature) => {
    const matchers = [feature.key, feature.label, ...feature.matchers].map((value) => value.toLowerCase())
    const matchingCategory = storeCategories.find((category) => {
      const values = [category.id, category.name, category.slug].filter(Boolean).map((value) => String(value).toLowerCase())
      return values.some((value) => matchers.some((matcher) => value.includes(matcher) || matcher.includes(value)))
    })
    const imageUrl = getCategoryImageUrl(matchingCategory)
    if (imageUrl) images[feature.key] = imageUrl
    return images
  }, {})

  return (
    <div className="bg-[#050504] text-white">
      <section className="border-y border-stone-800 bg-[#0b0b0a] px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-300 sm:text-xs">
        {content.announcement.join(" - ")}
      </section>

      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D4AF37]">Acces rapide</p>
              <h2 className="mt-2 font-playfair text-3xl text-white sm:text-4xl">Boutique</h2>
            </div>
            <Link href="/products" className="hidden text-sm font-semibold text-stone-300 hover:text-[#D4AF37] sm:inline-flex">
              Voir tout
            </Link>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {categories.map((category) => (
              <Link key={category.key} href={category.href} className="group relative block aspect-[4/5] overflow-hidden bg-stone-950 md:aspect-[5/6]">
                <StorefrontMedia
                  media={{ type: "image", src: categoryImageByFeatureKey[category.key] ?? category.image, alt: category.alt }}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="absolute inset-0"
                  imageClassName="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-5">
                  <span className="text-xl font-semibold uppercase tracking-[0.12em]">{category.label}</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D4AF37]">Nouveautes</p>
            <h2 className="mt-2 font-playfair text-3xl text-white sm:text-4xl">Latest pieces</h2>
          </div>
          <Button asChild variant="outline" className="rounded-none border-stone-600 bg-transparent text-white hover:bg-white hover:text-black">
            <Link href="/products">Voir la boutique</Link>
          </Button>
        </div>
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {featuredProducts.slice(0, 4).map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 2} />
            ))}
          </div>
        ) : (
          <div className="border border-stone-800 p-8 text-center text-sm text-stone-400">Aucun produit actif disponible pour le moment.</div>
        )}
      </section>

      {activeBundles.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="mb-7">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D4AF37]">Drops</p>
            <h2 className="mt-2 font-playfair text-3xl text-white sm:text-4xl">Packs actifs</h2>
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
        <div className="flex flex-col justify-center border-y border-stone-800 py-8 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D4AF37]">{content.faza.eyebrow}</p>
          <h2 className="mt-4 max-w-2xl font-playfair text-4xl leading-tight text-white sm:text-5xl">{content.faza.title}</h2>
          <p className="mt-5 max-w-xl leading-7 text-stone-300">{content.faza.body}</p>
          <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row">
            <Button asChild className="rounded-none bg-white text-black hover:bg-[#D4AF37]">
              <Link href={content.faza.primaryCta.href}>{content.faza.primaryCta.label}</Link>
            </Button>
            {content.faza.secondaryCta && (
              <Button asChild variant="outline" className="rounded-none border-stone-600 bg-transparent text-white hover:bg-white hover:text-black">
                <Link href={content.faza.secondaryCta.href}>{content.faza.secondaryCta.label}</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {featuredProducts.length >= 2 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="mb-7">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D4AF37]">Silhouette</p>
            <h2 className="mt-2 font-playfair text-3xl text-white sm:text-4xl">Complete the look</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <h2 className="mb-7 font-playfair text-3xl text-white sm:text-4xl">{content.lookbook.title}</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {content.lookbook.items.map((item, index) => (
            <StorefrontMedia key={`${item.src}-${index}`} media={item} sizes="(min-width: 1024px) 25vw, 50vw" className="aspect-[3/4]" />
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-px px-4 py-12 sm:px-6 md:grid-cols-4 lg:py-16">
        {content.reassurances.map((item) => (
          <div key={item.title} className="border border-stone-800 bg-[#080807] p-5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-stone-400">{item.text}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
