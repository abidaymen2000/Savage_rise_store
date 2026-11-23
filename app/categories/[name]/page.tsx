import ProductsPage from "@/app/products/page"

export const dynamic = "force-dynamic"
export const fetchCache = "default-no-store"

// Category routes share the complete catalogue, descendant filters and card controls.
export default function CategoryPage({ params, searchParams }: {
  params: { name: string }
  searchParams: Record<string, string | string[] | undefined>
}) {
  return <ProductsPage searchParams={{ ...searchParams, category: params.name }} />
}
