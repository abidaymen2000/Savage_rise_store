import { StaticStorePage, generateStorePageMetadata } from "@/components/store-pages/static-store-page"

export const revalidate = 60

export function generateMetadata() {
  return generateStorePageMetadata("size-guide")
}

export default function SizeGuidePage() {
  return <StaticStorePage slug="size-guide" />
}
