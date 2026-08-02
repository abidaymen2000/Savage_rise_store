import Image from "next/image"
import Link from "next/link"
import ProductCardActions from "@/components/storefront/product-card-actions"
import { getColorSwatch } from "@/lib/color-swatches"
import { formatPrice, getFirstProductImage, getProductImageAlt, isProductInStock } from "@/lib/utils"
import type { Product } from "@/types/api"

function getProductHref(product: Product) {
  return `/products/${product.slug || product.id}`
}

function getColors(product: Product) {
  const seen = new Set<string>()
  return (product.variants ?? []).flatMap((variant) => {
    const label = variant.option_values?.color ?? variant.color
    const key = label?.toLowerCase().trim()
    if (!label || !key || seen.has(key)) return []
    seen.add(key)
    return [{ label, swatch: getColorSwatch(variant.color_code ?? label) }]
  })
}

export default function ProductCard({ product, compact = false, priority = false }: { product: Product; compact?: boolean; priority?: boolean }) {
  const inStock = isProductInStock(product)
  const colors = getColors(product)
  const first = getFirstProductImage(product)
  const second = product.variants?.flatMap((variant) => variant.images ?? []).find((image) => image.url && image.url !== first)?.url
  const images = { first, second }
  const href = getProductHref(product)
  const compareAt = product.compare_at_price && product.compare_at_price > product.price ? product.compare_at_price : null

  return (
    <article className="group min-w-0 overflow-hidden border border-border bg-card text-card-foreground transition-colors duration-300 hover:border-accent/55">
      <Link href={href} className="relative block aspect-[3/4] overflow-hidden bg-muted">
        <Image
          src={images.first}
          alt={getProductImageAlt(product)}
          fill
          sizes="(min-width: 1536px) 300px, (min-width: 1280px) 23vw, (min-width: 1024px) 30vw, (min-width: 768px) 33vw, (min-width: 390px) 50vw, 100vw"
          className={`object-contain transition-transform duration-500 group-hover:scale-[1.025] ${!inStock ? "grayscale-[20%] opacity-90" : ""}`}
          priority={priority}
        />
        {images.second && (
          <Image
            src={images.second}
            alt=""
            fill
            sizes="(min-width: 1536px) 300px, (min-width: 1280px) 23vw, (min-width: 1024px) 30vw, (min-width: 768px) 33vw, (min-width: 390px) 50vw, 100vw"
            className={`hidden object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:block ${!inStock ? "grayscale-[20%]" : ""}`}
          />
        )}
        {!inStock && <div className="absolute inset-0 z-10 bg-card/10" aria-hidden="true" />}
        <div className="absolute left-3 top-3 z-20 flex flex-wrap gap-2">
          {!inStock && <span className="bg-black/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white shadow-sm ring-1 ring-white/10">SOLD OUT</span>}
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
