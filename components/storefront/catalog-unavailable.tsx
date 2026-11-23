import CatalogRetry from "@/components/storefront/catalog-retry"

export default function CatalogUnavailable() {
  return (
    <div role="status" className="border border-border bg-card p-8 text-center text-card-foreground">
      <h2 className="font-playfair text-2xl">The collection could not be loaded.</h2>
      <p className="mx-auto mb-5 mt-3 max-w-lg text-sm text-muted-foreground">Please try again to see the complete collection and current prices.</p>
      <CatalogRetry />
    </div>
  )
}
