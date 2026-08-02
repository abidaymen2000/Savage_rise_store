"use client"

import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import type { CSSProperties } from "react"
import { Button } from "@/components/ui/button"
import WishlistButton from "@/components/WishlistButton"
import { useCart } from "@/contexts/CartContext"
import { getFirstAvailableVariantSelection } from "@/lib/meta-content"
import { isProductInStock } from "@/lib/utils"
import type { Product } from "@/types/api"

function ProductActionLabel({ label }: { label: string }) {
  const containerRef = useRef<HTMLSpanElement | null>(null)
  const textRef = useRef<HTMLSpanElement | null>(null)
  const [overflowDistance, setOverflowDistance] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    const text = textRef.current
    if (!container || !text) return

    const measure = () => {
      const distance = Math.ceil(text.scrollWidth - container.clientWidth)
      setOverflowDistance(distance > 0 ? distance + 8 : 0)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    observer.observe(text)
    return () => observer.disconnect()
  }, [label])

  return (
    <span ref={containerRef} className="block min-w-0 overflow-hidden whitespace-nowrap px-1 max-[360px]:px-0">
      <span
        ref={textRef}
        className={`inline-block whitespace-nowrap px-2 transition-transform duration-700 ease-in-out max-[360px]:px-1 max-[360px]:text-[10px] max-[360px]:tracking-[0.04em] sm:px-3 ${
          overflowDistance > 0
            ? "motion-safe:group-hover:-translate-x-[var(--overflow-distance)] motion-safe:group-focus-visible:-translate-x-[var(--overflow-distance)]"
            : ""
        }`}
        style={{ "--overflow-distance": `${overflowDistance}px` } as CSSProperties}
      >
        {label}
      </span>
    </span>
  )
}

export default function ProductCardActions({ product, href }: { product: Product; href: string }) {
  const { addToCart } = useCart()
  const inStock = isProductInStock(product)
  const hasVariants = (product.variants ?? []).length > 0
  const primaryLabel = !inStock ? "SOLD OUT" : hasVariants ? "CHOISIR UNE TAILLE" : "VOIR LE PRODUIT"

  const handleQuickAdd = () => {
    const selection = getFirstAvailableVariantSelection(product)
    if (!selection || !inStock) return
    addToCart(product, selection.variant, selection.size.size, 1)
  }

  return (
    <div className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)_44px_44px] gap-2 pt-1 max-[360px]:grid-cols-2">
      {inStock ? (
        <Button
          asChild
          className="group relative h-11 min-w-0 overflow-hidden rounded-none bg-primary px-0 text-center text-[11px] font-semibold uppercase leading-tight tracking-[0.08em] text-primary-foreground hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground sm:text-xs sm:tracking-[0.12em] max-[360px]:col-span-2"
        >
          <Link href={href} className="min-w-0 overflow-hidden whitespace-nowrap">
            <ProductActionLabel label={primaryLabel} />
          </Link>
        </Button>
      ) : (
        <Button
          type="button"
          disabled
          aria-disabled="true"
          className="group relative h-11 min-w-0 cursor-not-allowed overflow-hidden rounded-none bg-neutral-300 px-0 text-center text-[11px] font-semibold uppercase leading-tight tracking-[0.12em] text-neutral-600 hover:bg-neutral-300 hover:text-neutral-600 disabled:opacity-100 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-400 sm:text-xs max-[360px]:col-span-2"
        >
          <ProductActionLabel label={primaryLabel} />
        </Button>
      )}
      <Button
        type="button"
        size="icon"
        className="h-11 w-11 min-w-[44px] shrink-0 rounded-none bg-muted text-foreground hover:bg-accent hover:text-accent-foreground"
        disabled={!inStock}
        aria-disabled={!inStock}
        onClick={handleQuickAdd}
        aria-label="Ajouter rapidement au panier"
      >
        <ShoppingBag className="h-4 w-4" />
      </Button>
      <WishlistButton productId={product.id} className="h-11 w-11 min-w-[44px] shrink-0 rounded-none" />
    </div>
  )
}
