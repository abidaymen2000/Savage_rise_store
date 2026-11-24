import "server-only"
import { cache } from "react"
import { catalogApi } from "@/lib/api/catalog-api"
import { loadCatalogCategories } from "./catalog-categories"
import { createCatalogDiagnostics } from "./catalog-diagnostics"

// React cache is scoped to one server render. A new navigation/publication still
// reads Core; layout + page do not repeat the same tenant/category request.
export const getCatalogCategories = cache(async () => {
  const diagnostics = createCatalogDiagnostics("categories")
  const result = await loadCatalogCategories(() => catalogApi.getCategories(diagnostics.observe))
  diagnostics.finish({ outcome: result.available ? "complete" : "unavailable", loaded: result.items.length, categoriesAvailable: result.available })
  return result
})
