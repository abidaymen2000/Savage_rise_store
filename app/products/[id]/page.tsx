"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Heart, ShoppingBag, Truck, Shield, RotateCcw, Star, Loader2 } from 'lucide-react'
import { api } from "@/lib/api"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import AuthModal from "@/app/components/AuthModal"
import type { Product, Variant, Review, WishlistItem } from "@/types/api"
import { getMetaContentId, getVariantSizeByName } from "@/lib/meta-content"
import { getAvailableColors, getAvailableSizes, getStockForSize, isProductInStock, formatPrice } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import WishlistButton from "@/components/WishlistButton"
import ProductReviewSection from "@/components/ProductReviewSection"
import { trackMetaPixelEvent } from "@/lib/meta-pixel"
import { trackStoreEvent } from "@/lib/store-analytics"

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [quantity, setQuantity] = useState(1)
  const [currentVariant, setCurrentVariant] = useState<Variant | null>(null)
  const { addToCart } = useCart()

  // Wishlist state
  const [userWishlist, setUserWishlist] = useState<WishlistItem[]>([])
  const [isWishlistLoading, setIsWishlistLoading] = useState(true)

  // Review state
  const [productReviews, setProductReviews] = useState<Review[]>([])
  const [reviewStats, setReviewStats] = useState<{ average_rating: number | null; count: number } | null>(null)
  const [loadingReviews, setLoadingReviews] = useState(true)
  const [userRating, setUserRating] = useState<number | null>(null)
  const [userComment, setUserComment] = useState("")
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [reviewError, setReviewError] = useState<string | null>(null)
  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null)

  const fetchProductAndReviews = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.getProduct(productId)
      setProduct(data)

      // Set default color and variant if available
      if (data.variants && data.variants.length > 0) {
        const firstVariant = data.variants[0]
        setSelectedColor(firstVariant.color)
        setCurrentVariant(firstVariant)

        // Set default size if available
        if (firstVariant.sizes && firstVariant.sizes.length > 0) {
          const firstAvailableSize = firstVariant.sizes.find((size) => size.stock > 0)
          if (firstAvailableSize) {
            setSelectedSize(firstAvailableSize.size)
          }
        }
      }

      // Fetch reviews and stats
      setLoadingReviews(true)
      const [reviews, stats] = await Promise.all([
        api.getProductReviews(productId),
        api.getReviewStats(productId),
      ])
      setProductReviews(reviews)
      setReviewStats(stats)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading product or reviews")
    } finally {
      setLoading(false)
      setLoadingReviews(false)
    }
  }, [productId])

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
      setUserWishlist([])
    } finally {
      setIsWishlistLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (productId) {
      fetchProductAndReviews()
    }
  }, [productId, fetchProductAndReviews])

  useEffect(() => {
    fetchUserWishlist()
  }, [isAuthenticated, fetchUserWishlist])

  useEffect(() => {
    if (!product) return
    if (product.variants.length > 0) {
      if (!currentVariant) return
      if (currentVariant.sizes.length > 0 && !selectedSize) return
    }
    const selectedVariantSize = getVariantSizeByName(currentVariant, selectedSize)
    const metaContentId = getMetaContentId({
      product,
      variant: currentVariant,
      size: selectedVariantSize,
      selectedSize,
    })
    trackMetaPixelEvent("ViewContent", {
      content_ids: metaContentId ? [metaContentId] : [product.id],
      content_name: product.name,
      content_type: "product",
      contents: [
        {
          id: metaContentId ?? product.id,
          quantity: 1,
          item_price: product.price,
        },
      ],
      currency: "TND",
      value: product.price,
    })
    trackStoreEvent("product_viewed", {
      product_id: product.id,
      metadata: {
        product_name: product.name,
        full_name: product.full_name,
        price: product.price,
        in_stock: product.in_stock,
        categories: product.categories,
      },
    })
  }, [product, currentVariant, selectedSize])

  // Update current variant when color changes
  useEffect(() => {
    if (product && selectedColor) {
      const variant = product.variants.find((v) => v.color === selectedColor)
      setCurrentVariant(variant || null)
      setSelectedImageIndex(0) // Reset image index when changing variant

      // Reset size selection when changing color
      if (variant && variant.sizes.length > 0) {
        const firstAvailableSize = variant.sizes.find((size) => size.stock > 0)
        setSelectedSize(firstAvailableSize ? firstAvailableSize.size : "")
      }
    }
  }, [product, selectedColor])

  const handleAddToCart = () => {
    if (product && isProductInStock(product) && currentVariant && selectedSize) {
      addToCart(product, currentVariant, selectedSize, quantity)
    }
  }

  const handleStarClick = (rating: number) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setUserRating(rating);
    setShowReviewForm(true);
    setReviewError(null);
    setReviewSuccess(null);
  };

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    if (!product || userRating === null) {
      setReviewError("Please select a rating.");
      return;
    }

    setIsSubmittingReview(true);
    setReviewError(null);
    setReviewSuccess(null);

    try {
      await api.addReview(product.id, userRating, userComment);
      setReviewSuccess("Your review has been submitted successfully!");
      setUserRating(null);
      setUserComment("");
      setShowReviewForm(false);
      await fetchProductAndReviews(); // Refresh reviews
    } catch (err) {
      setReviewError(err instanceof Error ? err.message : "Error submitting your review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const productInStock = product ? isProductInStock(product) : false
  const availableColors = product ? getAvailableColors(product) : []
  const availableSizes = product && productInStock ? getAvailableSizes(product, selectedColor) : []
  const currentStock =
    productInStock && product && selectedColor && selectedSize ? getStockForSize(product, selectedColor, selectedSize) : 0

  // Get current images to display
  const currentImages = currentVariant?.images || []
  const displayImages =
    currentImages.length > 0
      ? currentImages
      : [
          {
            id: "placeholder",
            url: "/placeholder.svg?height=600&width=600",
            alt_text: product?.name || "Product image",
            order: 1,
          },
        ]

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
              <p className="text-gray-400">Loading product...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-black text-white pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <p className="text-red-400 mb-4">Error: {error || "Product not found"}</p>
            <Link href="/products">
              <Button className="bg-gold text-black hover:bg-gold/90">Back to products</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <Link href="/products" className="flex items-center text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to products
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-900">
              <Image
                src={displayImages[selectedImageIndex]?.url || "/placeholder.svg?height=600&width=600"}
                alt={displayImages[selectedImageIndex]?.alt_text || product.name}
                fill
                className="object-cover"
              />
            </div>

            {displayImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {displayImages.map((image, index) => (
                  <button
                    key={image.id || index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square relative overflow-hidden rounded-lg ${
                      selectedImageIndex === index ? "ring-2 ring-gold" : ""
                    }`}
                  >
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={image.alt_text || `${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-playfair font-bold mb-2">{product.name}</h1>
              <p className="text-xl text-gray-400 mb-4">{product.full_name}</p>
              <p className="text-3xl font-bold text-gold">{formatPrice(product.price)}</p>
            </div>

            {/* Stock Status */}
            <div>
              {productInStock ? (
                <Badge className="bg-green-600 text-white">In stock</Badge>
              ) : (
                <Badge className="bg-red-600 text-white">Out of stock</Badge>
              )}
              {productInStock && selectedSize && currentStock > 0 && (
                <span className="ml-2 text-sm text-gray-400">
                  ({currentStock} available)
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-300 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Color Selection */}
            {availableColors.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Color</h3>
                <Select
                  value={selectedColor}
                  onValueChange={(color) => {
                    setSelectedColor(color)
                    trackStoreEvent("color_selected", {
                      product_id: product.id,
                      metadata: {
                        color,
                        product_name: product.name,
                      },
                    })
                  }}
                >
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder="Choisir une couleur" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {availableColors.map((color) => (
                      <SelectItem key={color} value={color} className="text-white">
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Size</h3>
                <Select
                  value={selectedSize}
                  onValueChange={(size) => {
                    setSelectedSize(size)
                    trackStoreEvent("size_selected", {
                      product_id: product.id,
                      metadata: {
                        size,
                        color: selectedColor,
                        product_name: product.name,
                      },
                    })
                  }}
                >
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder="Choisir une taille" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {availableSizes.map((size) => {
                      const stock = getStockForSize(product, selectedColor, size)
                      return (
                        <SelectItem key={size} value={size} className="text-white" disabled={stock === 0}>
                          {size}{" "}
                          {stock === 0 ? "(Out of stock)" : stock < 5 ? `(${stock} left)` : ""}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Quantity */}
            {productInStock && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Quantity</h3>
              <Select value={quantity.toString()} onValueChange={(value) => setQuantity(Number.parseInt(value))}>
                <SelectTrigger className="w-24 bg-gray-900 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {Array.from({ length: Math.min(currentStock, 5) }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()} className="text-white">
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={!productInStock || !selectedSize || currentStock === 0}
                className="flex-1 bg-gold text-black hover:bg-gold/90 font-semibold py-3"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Add to cart
              </Button>
              <WishlistButton productId={product.id} className="h-12 w-12" />
            </div>

            {/* Product Details */}
            <Separator className="bg-gray-700" />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Product details</h3>

              {product.fabric && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Fabric:</span>
                  <span>{product.fabric}</span>
                </div>
              )}

              {product.composition && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Composition:</span>
                  <span>
                    {Object.entries(product.composition)
                      .map(([material, percentage]) => `${material} ${percentage}%`)
                      .join(", ")}
                  </span>
                </div>
              )}

              {product.care_instructions && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Care:</span>
                  <span>{product.care_instructions}</span>
                </div>
              )}

              {product.sku && (
                <div className="flex justify-between">
                  <span className="text-gray-400">SKU:</span>
                  <span>{product.sku}</span>
                </div>
              )}
            </div>

            {/* Services */}
            <Separator className="bg-gray-700" />

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-gold" />
                <span>Free shipping from 300 TND</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-gold" />
                <span>Free returns within 7 days</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-gold" />
                <span>2-year quality guarantee</span>
              </div>
            </div>

            {/* Product Review Section */}
            <ProductReviewSection productId={productId} />
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} defaultTab="login" />
    </div>
  )
}
