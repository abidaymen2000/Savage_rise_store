import { StaticStorePage, generateStorePageMetadata } from "@/components/store-pages/static-store-page"

export const revalidate = 60

export function generateMetadata() {
  return generateStorePageMetadata("about")
}

export default function AboutPage() {
  return <StaticStorePage slug="about" />
}
