"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ShoppingBag, Truck, Shield, RotateCcw } from "lucide-react"
import { api } from "@/lib/api"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import AuthModal from "@/app/components/AuthModal"
import type { Pack, Product, Variant } from "@/types/api"
import { getAvailableStock, getVariantSize, isSizePurchasable } from "@/lib/inventory"
import { getMetaContentId, getVariantSizeByName } from "@/lib/meta-content"
import {
  buildPackSelections,
  findCompanionComponents,
  findRelatedPack,
  getAvailableSizesForColor,
  getPackPrice,
  getPackSavingsLabel,
  getProductColorOptions,
  getProductImageForColor,
} from "@/lib/pack-offers"
import { getAvailableColors, getAvailableSizes, getStockForSize, isProductInStock, formatPrice } from "@/lib/utils"
import WishlistButton from "@/components/WishlistButton"
import ProductReviewSection from "@/components/ProductReviewSection"
import { getCurrentPageViewId } from "@/lib/analytics-context"
import { trackMetaPixelEvent } from "@/lib/meta-pixel"
import { trackStoreEvent } from "@/lib/store-analytics"
import { useStoreConfig } from "@/contexts/StoreConfigContext"
import { isFeatureEnabled } from "@/lib/store-config-shared"

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  const { isAuthenticated } = useAuth()
  const { config } = useStoreConfig()
  const packsEnabled = isFeatureEnabled(config, "packs", true)
  const wishlistEnabled = isFeatureEnabled(config, "wishlist", true)
  const reviewsEnabled = isFeatureEnabled(config, "reviews", true)

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [quantity, setQuantity] = useState(1)
  const [currentVariant, setCurrentVariant] = useState<Variant | null>(null)
  const [relatedPack, setRelatedPack] = useState<Pack | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Record<string, Product>>({})
  const [relatedPackSizes, setRelatedPackSizes] = useState<Record<string, string>>({})
  const { addToCart, addPackToCart } = useCart()

  const fetchProductAndReviews = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [data, packsData] = await Promise.all([
        api.getProduct(productId),
        packsEnabled ? api.getPacks(0, 50).catch(() => [] as Pack[]) : Promise.resolve([] as Pack[]),
      ])
      setProduct(data)

      // Set default color and variant if available
      if (data.variants && data.variants.length > 0) {
        const firstVariant = data.variants[0]
        setSelectedColor(firstVariant.color)
        setCurrentVariant(firstVariant)

        // Set default size if available
        if (firstVariant.sizes && firstVariant.sizes.length > 0) {
          const firstAvailableSize = firstVariant.sizes.find((size) => isSizePurchasable(size))
          if (firstAvailableSize) {
            setSelectedSize(firstAvailableSize.size)
          }
        }
      }

      const nextRelatedPack = findRelatedPack(productId, packsData)
      setRelatedPack(nextRelatedPack)

      if (nextRelatedPack) {
        const companionIds = findCompanionComponents(nextRelatedPack, productId).map((component) => component.product_id)
        const companionProducts = await Promise.all(
          companionIds.map((companionId) => api.getProduct(companionId).catch(() => null)),
        )

        const companionMap = companionProducts.reduce<Record<string, Product>>((map, companionProduct) => {
          if (companionProduct) map[companionProduct.id] = companionProduct
          return map
        }, {})

        setRelatedProducts(companionMap)
      } else {
        setRelatedProducts({})
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading product")
    } finally {
      setLoading(false)
    }
  }, [packsEnabled, productId])

  useEffect(() => {
    if (productId) {
      fetchProductAndReviews()
    }
  }, [productId, fetchProductAndReviews])

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
    const pageViewId = getCurrentPageViewId()
    const analyticsEvent = trackStoreEvent("product_viewed", {
      product_id: product.id,
      variant_id: currentVariant?.meta_content_id ?? null,
      currency: "TND",
      value: product.price,
      deduplication_key: `product_viewed:${pageViewId ?? "no_page"}:${product.id}:${currentVariant?.color ?? "none"}:${selectedSize || "none"}`,
      items: [
        {
          product_id: product.id,
          variant_id: currentVariant?.meta_content_id ?? null,
          sku: product.sku ?? null,
          product_name: product.name,
          variant_name: currentVariant ? `${currentVariant.color} / ${selectedSize}` : null,
          item_type: "product",
          quantity: 1,
          unit_price: product.price,
          line_total: product.price,
          currency: "TND",
        },
      ],
      metadata: {
        product_name: product.name,
        full_name: product.full_name,
        price: product.price,
        in_stock: product.in_stock,
        categories: product.categories,
      },
    })
    if (!analyticsEvent.eventId) return

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
    }, {
      eventID: analyticsEvent.eventId,
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
        const firstAvailableSize = variant.sizes.find((size) => isSizePurchasable(size))
        setSelectedSize(firstAvailableSize ? firstAvailableSize.size : "")
      }
    }
  }, [product, selectedColor])

  useEffect(() => {
    if (!product || !relatedPack) return
    setRelatedPackSizes((current) => {
      const nextSizes: Record<string, string> = {}

      for (const component of findCompanionComponents(relatedPack, product.id)) {
        const companionProduct = relatedProducts[component.product_id]
        const sameColorAvailable = getProductColorOptions(companionProduct).includes(selectedColor)
        const color = component.color || (sameColorAvailable ? selectedColor : companionProduct?.variants?.[0]?.color || "")
        const sizeOptions = getAvailableSizesForColor(companionProduct, color)
        if (sizeOptions.length > 0) {
          nextSizes[component.product_id] = sizeOptions.includes(current[component.product_id])
            ? current[component.product_id]
            : sizeOptions[0]
        }
      }

      return nextSizes
    })
  }, [product, relatedPack, relatedProducts, selectedColor])

  const handleAddToCart = () => {
    if (product && currentVariant && selectedSize && canAddCurrentSelection) {
      addToCart(product, currentVariant, selectedSize, quantity)
    }
  }

  const handleAddRelatedPack = () => {
    if (!product || !relatedPack || !currentVariant || !selectedSize) return

    const companionOverrides = findCompanionComponents(relatedPack, product.id).reduce<Record<string, { color: string; size: string }>>(
      (acc, component) => {
        const companionProduct = relatedProducts[component.product_id]
        const sameColorAvailable = getProductColorOptions(companionProduct).includes(selectedColor)
        const color = component.color || (sameColorAvailable ? selectedColor : companionProduct?.variants?.[0]?.color || "")
        const size = relatedPackSizes[component.product_id] || getAvailableSizesForColor(companionProduct, color)[0] || ""
        if (color && size) {
          acc[component.product_id] = { color, size }
        }
        return acc
      },
      {
        [product.id]: {
          color: selectedColor,
          size: selectedSize,
        },
      },
    )

    const selections = buildPackSelections(
      relatedPack,
      {
        [product.id]: product,
        ...relatedProducts,
      },
      {
        preferredColor: selectedColor,
        overrides: companionOverrides,
      },
    )

    if (!selections) return

    addPackToCart(relatedPack, selections, quantity)
    trackStoreEvent("button_clicked", {
      product_id: product.id,
      metadata: {
        action: "complete_the_look_added",
        pack_id: relatedPack.id,
        quantity,
      },
    })
  }

  const productInStock = product ? isProductInStock(product) : false
  const availableColors = product ? getAvailableColors(product) : []
  const availableSizes = product && productInStock ? getAvailableSizes(product, selectedColor) : []
  const currentStock =
    productInStock && product && selectedColor && selectedSize ? getStockForSize(product, selectedColor, selectedSize) : 0
  const selectedVariantSize = getVariantSize(currentVariant, selectedSize)
  const canAddCurrentSelection =
    Boolean(productInStock && currentVariant && selectedSize) &&
    getAvailableStock(selectedVariantSize) > 0 &&
    quantity <= getAvailableStock(selectedVariantSize)
  const companionComponents = product ? findCompanionComponents(relatedPack, product.id) : []
  const completeLookReady =
    companionComponents.length > 0 &&
    companionComponents.every((component) => {
      const companionProduct = relatedProducts[component.product_id]
      const sameColorAvailable = getProductColorOptions(companionProduct).includes(selectedColor)
      const color = component.color || (sameColorAvailable ? selectedColor : companionProduct?.variants?.[0]?.color || "")
      const selectedCompanionSize = relatedPackSizes[component.product_id]
      return Boolean(color && selectedCompanionSize)
    })

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
              <p className="text-3xl font-bold text-gold">{formatPrice(product.price, config)}</p>
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
            <div className="flex flex-col gap-3 min-[400px]:flex-row min-[400px]:items-stretch">
              <Button
                onClick={handleAddToCart}
                disabled={!canAddCurrentSelection}
                className="w-full flex-1 bg-gold px-4 py-3 text-black hover:bg-gold/90 font-semibold whitespace-normal text-center leading-snug"
              >
                <ShoppingBag className="mr-2 h-5 w-5 shrink-0" />
                Buy this item only - {formatPrice(product.price * quantity, config)}
              </Button>
              {wishlistEnabled && <WishlistButton productId={product.id} className="h-12 w-full min-[400px]:w-12 shrink-0" />}
            </div>

            {packsEnabled && relatedPack && companionComponents.length > 0 && (
              <div className="rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/10 via-black to-black p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Complete the look</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-gray-900">
                    <Image
                      src={displayImages[0]?.url || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-center text-2xl font-semibold text-gold">+</div>
                  {companionComponents.map((component) => {
                    const companionProduct = relatedProducts[component.product_id]
                    if (!companionProduct) return null

                    const sameColorAvailable = getProductColorOptions(companionProduct).includes(selectedColor)
                    const companionColor = component.color || (sameColorAvailable ? selectedColor : companionProduct.variants?.[0]?.color || "")
                    const companionSizes = getAvailableSizesForColor(companionProduct, companionColor)

                    return (
                      <div key={component.id} className="space-y-3">
                        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-gray-900">
                          <Image
                            src={getProductImageForColor(companionProduct, companionColor)}
                            alt={companionProduct.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{companionProduct.name}</p>
                          <p className="text-sm text-gray-400">
                            {sameColorAvailable ? `Matching color: ${selectedColor}` : `Set color: ${companionColor}`}
                          </p>
                        </div>
                        {companionSizes.length > 0 && !component.size && (
                          <Select
                            value={relatedPackSizes[component.product_id] || companionSizes[0]}
                            onValueChange={(value) =>
                              setRelatedPackSizes((current) => ({
                                ...current,
                                [component.product_id]: value,
                              }))
                            }
                          >
                            <SelectTrigger className="bg-gray-950 border-gray-700 text-white">
                              <SelectValue placeholder="Choose matching size" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 border-gray-700">
                              {companionSizes.map((size) => (
                                <SelectItem key={size} value={size} className="text-white">
                                  {size}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="mt-5 rounded-xl border border-white/10 bg-black/50 p-4">
                  <p className="text-sm uppercase tracking-[0.18em] text-gray-500">{relatedPack.title}</p>
                  <p className="mt-2 text-sm text-gray-300">Buy it separately or complete the set and save instantly.</p>
                  <div className="mt-4 flex flex-wrap items-end gap-4">
                    <div>
                        <p className="text-sm text-gray-500 line-through">
                          {formatPrice((relatedPack.original_price ?? product.price) * quantity, config)}
                        </p>
                      <p className="text-3xl font-bold text-gold">{formatPrice(getPackPrice(relatedPack) * quantity, config)}</p>
                    </div>
                    <p className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-sm font-medium text-green-300">
                      Save {formatPrice(getPackSavingsLabel(relatedPack) * quantity, config)}
                    </p>
                  </div>
                  <p className="mt-3 text-sm text-gray-400">Same-color set. Choose each item&apos;s size separately.</p>
                </div>

                <Button
                  onClick={handleAddRelatedPack}
                  disabled={!canAddCurrentSelection || !completeLookReady}
                  className="mt-5 w-full bg-white text-black hover:bg-gold"
                >
                  Get the complete set - {formatPrice(getPackPrice(relatedPack) * quantity, config)}
                </Button>
              </div>
            )}

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
            {reviewsEnabled && <ProductReviewSection productId={productId} />}
          </div>
        </div>
      </div>
    </div>
  )
}
