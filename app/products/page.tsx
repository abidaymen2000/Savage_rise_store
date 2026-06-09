"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, ShoppingBag, Search, Filter, Loader2 } from 'lucide-react'
import { api } from "@/lib/api"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import AuthModal from "@/app/components/AuthModal"
import type { Product, WishlistItem } from "@/types/api"
import { getFirstProductImage, getProductImageAlt, isProductInStock, formatPrice } from "@/lib/utils"
import WishlistButton from "@/components/WishlistButton"

export default function ProductsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [genderFilter, setGenderFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const { addToCart } = useCart()

  // Wishlist state
  const [userWishlist, setUserWishlist] = useState<WishlistItem[]>([])
  const [isWishlistLoading, setIsWishlistLoading] = useState(true)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("Fetching all products...")
      const data =
        genderFilter === "all"
          ? await api.getProducts(0, 50)
          : await api.searchProducts({ gender: genderFilter }, 0, 50)
      console.log("Products loaded:", data.length)
      setProducts(data)
    } catch (err) {
      console.error("Error fetching products:", err)
      const errorMessage = err instanceof Error ? err.message : "Error loading products"
      setError(errorMessage)
      // Don't show error if we have fallback data
      if (errorMessage.includes("Network error")) {
        setError(null)
      }
    } finally {
      setLoading(false)
    }
  }, [genderFilter])

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
    const params = new URLSearchParams(window.location.search)
    setGenderFilter(params.get("gender") || "all")
  }, [])

  useEffect(() => {
    fetchUserWishlist()
  }, [isAuthenticated, fetchUserWishlist])

  const filteredAndSortedProducts = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "name":
        default:
          return a.name.localeCompare(b.name)
      }
    })

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
      <div className="min-h-screen bg-black text-white pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
              <p className="text-gray-400">Loading products...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <p className="text-red-400 mb-4">Error: {error}</p>
            <Button onClick={() => window.location.reload()} className="bg-gold text-black hover:bg-gold/90">
              Try again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-4">COLLECTION SAVAGE RISE</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover our exclusive collection of luxury pieces, designed for a contemporary and confident style.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search for a product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-400"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48 bg-gray-900 border-gray-700 text-white">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="price-asc">Price: low to high</SelectItem>
              <SelectItem value="price-desc">Price: high to low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={genderFilter} onValueChange={setGenderFilter}>
            <SelectTrigger className="w-full md:w-48 bg-gray-900 border-gray-700 text-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="men">Essentiels</SelectItem>
              <SelectItem value="women">Signature</SelectItem>
              <SelectItem value="unisex">Unisex</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredAndSortedProducts.map((product) => {
              const productInStock = isProductInStock(product)
              const imageUrl = getFirstProductImage(product)
              const imageAlt = getProductImageAlt(product)

              return (
                <div
                  key={product.id}
                  className="group relative overflow-hidden bg-gray-900 rounded-lg"
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
                            Out of stock
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
        )}
      </div>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} defaultTab="login" />
    </div>
  )
}
