"use client"

import CatalogUnavailable from "@/components/storefront/catalog-unavailable"

export default function Error() {
  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-32 text-foreground sm:px-6">
      <div className="mx-auto max-w-3xl"><CatalogUnavailable /></div>
    </main>
  )
}

