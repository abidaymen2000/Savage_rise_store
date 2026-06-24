"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Package, ShoppingBag } from "lucide-react"
import { api } from "@/lib/api"
import ProductSetBadge from "@/components/ProductSetBadge"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import AuthModal from "@/app/components/AuthModal"
import type { Pack, Product, WishlistItem } from "@/types/api" // Added WishlistItem import
import Link from "next/link"
import { getFirstAvailableVariantSelection } from "@/lib/meta-content"
import { findRelatedPack } from "@/lib/pack-offers"
import { getFirstProductImage, getProductImageAlt, isProductInStock, formatPrice } from "@/lib/utils"
import WishlistButton from "@/components/WishlistButton"

function getColorSwatch(color: string) {
  const normalized = color.toLowerCase()
  if (normalized.includes("noir") || normalized.includes("black")) return "#050505"
  if (normalized.includes("blanc") || normalized.includes("white")) return "#f5f1e8"
  if (normalized.includes("gris") || normalized.includes("gray") || normalized.includes("grey")) return "#777"
  if (normalized.includes("beige") || normalized.includes("cream")) return "#d8c7a1"
  if (normalized.includes("bleu") || normalized.includes("blue")) return "#1f3f74"
  if (normalized.includes("rouge") || normalized.includes("red")) return "#8f1d1d"
  if (normalized.includes("vert") || normalized.includes("green")) return "#245c3b"
  return "#d6b536"
}

function getDiscountLabel(pack: Pack) {
  return pack.discount_type === "percent"
    ? `${pack.discount_value}% off`
    : `${formatPrice(pack.discount_value)} off`
}

function getVariantImage(product: Product | undefined, color?: string | null) {
  if (!product) return null
  const normalizedColor = color?.toLowerCase().trim()
  const variant = normalizedColor
    ? product.variants?.find((item) => item.color.toLowerCase().trim() === normalizedColor)
    : product.variants?.[0]

  return variant?.images?.[0]?.url ?? null
}

function getPackPreviewItems(pack: Pack, productLookup: Record<string, Product>) {
  if (pack.components?.length) {
    return pack.components.map((component) => ({
      id: component.id,
      name: component.product?.name ?? "Pack item",
      image: getVariantImage(productLookup[component.product_id], component.color) ?? component.product?.image_url,
      qty: component.qty ?? 1,
      color: component.color,
      size: component.size,
    }))
  }

  return (
    pack.products?.map((product) => ({
      id: product.id,
      name: product.name,
      image: product.image_url,
      qty: 1,
      color: null,
      size: null,
    })) ?? []
  )
}

