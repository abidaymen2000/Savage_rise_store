import type { Category } from "@/types/api"

export type CatalogCategories = { available: true; items: Category[] } | { available: false; items: Category[] }

/** Failure is not a successful, empty ERP category list. */
export async function loadCatalogCategories(read: () => Promise<Category[]>): Promise<CatalogCategories> {
  try { return { available: true, items: await read() } }
  catch { return { available: false, items: [] } }
}
