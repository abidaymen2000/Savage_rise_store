import Link from "next/link"
import ProductCard from "@/components/storefront/product-card"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { SHOP_PRODUCT_KIND, isShopProduct } from "@/lib/product-kind"
import { getCategoryAndDescendantIds, getCatalogCategoryOptions, productMatchesCategoryIds, resolveCategoryFilter } from "@/lib/storefront/catalog"
import { loadCatalogProducts } from "@/lib/storefront/catalog-data"
import { getCatalogCategories } from "@/lib/storefront/catalog-server"
import { createCatalogDiagnostics } from "@/lib/storefront/catalog-diagnostics"
import type { CatalogObserver } from "@/lib/catalog-read"
import CatalogRetry from "@/components/storefront/catalog-retry"
import CatalogUnavailable from "@/components/storefront/catalog-unavailable"
import { getAvailableColors, getAvailableSizes, isProductInStock, sortProductsByStockStatus } from "@/lib/utils"
import ProductsControls, { type ProductsFilterState } from "./products-controls"
import type { Product } from "@/types/api"

// Availability can change without a stock movement (manual in_stock override).
export const dynamic = "force-dynamic"
// Next 14 partial RSC navigations can skip the layout's uncached Studio read.
// Catalogue SDK GETs have no explicit cache option: never reuse their Data Cache.
export const fetchCache = "default-no-store"

type SearchParams = Record<string, string | string[] | undefined>

const PAGE_SIZE = 24

async function getProductsPageData(q: string, observe: CatalogObserver) {
  const [categories, products] = await Promise.all([
    getCatalogCategories(),
    loadCatalogProducts((skip, limit, query) => api.getProductCardsPage(skip, limit, query, observe), { productKind: SHOP_PRODUCT_KIND, q: q || null }, observe).catch(() => null),
  ])
  return { products, categories: categories.items, categoriesAvailable: categories.available }
}

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

function filterProducts(products: Product[], filters: ProductsFilterState, categoryIds: string[] = [], unresolvedCategory = false, excluded: Record<string, number>) {
  const filtered = products.filter((product) => {
    const exclude = (reason: string) => { excluded[reason]++; return false }
    if (unresolvedCategory || !productMatchesCategoryIds(product, categoryIds)) return exclude("category")
    if (filters.color !== "all" && !getAvailableColors(product).some((item) => item.toLowerCase() === filters.color.toLowerCase())) return exclude("color")
    if (filters.size !== "all" && !getAvailableSizes(product).some((item) => item.toLowerCase() === filters.size.toLowerCase())) return exclude("size")
    if (filters.availability === "available" && !isProductInStock(product)) return exclude("availability")
    if (filters.availability === "sold-out" && isProductInStock(product)) return exclude("availability")
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
  const requestedFilters = parseFilters(searchParams)
  const diagnostics = createCatalogDiagnostics("/products")
  const productsData = await getProductsPageData(requestedFilters.q, diagnostics.observe)
  if (!productsData.products) {
    diagnostics.finish({ outcome: "unavailable", loaded: 0, categoriesAvailable: productsData.categoriesAvailable })
    return <main className="store-catalog min-h-screen bg-background pb-16 text-foreground"><div className="store-container"><h1 className="mb-8 font-playfair text-5xl">Shop</h1><CatalogUnavailable /></div></main>
  }
  const filters = { ...requestedFilters, category: productsData.categoriesAvailable ? requestedFilters.category : "all" }
  const resolvedCategory = filters.category === "all" ? null : resolveCategoryFilter(productsData.categories, filters.category)
  const categoryIds = resolvedCategory ? getCategoryAndDescendantIds(productsData.categories, resolvedCategory.id) : []
  const unresolvedCategory = filters.category !== "all" && !resolvedCategory

  const excluded = { kind: 0, category: 0, color: 0, size: 0, availability: 0 }
  const products = productsData.products.filter(isShopProduct)
  excluded.kind = productsData.products.length - products.length
  const filteredProducts = filterProducts(products, filters, categoryIds, unresolvedCategory, excluded)
  diagnostics.finish({ outcome: "complete", loaded: productsData.products.length, categoriesAvailable: productsData.categoriesAvailable, excluded, shown: filteredProducts.length })
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE))
  const currentPage = Math.min(filters.page, totalPages)
  const visibleProducts = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const categoryOptions = getCatalogCategoryOptions(productsData.categories)
  const colorOptions = Array.from(new Set(products.flatMap(getAvailableColors))).filter(Boolean).sort()
  const sizeOptions = Array.from(new Set(products.flatMap((product) => getAvailableSizes(product)))).filter(Boolean).sort()

  return (
    <main className="store-catalog min-h-screen bg-background pb-16 text-foreground">
      <div className="store-container">
        <header className="border-b border-border pb-8">
          <div className="mt-3 flex min-w-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <h1 className="font-playfair text-5xl leading-none sm:text-6xl">Shop</h1>
              <p className="mt-3 text-sm text-muted-foreground">{filteredProducts.length} product{filteredProducts.length === 1 ? "" : "s"}</p>
            </div>
            <ProductsControls
              filters={{ ...filters, page: currentPage }}
              categoryOptions={categoryOptions}
              categoriesAvailable={productsData.categoriesAvailable}
              colorOptions={colorOptions}
              sizeOptions={sizeOptions}
              resultCount={filteredProducts.length}
            />
          </div>
        </header>

        {!productsData.categoriesAvailable && (
          <div role="status" className="mt-6 flex flex-col gap-4 border border-border bg-card p-5 text-card-foreground sm:flex-row sm:items-center sm:justify-between">
            <div><p className="font-semibold">Categories are temporarily unavailable.</p><p className="mt-1 text-sm text-muted-foreground">Showing products without a category filter. You can still browse and shop.</p></div>
            <CatalogRetry />
          </div>
        )}

        <div className="grid min-w-0 gap-7 py-8 lg:grid-cols-[12rem_minmax(0,1fr)]">
          <ProductsControls
            filters={{ ...filters, page: currentPage }}
            categoryOptions={categoryOptions}
            categoriesAvailable={productsData.categoriesAvailable}
            colorOptions={colorOptions}
            sizeOptions={sizeOptions}
            resultCount={filteredProducts.length}
            variant="aside"
          />

          <section className="min-w-0">
            {visibleProducts.length === 0 ? (
              <div className="border border-border bg-card p-10 text-center">
                <p className="text-lg font-semibold text-card-foreground">No products found.</p>
                <p className="mt-2 text-sm text-muted-foreground">Try another size, color, or category.</p>
                <Button asChild className="mt-5 rounded-none bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground">
                  <Link href="/products">View All Products</Link>
                </Button>
              </div>
            ) : (
              <div className="store-product-grid studio-grid-catalog">
                {visibleProducts.map((product, index) => <ProductCard key={product.id} product={product} priority={index < 2} />)}
              </div>
            )}

            {totalPages > 1 && (
              <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="Catalog Pages">
                {currentPage > 1 && (
                  <Button asChild variant="outline" className="h-11 rounded-none border-border bg-transparent text-foreground hover:bg-primary hover:text-primary-foreground">
                    <Link href={getPageHref(filters, currentPage - 1)}>Previous</Link>
                  </Button>
                )}
                <span className="px-3 text-sm text-muted-foreground">Page {currentPage} / {totalPages}</span>
                {currentPage < totalPages && (
                  <Button asChild variant="outline" className="h-11 rounded-none border-border bg-transparent text-foreground hover:bg-primary hover:text-primary-foreground">
                    <Link href={getPageHref(filters, currentPage + 1)}>Next</Link>
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
