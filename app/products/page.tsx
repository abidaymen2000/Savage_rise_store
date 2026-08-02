import Link from "next/link"
import { unstable_cache } from "next/cache"
import ProductCard from "@/components/storefront/product-card"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { SHOP_PRODUCT_KIND, isShopProduct } from "@/lib/product-kind"
import { getStorefrontContent } from "@/lib/storefront/content"
import { productMatchesCategoryFeature } from "@/lib/storefront/catalog"
import { getAvailableColors, getAvailableSizes, sortProductsByStockStatus } from "@/lib/utils"
import ProductsControls, { type ProductsFilterState } from "./products-controls"
import type { Product } from "@/types/api"

export const revalidate = 60

type SearchParams = Record<string, string | string[] | undefined>

const PAGE_SIZE = 24

const getProductsPageData = unstable_cache(async (q: string) => {
  const [productsData] = await Promise.all([
    api.getProducts(0, 100, { productKind: SHOP_PRODUCT_KIND, q: q || null }),
    api.getCategories().catch(() => []),
  ])
  return productsData
}, ["storefront-products-page"], { revalidate: 60, tags: ["store-products"] })

function getParam(searchParams: SearchParams, key: string, fallback = "") {
  const value = searchParams[key]
  if (Array.isArray(value)) return value[0] ?? fallback
  return value ?? fallback
}

function parseFilters(searchParams: SearchParams): ProductsFilterState {
  const page = Number.parseInt(getParam(searchParams, "page", "1"), 10)
  return {
    q: getParam(searchParams, "q"),
    category: getParam(searchParams, "category", "all"),
    color: getParam(searchParams, "color", "all"),
    size: getParam(searchParams, "size", "all"),
    availability: getParam(searchParams, "availability", "all"),
    sort: getParam(searchParams, "sort", "newest"),
    page: Number.isFinite(page) && page > 0 ? page : 1,
  }
}

function filterProducts(products: Product[], filters: ProductsFilterState) {
  const content = getStorefrontContent()
  const activeCategory = content.categoryFeatures.find((feature) => feature.key === filters.category)
  const query = filters.q.trim().toLowerCase()
  const filtered = products.filter((product) => {
    if (query && ![product.name, product.full_name, product.description].filter(Boolean).join(" ").toLowerCase().includes(query)) return false
    if (activeCategory && !productMatchesCategoryFeature(product, activeCategory)) return false
    if (filters.color !== "all" && !getAvailableColors(product).some((item) => item.toLowerCase() === filters.color.toLowerCase())) return false
    if (filters.size !== "all" && !getAvailableSizes(product).some((item) => item.toLowerCase() === filters.size.toLowerCase())) return false
    if (filters.availability === "available" && !product.in_stock) return false
    if (filters.availability === "sold-out" && product.in_stock) return false
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    if (filters.sort === "price-asc") return a.price - b.price
    if (filters.sort === "price-desc") return b.price - a.price
    if (filters.sort === "name") return a.name.localeCompare(b.name)
    return 0
  })
  return sortProductsByStockStatus(sorted)
}

function getPageHref(filters: ProductsFilterState, page: number) {
  const params = new URLSearchParams()
  if (filters.q.trim()) params.set("q", filters.q.trim())
  if (filters.category !== "all") params.set("category", filters.category)
  if (filters.color !== "all") params.set("color", filters.color)
  if (filters.size !== "all") params.set("size", filters.size)
  if (filters.availability !== "all") params.set("availability", filters.availability)
  if (filters.sort !== "newest") params.set("sort", filters.sort)
  if (page > 1) params.set("page", String(page))
  return `/products${params.toString() ? `?${params.toString()}` : ""}`
}

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const filters = parseFilters(searchParams)
  const content = getStorefrontContent()

  const productsData = await getProductsPageData(filters.q)

  const products = productsData.filter(isShopProduct)
  const filteredProducts = filterProducts(products, filters)
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE))
  const currentPage = Math.min(filters.page, totalPages)
  const visibleProducts = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const categoryOptions = content.categoryFeatures.filter((feature) => feature.key !== "packs").map((feature) => ({ value: feature.key, label: feature.label }))
  const colorOptions = Array.from(new Set(products.flatMap(getAvailableColors))).filter(Boolean).sort()
  const sizeOptions = Array.from(new Set(products.flatMap((product) => getAvailableSizes(product)))).filter(Boolean).sort()

  return (
    <main className="min-h-screen overflow-x-hidden bg-background px-4 pb-16 pt-28 text-foreground sm:px-6 sm:pt-32">
      <div className="mx-auto max-w-7xl">
        <header className="border-b border-border pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Savage Rise</p>
          <div className="mt-3 flex min-w-0 flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <h1 className="font-playfair text-5xl leading-none sm:text-6xl">Boutique</h1>
              <p className="mt-3 text-sm text-muted-foreground">{filteredProducts.length} produit{filteredProducts.length > 1 ? "s" : ""}</p>
            </div>
            <ProductsControls
              filters={{ ...filters, page: currentPage }}
              categoryOptions={categoryOptions}
              colorOptions={colorOptions}
              sizeOptions={sizeOptions}
              resultCount={filteredProducts.length}
            />
          </div>
        </header>

        <div className="grid min-w-0 gap-8 py-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <ProductsControls
            filters={{ ...filters, page: currentPage }}
            categoryOptions={categoryOptions}
            colorOptions={colorOptions}
            sizeOptions={sizeOptions}
            resultCount={filteredProducts.length}
            variant="aside"
          />

          <section className="min-w-0">
            {visibleProducts.length === 0 ? (
              <div className="border border-border bg-card p-10 text-center">
                <p className="text-lg font-semibold text-card-foreground">Aucun produit trouve.</p>
                <p className="mt-2 text-sm text-muted-foreground">Essaie une autre taille, couleur ou categorie.</p>
                <Button asChild className="mt-5 rounded-none bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground">
                  <Link href="/products">Voir toute la boutique</Link>
                </Button>
              </div>
            ) : (
              <div className="grid min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,150px),1fr))] gap-3 min-[390px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {visibleProducts.map((product, index) => <ProductCard key={product.id} product={product} priority={index < 2} />)}
              </div>
            )}

            {totalPages > 1 && (
              <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination catalogue">
                {currentPage > 1 && (
                  <Button asChild variant="outline" className="h-11 rounded-none border-border bg-transparent text-foreground hover:bg-primary hover:text-primary-foreground">
                    <Link href={getPageHref(filters, currentPage - 1)}>Precedent</Link>
                  </Button>
                )}
                <span className="px-3 text-sm text-muted-foreground">Page {currentPage} / {totalPages}</span>
                {currentPage < totalPages && (
                  <Button asChild variant="outline" className="h-11 rounded-none border-border bg-transparent text-foreground hover:bg-primary hover:text-primary-foreground">
                    <Link href={getPageHref(filters, currentPage + 1)}>Suivant</Link>
                  </Button>
                )}
              </nav>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
