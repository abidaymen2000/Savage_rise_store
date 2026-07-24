import { StaticStorePage, generateStorePageMetadata } from "@/components/store-pages/static-store-page"

export const revalidate = 60

export function generateMetadata() {
  return generateStorePageMetadata("shipping")
}

export default function ShippingPage() {
  return <StaticStorePage slug="shipping" />
}
