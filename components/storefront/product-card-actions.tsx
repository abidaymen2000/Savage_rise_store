"use client"

import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import WishlistButton from "@/components/WishlistButton"
import { useCart } from "@/contexts/CartContext"
import { getFirstAvailableVariantSelection } from "@/lib/meta-content"
import { isProductInStock } from "@/lib/utils"
import type { Product } from "@/types/api"

export default function ProductCardActions({ product, href }: { product: Product; href: string }) {
  const { addToCart } = useCart()
  const inStock = isProductInStock(product)

  const handleQuickAdd = () => {
    const selection = getFirstAvailableVariantSelection(product)
    if (!selection || !inStock) return
    addToCart(product, selection.variant, selection.size.size, 1)
  }

  return (
    <div className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)_44px_44px] gap-2 pt-1 max-[360px]:grid-cols-2">
      <Button
        asChild
        className="h-11 min-w-0 rounded-none bg-primary px-2 text-center text-[11px] font-semibold uppercase leading-tight tracking-[0.08em] text-primary-foreground hover:bg-accent hover:text-accent-foreground sm:px-3 sm:text-xs sm:tracking-[0.12em] max-[360px]:col-span-2"
      >
        <Link href={href} className="min-w-0 justify-center overflow-hidden text-ellipsis whitespace-normal">
          {inStock ? "Choisir une taille" : "Voir le produit"}
        </Link>
      </Button>
      <Button
        type="button"
        size="icon"
        className="h-11 w-11 min-w-[44px] shrink-0 rounded-none bg-muted text-foreground hover:bg-accent hover:text-accent-foreground"
        disabled={!inStock}
        onClick={handleQuickAdd}
        aria-label="Ajouter rapidement au panier"
      >
        <ShoppingBag className="h-4 w-4" />
      </Button>
      <WishlistButton productId={product.id} className="h-11 w-11 min-w-[44px] shrink-0 rounded-none" />
    </div>
  )
}
