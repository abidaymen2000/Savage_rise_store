import { ContactPageClient } from "@/components/store-pages/contact-page-client"
import { generateStorePageMetadata } from "@/components/store-pages/static-store-page"
import { getPublishedStorePage } from "@/lib/store-pages/get-store-page"
import { getStaticStorePage } from "@/lib/store-pages/static-pages"

export const revalidate = 60

export function generateMetadata() {
  return generateStorePageMetadata("contact")
}

export default async function ContactPage() {
  const result = await getPublishedStorePage("contact")
  const page = result?.page ?? getStaticStorePage("contact")

  return <ContactPageClient page={page} />
}
