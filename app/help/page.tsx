import { StaticStorePage, generateStorePageMetadata } from "@/components/store-pages/static-store-page"

export const revalidate = 60

export function generateMetadata() {
  return generateStorePageMetadata("help")
}

export default function HelpPage() {
  return <StaticStorePage slug="help" />
}
