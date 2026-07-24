import type { Metadata } from "next"

import { StorePageShell } from "@/components/store-pages/store-page-renderer"
import { getPublishedStorePage } from "@/lib/store-pages/get-store-page"
import { getStaticStorePage } from "@/lib/store-pages/static-pages"

export async function generateStorePageMetadata(slug: string): Promise<Metadata> {
  const result = await getPublishedStorePage(slug)
  const page = result?.page ?? getStaticStorePage(slug)
  return {
    title: page?.seo?.title || page?.title || "Savage Rise",
    description: page?.seo?.description || page?.subtitle || undefined,
    robots: page?.seo?.no_index ? { index: false, follow: false } : undefined,
    alternates: page?.seo?.canonical_url ? { canonical: page.seo.canonical_url } : undefined,
    openGraph: {
      title: page?.seo?.og_title || page?.seo?.title || page?.title,
      description: page?.seo?.og_description || page?.seo?.description || page?.subtitle || undefined,
      images: page?.seo?.og_image_url ? [{ url: page.seo.og_image_url }] : undefined,
    },
  }
}

export async function StaticStorePage({ slug }: { slug: string }) {
  const result = await getPublishedStorePage(slug)
  const page = result?.page ?? getStaticStorePage(slug)

  if (!page) return null
  return <StorePageShell page={page} />
}
