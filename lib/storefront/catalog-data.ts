import type { CatalogProductPage, CatalogProductQuery } from "@/lib/api/catalog-api"
import type { Product } from "@/types/api"

/** Follow the public API's pagination, including a server-clamped page size. */
export async function loadCatalogProducts(
  readPage: (skip: number, limit: number, query: CatalogProductQuery) => Promise<CatalogProductPage>,
  query: CatalogProductQuery = {},
): Promise<Product[]> {
  const products = new Map<string, Product>()
  let skip = 0
  let limit = 100
  for (;;) {
    const page = await readPage(skip, limit, query)
    const previousCount = products.size
    for (const product of page.items) products.set(product.id, product)
    const hasNext = page.has_next ?? (page.page < page.pages || page.page * page.page_size < page.total)
    if (!hasNext) return [...products.values()]
    // A broken/repeated page must not silently present a complete-looking subset.
    if (!page.items.length || products.size === previousCount || !(page.page_size > 0)) {
      throw new Error("Le catalogue n’a pas pu être chargé entièrement. Réessayez.")
    }
    limit = page.page_size
    skip = page.page * page.page_size
  }
}
