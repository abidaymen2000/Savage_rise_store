import type { Metadata } from "next"

import { StorePageShell } from "@/components/store-pages/store-page-renderer"
import { getPublishedStorePage } from "@/lib/store-pages/get-store-page"
import { getStaticStorePage } from "@/lib/store-pages/static-pages"

const SITE_NAME = "Savage Rise"
const SITE_URL = "https://savagerise.com"

export async function generateStorePageMetadata(slug: string): Promise<Metadata> {
  const result = await getPublishedStorePage(slug)
  const fallbackPage = getStaticStorePage(slug)
  const page = result?.page ?? fallbackPage
  const seo = page?.seo
  const fallbackDescription = fallbackPage?.seo?.description
  const description = seo?.description || page?.subtitle || fallbackDescription || undefined
  const canonical = seo?.canonical_url || `${SITE_URL}/${page?.slug || slug}`
  const noIndex = seo?.no_index === true

  return {
    title: seo?.title || (page?.title ? `${page.title} | ${SITE_NAME}` : SITE_NAME),
    description,
    alternates: { canonical },
    robots: { index: !noIndex, follow: !noIndex },
    openGraph: {
      title: seo?.og_title || seo?.title || page?.title || SITE_NAME,
      description: seo?.og_description || seo?.description || page?.subtitle || fallbackDescription || undefined,
      images: seo?.og_image_url ? [{ url: seo.og_image_url }] : undefined,
      url: canonical,
      type: "website",
      siteName: SITE_NAME,
    },
  }
}

export async function StaticStorePage({ slug }: { slug: string }) {
  const result = await getPublishedStorePage(slug)
  const page = result?.page ?? getStaticStorePage(slug)

  if (!page) return null
  return <StorePageShell page={page} />
}