function ProductVariantMedia({
  product,
  alt,
  isInStock,
}: {
  product: Product
  alt: string
  isInStock: boolean
}) {
  const slides = useMemo(() => {
    const variantSlides =
      product.variants
        ?.map((variant) => {
          const image = variant.images?.[0]
          if (!image?.url) return null
          return {
            color: variant.color,
            url: image.url,
            alt: image.alt_text || `${product.name} - ${variant.color}`,
          }
        })
        .filter((item): item is { color: string; url: string; alt: string } => Boolean(item)) ?? []

    const uniqueSlides = variantSlides.filter(
      (slide, index, list) => list.findIndex((item) => item.url === slide.url) === index,
    )

    return uniqueSlides.length > 0
      ? uniqueSlides
      : [{ color: "Default", url: getFirstProductImage(product), alt }]
  }, [alt, product])

  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    setActiveIndex(0)
  }, [product.id, slides.length])

  useEffect(() => {
    if (slides.length <= 1) return

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length)
    }, 2200)

    return () => window.clearInterval(timer)
  }, [slides.length])

  const activeSlide = slides[activeIndex] ?? slides[0]

  return (
    <div className="aspect-[3/4] relative overflow-hidden bg-gray-900">
      {slides.map((slide, index) => (
        <Image
          key={`${slide.url}-${slide.color}`}
          src={slide.url || "/placeholder.svg"}
          alt={slide.alt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className={`object-cover transition-all duration-700 group-hover:scale-105 ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {slides.length > 1 && (
        <>
          <div className="absolute bottom-3 left-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {activeSlide.color}
          </div>
          <div className="absolute bottom-3 right-3 flex gap-1.5 rounded-full bg-black/55 p-1.5 backdrop-blur">
            {slides.map((slide, index) => (
              <button
                key={`${slide.color}-${index}`}
                type="button"
                aria-label={`Show ${slide.color}`}
                onClick={(event) => {
                  event.preventDefault()
                  setActiveIndex(index)
                }}
                className={`h-4 w-4 rounded-full border transition-transform ${
                  index === activeIndex ? "scale-110 border-gold" : "border-white/40"
                }`}
                style={{ backgroundColor: getColorSwatch(slide.color) }}
              />
            ))}
          </div>
        </>
      )}

      {!isInStock && (
        <div className="absolute top-4 left-4">
          <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
            Out of stock
          </span>
        </div>
      )}
    </div>
  )
}

export default function FeaturedProducts() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const [products, setProducts] = useState<Product[]>([])
  const [productLookup, setProductLookup] = useState<Record<string, Product>>({})
  const [packs, setPacks] = useState<Pack[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const { addToCart } = useCart()

  // Wishlist state
  const [userWishlist, setUserWishlist] = useState<WishlistItem[]>([])
  const [isWishlistLoading, setIsWishlistLoading] = useState(true)

  const fetchProducts = useCallback(async () => {
    try {
      const [productsData, packsData] = await Promise.all([
        api.getProducts(0, 8),
        api.getPacks(0, 3).catch(() => [] as Pack[]),
      ])
      const productMap = productsData.reduce<Record<string, Product>>((map, product) => {
        map[product.id] = product
        return map
      }, {})
      const missingPackProductIds = Array.from(
        new Set(
          packsData
            .flatMap((pack) => pack.components?.map((component) => component.product_id) ?? [])
            .filter((productId) => !productMap[productId]),
        ),
      )
      const missingProducts = await Promise.all(
        missingPackProductIds.map((productId) => api.getProduct(productId).catch(() => null)),
      )
      missingProducts.forEach((product) => {
        if (product) productMap[product.id] = product
      })

      setProducts(productsData)
      setProductLookup(productMap)
      setPacks([...packsData].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)))
    } catch (error) {
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
    if (!isProductInStock(product)) return

    const selection = getFirstAvailableVariantSelection(product)
    if (selection) {
      addToCart(product, selection.variant, selection.size.size, 1)
    }
  }

  if (loading || authLoading) {
    return (
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
            <p className="text-gray-400">Loading products...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-gray-950 py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.22em] text-gold">Shop Savage Rise</p>
            <h2 className="font-playfair text-4xl font-bold md:text-5xl">Choose the piece, color, size or pack.</h2>
            <p className="mt-4 text-base leading-7 text-gray-400 md:text-lg">
              Browse active packs and signature products from the first page. Each product card shows available variants
              so customers know what they can choose before opening the product.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:shrink-0">
            <Button asChild className="bg-gold text-black hover:bg-gold/90">
              <Link href="/packs">
                View packs
                <Package className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white hover:text-black">
              <Link href="/products">
                Full collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {packs.length > 0 && (
          <div className="mb-16">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h3 className="text-xl font-semibold text-white">Active packs</h3>
              <Link href="/packs" className="text-sm font-semibold text-gold transition-colors hover:text-white">
                See all packs
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {packs.map((pack) => {
                const previewItems = getPackPreviewItems(pack, productLookup)

                return (
                  <Link
                    key={pack.id}
                    href={`/packs/${pack.id}`}
                    className="group grid overflow-hidden rounded-lg border border-gold/20 bg-black transition-colors hover:border-gold/70 sm:grid-cols-[180px_minmax(0,1fr)] md:block"
                  >
                    <div
                      className={`relative grid aspect-[4/3] min-h-[170px] overflow-hidden bg-gray-900 ${
                        previewItems.length > 1 ? "grid-cols-2" : "grid-cols-1"
                      }`}
                    >
                      {(previewItems.length > 0 ? previewItems : [{ id: pack.id, name: pack.title, image: pack.image_url, qty: 1, color: null, size: null }])
                        .slice(0, 4)
                        .map((item, index) => (
                          <div key={`${item.id}-${index}`} className="relative min-h-[170px] overflow-hidden">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/10" />
                            {(item.color || item.qty > 1) && (
                              <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                                {item.color && (
                                  <span
                                    className="h-3 w-3 rounded-full border border-white/40"
                                    style={{ backgroundColor: getColorSwatch(item.color) }}
                                  />
                                )}
                                <span>{item.color || item.name}</span>
                                {item.qty > 1 && <span className="text-gold">x{item.qty}</span>}
                              </div>
                            )}
                          </div>
                        ))}
                      <div className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-black">
                        {getDiscountLabel(pack)}
                      </div>
                      {previewItems.length > 4 && (
                        <div className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                          +{previewItems.length - 4}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-between gap-4 p-5">
                      <div>
                        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-gold">Pack</p>
                        <h4 className="text-lg font-semibold transition-colors group-hover:text-gold">{pack.title}</h4>
                        {pack.description && <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-400">{pack.description}</p>}
                      </div>
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <p className="text-sm text-gray-500 line-through">{formatPrice(pack.original_price ?? 0)}</p>
                          <p className="text-xl font-bold text-gold">{formatPrice(pack.pack_price ?? 0)}</p>
                        </div>
                        <span className="text-sm font-semibold text-white transition-colors group-hover:text-gold">Configure</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        <div className="mb-5 flex items-center justify-between gap-4">
          <h3 className="text-xl font-semibold text-white">Featured products</h3>
          <Link href="/products" className="text-sm font-semibold text-gold transition-colors hover:text-white">
            Browse all
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => {
            const productInStock = isProductInStock(product)
            const imageAlt = getProductImageAlt(product)
            const colors = product.variants?.map((variant) => variant.color) ?? []
            const relatedPack = findRelatedPack(product.id, packs)
            const sizes = Array.from(
              new Set(
                product.variants?.flatMap((variant) =>
                  variant.sizes.filter((size) => size.stock > 0).map((size) => size.size),
                ) ?? [],
              ),
            )

            return (
              <div
                key={product.id}
                className="group relative overflow-hidden rounded-lg border border-white/10 bg-black transition-colors hover:border-gold/40"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <Link href={`/products/${product.id}`}>
                  <ProductVariantMedia product={product} alt={imageAlt} isInStock={productInStock} />
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

                  <div className="space-y-4 p-5">
                    <Link href={`/products/${product.id}`}>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-gold transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
                      )}
                      <p className="text-gold text-lg font-bold">{formatPrice(product.price)}</p>
                    </Link>

                    {relatedPack && (
                      <div onClick={(event) => event.preventDefault()}>
                        <ProductSetBadge pack={relatedPack} />
                      </div>
                    )}

                    <div className="space-y-3 border-t border-white/10 pt-4">
                    {colors.length > 0 && (
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs uppercase tracking-[0.16em] text-gray-500">Colors</span>
                        <div className="flex flex-wrap justify-end gap-1.5">
                          {colors.slice(0, 5).map((color) => (
                            <span
                              key={color}
                              title={color}
                              className="h-5 w-5 rounded-full border border-white/30"
                              style={{ backgroundColor: getColorSwatch(color) }}
                            />
                          ))}
                          {colors.length > 5 && <span className="text-xs text-gray-400">+{colors.length - 5}</span>}
                        </div>
                      </div>
                    )}

                    {sizes.length > 0 && (
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs uppercase tracking-[0.16em] text-gray-500">Sizes</span>
                        <div className="flex flex-wrap justify-end gap-1.5">
                          {sizes.slice(0, 6).map((size) => (
                            <span key={size} className="min-w-7 rounded border border-white/15 px-2 py-1 text-center text-xs text-gray-200">
                              {size}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button asChild className="w-full bg-white text-black hover:bg-gold">
                      <Link href={`/products/${product.id}`}>Choose size</Link>
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-12 grid gap-4 rounded-lg border border-white/10 bg-black p-5 text-sm text-gray-300 sm:grid-cols-3">
          <div>
            <p className="font-semibold text-white">1. Pick your product</p>
            <p className="mt-1 text-gray-500">Open the piece and choose color and size.</p>
          </div>
          <div>
            <p className="font-semibold text-white">2. Configure a pack</p>
            <p className="mt-1 text-gray-500">Select one common size or separate sizes per item.</p>
          </div>
          <div>
            <p className="font-semibold text-white">3. Checkout clearly</p>
            <p className="mt-1 text-gray-500">Products and packs stay visible in cart and order summary.</p>
          </div>
        </div>
      </div>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} defaultTab="login" />
    </section>
  )
}
