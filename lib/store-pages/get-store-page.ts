import { getStorePage } from "@/lib/api/store-pages-api"
import type { StorePagePublicOut } from "@/lib/api/generated"
import { getStaticStorePage } from "./static-pages"

export async function getPublishedStorePage(slug: string): Promise<{ page: StorePagePublicOut; source: "cms" | "static" } | null> {
  try {
    const page = await getStorePage(slug)
    return { page, source: "cms" }
  } catch {
    const fallback = getStaticStorePage(slug)
    return fallback ? { page: fallback, source: "static" } : null
  }
}
