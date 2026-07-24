import { StaticStorePage, generateStorePageMetadata } from "@/components/store-pages/static-store-page"

export const revalidate = 60

export function generateMetadata() {
  return generateStorePageMetadata("returns")
}

export default function ReturnsPage() {
  return <StaticStorePage slug="returns" />
}
