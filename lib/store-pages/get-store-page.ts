import { cache } from "react"

import { getStorePage } from "@/lib/api/store-pages-api"
import type { StorePagePublicOut } from "@/lib/api/generated"
import { getStaticStorePage } from "./static-pages"

export const getPublishedStorePage = cache(async function getPublishedStorePage(
  slug: string,
): Promise<{ page: StorePagePublicOut; source: "cms" | "static" } | null> {
  const fallback = getStaticStorePage(slug)
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return fallback ? { page: fallback, source: "static" } : null
  }

  try {
    const page = await getStorePage(slug)
    return { page, source: "cms" }
  } catch {
    return fallback ? { page: fallback, source: "static" } : null
  }
})
