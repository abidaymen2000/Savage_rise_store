"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import WishlistButton from "@/components/WishlistButton"
import { useCart } from "@/contexts/CartContext"
import { getColorSwatch } from "@/lib/color-swatches"
import { getFirstAvailableVariantSelection } from "@/lib/meta-content"
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

export default function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { addToCart } = useCart()
  const [hovered, setHovered] = useState(false)
  const inStock = isProductInStock(product)
  const colors = useMemo(() => getColors(product), [product])
  const images = useMemo(() => {
    const first = getFirstProductImage(product)
    const second = product.variants?.flatMap((variant) => variant.images ?? []).find((image) => image.url && image.url !== first)?.url
    return { first, second }
  }, [product])
  const href = getProductHref(product)
  const compareAt = product.compare_at_price && product.compare_at_price > product.price ? product.compare_at_price : null

  const handleQuickAdd = () => {
    const selection = getFirstAvailableVariantSelection(product)
    if (!selection || !inStock) return
    addToCart(product, selection.variant, selection.size.size, 1)
  }

  return (
    <article
      className="group border border-stone-800 bg-[#080807] transition-colors duration-300 hover:border-stone-500"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={href} className="relative block aspect-[3/4] overflow-hidden bg-stone-950">
        <Image
          src={images.first}
          alt={getProductImageAlt(product)}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 50vw"
          className="object-contain transition-transform duration-500 group-hover:scale-[1.025]"
          unoptimized={images.first.startsWith("http")}
        />
        {images.second && (
          <Image
            src={images.second}
            alt=""
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 50vw"
            className={`hidden object-contain transition-opacity duration-300 md:block ${hovered ? "opacity-100" : "opacity-0"}`}
            unoptimized={images.second.startsWith("http")}
          />
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {!inStock && <span className="bg-black px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">Epuise</span>}
          {compareAt && <span className="bg-[#D4AF37] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-black">Promo</span>}
        </div>
      </Link>
      <div className="space-y-3 p-3 sm:p-4">
        <Link href={href} className="block">
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold uppercase tracking-[0.08em] text-white transition-colors group-hover:text-[#D4AF37] sm:text-base">
            {product.name}
          </h3>
          <div className="mt-2 flex flex-wrap items-baseline gap-2">
            <span className="text-sm font-semibold text-white sm:text-base">{formatPrice(product.price)}</span>
            {compareAt && <span className="text-xs text-stone-500 line-through">{formatPrice(compareAt)}</span>}
          </div>
        </Link>
        {colors.length > 0 && (
          <div className="flex items-center gap-1.5" aria-label="Couleurs disponibles">
            {colors.slice(0, 5).map((color) => (
              <span key={color.label} title={color.label} className="h-4 w-4 border border-white/30" style={{ backgroundColor: color.swatch }} />
            ))}
            {colors.length > 5 && <span className="text-xs text-stone-500">+{colors.length - 5}</span>}
          </div>
        )}
        {!compact && (
          <div className="flex gap-2 pt-1">
            <Button asChild className="h-11 flex-1 rounded-none bg-white text-xs font-semibold uppercase tracking-[0.12em] text-black hover:bg-[#D4AF37]">
              <Link href={href}>{inStock ? "Choisir une taille" : "Voir le produit"}</Link>
            </Button>
            <Button
              type="button"
              size="icon"
              className="h-11 w-11 rounded-none bg-stone-900 text-white hover:bg-[#D4AF37] hover:text-black"
              disabled={!inStock}
              onClick={handleQuickAdd}
              aria-label="Ajouter rapidement au panier"
            >
              <ShoppingBag className="h-4 w-4" />
            </Button>
            <WishlistButton productId={product.id} className="h-11 w-11 rounded-none" />
          </div>
        )}
      </div>
    </article>
  )
}
