"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Loader2 } from 'lucide-react'
import { api } from "@/lib/api"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import AuthModal from "@/app/components/AuthModal"
import type { Product, WishlistItem } from "@/types/api" // Added WishlistItem import
import Link from "next/link"
import { getFirstProductImage, getProductImageAlt, isProductInStock, formatPrice } from "@/lib/utils"
import WishlistButton from "@/components/WishlistButton"

export default function FeaturedProducts() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const { addToCart } = useCart()

  // Wishlist state
  const [userWishlist, setUserWishlist] = useState<WishlistItem[]>([])
  const [isWishlistLoading, setIsWishlistLoading] = useState(true)

  const fetchProducts = useCallback(async () => {
    try {
      console.log("Fetching featured products...")
      const data = await api.getProducts(0, 4) // Get first 4 products
      console.log("Products loaded:", data.length)
      setProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
      // Don't set error state, just log it since we have fallback data
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchUserWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setUserWishlist([])
      setIsWishlistLoading(false)
      return
    }
    try {
      setIsWishlistLoading(true)
      const wishlistData = await api.getWishlist()
      setUserWishlist(wishlistData)
    } catch (err) {
      console.error("Error fetching wishlist:", err)
      setUserWishlist([])
    } finally {
      setIsWishlistLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    fetchUserWishlist()
  }, [isAuthenticated, fetchUserWishlist])

  const handleAddToCart = (product: Product) => {
    // Get the first available variant and size
    if (product.variants && product.variants.length > 0) {
      const firstVariant = product.variants[0]
      if (firstVariant.sizes && firstVariant.sizes.length > 0) {
        const firstAvailableSize = firstVariant.sizes.find((size) => size.stock > 0)
        if (firstAvailableSize) {
          addToCart(product, firstVariant, firstAvailableSize.size, 1)
        }
      }
    }
  }

  if (loading || authLoading) {
    return (
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
            <p className="text-gray-400">Chargement des produits...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-4">PRODUITS PHARES</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Une sélection exclusive de nos pièces les plus emblématiques, conçues pour l'homme moderne qui ne fait aucun
            compromis sur l'élégance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => {
            const productInStock = isProductInStock(product)
            const imageUrl = getFirstProductImage(product)
            const imageAlt = getProductImageAlt(product)

            return (
              <div
                key={product.id}
                className="group relative overflow-hidden bg-black rounded-lg"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <Link href={`/products/${product.id}`}>
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <Image
                      src={imageUrl || "/placeholder.svg"}
                      alt={imageAlt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Stock Status */}
                    {!productInStock && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-red-600 text-white px-3 py-1 text-xs font-semibold rounded-full">
                          Rupture de stock
                        </span>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Quick Actions */}
                <div
                  className={`absolute top-4 right-4 flex flex-col gap-2 transition-opacity duration-300 ${
                    hoveredProduct === product.id ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <WishlistButton productId={product.id} />
                  <Button
                    size="icon"
                    variant="secondary"
                    className="bg-white/90 hover:bg-white"
                    onClick={() => handleAddToCart(product)}
                    disabled={!productInStock}
                  >
                    <ShoppingBag className="h-4 w-4 text-black" />
                  </Button>
                </div>

                <div className="p-6">
                  <Link href={`/products/${product.id}`}>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-gold transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
                    )}
                    <p className="text-gold text-lg font-bold">{formatPrice(product.price)}</p>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Link href="/products">
            <Button
              size="lg"
              variant="outline"
              className="border-gold text-gold hover:bg-gold hover:text-black px-8 py-3 bg-transparent"
            >
              VOIR TOUTE LA COLLECTION
            </Button>
          </Link>
        </div>
      </div>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} defaultTab="login" />
    </section>
  )
}
