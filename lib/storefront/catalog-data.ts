import type { CatalogProductPage, CatalogProductQuery } from "@/lib/api/catalog-api"
import type { Product } from "@/types/api"
import { CatalogIntegrityError, validateCatalogPage, type CatalogObserver } from "@/lib/catalog-read"

/** Follow the public API's pagination, including a server-clamped page size. */
export async function loadCatalogProducts(
  readPage: (skip: number, limit: number, query: CatalogProductQuery) => Promise<CatalogProductPage>,
  query: CatalogProductQuery = {},
  observe?: CatalogObserver,
): Promise<Product[]> {
  const products = new Map<string, Product>()
  let skip = 0
  let limit = 100
  let announcedTotal: number | undefined
  let expectedPage = 1
  for (;;) {
    const page = await readPage(skip, limit, query)
    observe?.({ operation: "page", page: page.page, total: page.total, loaded: products.size + (page.items?.length ?? 0) })
    try {
      validateCatalogPage(page, expectedPage)
      if (announcedTotal !== undefined && (page.total !== announcedTotal || page.page_size !== limit)) throw new CatalogIntegrityError("pagination_changed")
    } catch (error) {
      observe?.({ operation: "integrity", reason: error instanceof CatalogIntegrityError ? error.reason : "invalid_page", loaded: products.size })
      throw error
    }
    announcedTotal = page.total
    const previousCount = products.size
    for (const product of page.items) products.set(product.id, product)
    if (products.size - previousCount !== page.items.length || products.size > page.total) {
      observe?.({ operation: "integrity", reason: "overlapping_pages", loaded: products.size })
      throw new CatalogIntegrityError("overlapping_pages")
    }
    if (page.page >= page.pages) {
      if (products.size !== page.total) throw new CatalogIntegrityError("incomplete_catalog")
      return [...products.values()]
    }
    limit = page.page_size
    skip = page.page * page.page_size
    expectedPage++
  }
}
