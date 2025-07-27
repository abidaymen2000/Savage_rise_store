"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingBag } from "lucide-react"
import { api } from "@/lib/api"
import { useCart } from "@/contexts/CartContext"
import type { Product } from "@/types/api"
import Link from "next/link"

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const { addToCart } = useCart()

  useEffect(() => {
    async function fetchProducts() {
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
    }

    fetchProducts()
  }, [])

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1)
  }

  if (loading) {
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
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative overflow-hidden bg-black rounded-lg"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <Link href={`/products/${product.id}`}>
                <div className="aspect-[3/4] relative overflow-hidden">
                  <Image
                    src={product.images[0]?.url || "/placeholder.svg?height=400&width=300"}
                    alt={product.images[0]?.alt_text || product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Stock Status */}
                  {!product.in_stock && (
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
                <Button size="icon" variant="secondary" className="bg-white/90 hover:bg-white">
                  <Heart className="h-4 w-4 text-black" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="bg-white/90 hover:bg-white"
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.in_stock}
                >
                  <ShoppingBag className="h-4 w-4 text-black" />
                </Button>
              </div>
            </div>
          ))}
        </div>
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
    </section>
  )
}
