"use client"
import { useStorePrice } from "@/hooks/use-store-price"
import ProductCardMedia from "./product-card-media"
import { getProductColorGalleries } from "@/lib/product-color-media"
import Link from "next/link"
import ProductCardActions from "@/components/storefront/product-card-actions"
import { getColorSwatch } from "@/lib/color-swatches"
import { isProductInStock } from "@/lib/utils"
import { getProductAvailability } from "@/lib/inventory"
import { isSoldOut } from "@/lib/availability"
import type { Product } from "@/types/api"

function getProductHref(product: Product) {
  return `/products/${product.slug || product.id}`
}

function getColors(product: Product) {
  return getProductColorGalleries(product).map(group => ({ label: group.color, swatch: getColorSwatch(group.colorCode || group.color) }))
}

export default function ProductCard({ product, compact = false, priority = false }: { product: Product; compact?: boolean; priority?: boolean }) {
  const formatPrice = useStorePrice()
  const inStock = isProductInStock(product)
  const availability = getProductAvailability(product)
  const colors = getColors(product)
  const href = getProductHref(product)
  const compareAt = product.compare_at_price && product.compare_at_price > product.price ? product.compare_at_price : null

  return (
    <article className="group min-w-0 overflow-hidden border border-border bg-card text-card-foreground transition-colors duration-300 hover:border-accent/55">
      <Link href={href} className="relative block aspect-[3/4] overflow-hidden bg-muted">
        <ProductCardMedia product={product} priority={priority} inStock={inStock} />
        {!inStock && <div className="absolute inset-0 z-10 bg-card/10" aria-hidden="true" />}
        <div className="absolute left-3 top-3 z-20 flex flex-wrap gap-2">
          {isSoldOut(availability) && <span className="bg-black/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white shadow-sm ring-1 ring-white/10">SOLD OUT</span>}
          {compareAt && <span className="bg-accent px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-foreground">Promo</span>}
        </div>
      </Link>
      <div className="min-w-0 space-y-3 p-3 sm:p-4">
        <Link href={href} className="block min-w-0">
          <h3 className="line-clamp-2 min-h-[2.5rem] overflow-hidden break-words text-sm font-semibold uppercase tracking-[0.08em] text-card-foreground transition-colors group-hover:text-accent sm:text-base" dir="auto">
            {product.name}
          </h3>
          <div className="mt-2 flex min-w-0 flex-wrap items-baseline gap-2">
            <span className="text-sm font-semibold text-card-foreground sm:text-base">{formatPrice(product.price)}</span>
            {compareAt && <span className="text-xs text-muted-foreground line-through">{formatPrice(compareAt)}</span>}
          </div>
        </Link>
        {colors.length > 0 && (
          <div className="flex min-w-0 items-center gap-1.5 overflow-hidden" aria-label="Couleurs disponibles">
            {colors.slice(0, 5).map((color) => (
              <span key={color.label} title={color.label} className="h-4 w-4 shrink-0 border border-border" style={{ backgroundColor: color.swatch }} />
            ))}
            {colors.length > 5 && <span className="text-xs text-muted-foreground">+{colors.length - 5}</span>}
          </div>
        )}
        {!compact && <ProductCardActions product={product} href={href} />}
      </div>
    </article>
  )
}
