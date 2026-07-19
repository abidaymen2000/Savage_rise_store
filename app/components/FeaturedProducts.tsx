"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Package, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductSetBadge from "@/components/ProductSetBadge"
import WishlistButton from "@/components/WishlistButton"
import { useCart } from "@/contexts/CartContext"
import { api } from "@/lib/api"
import { getBundleColorOptions, getBundlePreviewItems } from "@/lib/bundle-media"
import { getColorSwatch } from "@/lib/color-swatches"
import { getActiveBundles, getFeaturedPhysicalProducts } from "@/lib/home-products"
import { getFirstAvailableVariantSelection } from "@/lib/meta-content"
import { findRelatedPack } from "@/lib/pack-offers"
import {
  formatPrice,
  getAvailableColors,
  getFirstProductImage,
  getProductImageAlt,
  isProductInStock,
  sortProductsByStockStatus,
} from "@/lib/utils"
import type { Pack, Product } from "@/types/api"

function getPackSavings(pack: Pack) {
  if ((pack.savings_value ?? 0) > 0) return pack.savings_value ?? 0
  if (typeof pack.original_price !== "number" || typeof pack.pack_price !== "number") return 0
  return Math.max(0, pack.original_price - pack.pack_price)
}

function getDiscountLabel(pack: Pack) {
  const savings = getPackSavings(pack)
  return savings > 0 ? `${formatPrice(savings)} off` : null
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

      {slides.length > 1 && activeSlide.color && (
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
          <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">Out of stock</span>
        </div>
      )}
    </div>
  )
}

function ActivePackCard({ pack, productLookup }: { pack: Pack; productLookup: Record<string, Product> }) {
  const colorOptions = useMemo(() => getBundleColorOptions(pack, productLookup), [pack, productLookup])
  const [selectedColor, setSelectedColor] = useState("")

  useEffect(() => {
    if (colorOptions.length === 0) {
      setSelectedColor("")
      return
    }

    const hasSelectedColor = colorOptions.some(
      (color) => color.trim().toLowerCase() === selectedColor.trim().toLowerCase(),
    )
    if (!selectedColor || !hasSelectedColor) {
      setSelectedColor(colorOptions[0])
    }
  }, [colorOptions, selectedColor])

  const activeColor = selectedColor || colorOptions[0] || null
  const previewItems = getBundlePreviewItems(pack, productLookup, activeColor)
  const visualItems = previewItems.length > 0 ? previewItems : [{ id: pack.id, name: pack.title, image: pack.image_url, qty: 1 }]
  const discountLabel = getDiscountLabel(pack)
  const savings = getPackSavings(pack)
  const hasOriginalPrice =
    typeof pack.original_price === "number" &&
    typeof pack.pack_price === "number" &&
    pack.original_price > pack.pack_price

  return (
    <article className="group overflow-hidden rounded-lg border border-gold/20 bg-black transition-colors hover:border-gold/70">
      <div className="grid min-h-[340px] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <Link href={`/packs/${pack.id}`} className="relative block min-h-[280px] overflow-hidden bg-gray-900 sm:min-h-[340px]">
          <div className={`absolute inset-0 grid ${visualItems.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
            {visualItems.slice(0, 4).map((item, index) => (
              <div key={`${item.id}-${index}`} className="relative min-h-[280px] overflow-hidden sm:min-h-[340px]">
                <Image
                  src={item.image || pack.image_url || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10" />
              </div>
            ))}
          </div>

          {discountLabel && (
            <div className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-black">
              {discountLabel}
            </div>
          )}
        </Link>

        <div className="flex flex-col justify-between gap-8 p-5 sm:p-8 lg:p-10">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-black">
                PACK
              </span>
              {activeColor && (
                <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-white">
                  Same-color set
                </span>
              )}
            </div>

            <Link href={`/packs/${pack.id}`}>
              <h4 className="font-playfair text-3xl font-bold leading-tight text-white transition-colors group-hover:text-gold sm:text-4xl">
                {pack.title}
              </h4>
            </Link>
            {pack.description && <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-400 sm:text-base">{pack.description}</p>}

            {colorOptions.length > 0 && (
              <div className="mt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Colors</p>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => {
                    const isSelected = color.trim().toLowerCase() === activeColor?.trim().toLowerCase()
                    return (
                      <button
                        key={color}
                        type="button"
                        aria-label={`Show ${color} pack`}
                        onClick={() => setSelectedColor(color)}
                        className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${
                          isSelected ? "border-gold text-gold" : "border-white/15 text-white hover:border-white/40"
                        }`}
                      >
                        <span
                          className="h-4 w-4 rounded-full border border-white/30"
                          style={{ backgroundColor: getColorSwatch(color) }}
                        />
                        {color}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              {hasOriginalPrice && <p className="text-sm text-gray-500 line-through">{formatPrice(pack.original_price ?? 0)}</p>}
              <p className="text-3xl font-bold text-gold">{formatPrice(pack.pack_price ?? 0)}</p>
              {savings > 0 && <p className="mt-1 text-sm font-semibold text-emerald-300">Save {formatPrice(savings)}</p>}
            </div>
            <Button asChild className="w-full bg-gold text-black hover:bg-gold/90 sm:w-auto">
              <Link href={`/packs/${pack.id}`}>Composer le pack</Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [productLookup, setProductLookup] = useState<Record<string, Product>>({})
  const [packs, setPacks] = useState<Pack[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const { addToCart } = useCart()

  const fetchProducts = useCallback(async () => {
    try {
      const [productsData, packsData] = await Promise.all([
        api.getProducts(0, 8),
        api.getPacks(0, 3).catch(() => [] as Pack[]),
      ])
      const activeBundles = getActiveBundles(packsData)
      const featuredPhysicalProducts = getFeaturedPhysicalProducts(productsData, activeBundles)
      const productMap = featuredPhysicalProducts.reduce<Record<string, Product>>((map, product) => {
        map[product.id] = product
        return map
      }, {})
      const missingPackProductIds = Array.from(
        new Set(
          activeBundles
            .flatMap((pack) => {
              const bundleComponentIds =
                pack.bundle_definition?.components?.map((component) => component.product_id) ?? []
              const legacyComponentIds = pack.components?.map((component) => component.product_id) ?? []
              return [...bundleComponentIds, ...legacyComponentIds]
            })
            .filter((productId) => productId && !productMap[productId]),
        ),
      )
      const missingProducts = await Promise.all(
        missingPackProductIds.map((productId) => api.getProduct(productId).catch(() => null)),
      )
      missingProducts.forEach((product) => {
        if (product) productMap[product.id] = product
      })

      setProducts(sortProductsByStockStatus(featuredPhysicalProducts))
      setProductLookup(productMap)
      setPacks([...activeBundles].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)))
    } catch (error) {
      // Keep the section non-blocking when the catalog is temporarily unavailable.
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleAddToCart = (product: Product) => {
    if (!isProductInStock(product)) return

    const selection = getFirstAvailableVariantSelection(product)
    if (selection) {
      addToCart(product, selection.variant, selection.size.size, 1)
    }
  }

  if (loading) {
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
            <div className="space-y-6">
              {packs.map((pack) => (
                <ActivePackCard key={pack.id} pack={pack} productLookup={productLookup} />
              ))}
            </div>
          </div>
        )}

        <div className="mb-5 flex items-center justify-between gap-4">
          <h3 className="text-xl font-semibold text-white">Featured products</h3>
          <Link href="/products" className="text-sm font-semibold text-gold transition-colors hover:text-white">
            Browse all
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-black p-8 text-center text-sm text-gray-400">
            No featured products available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => {
              const productInStock = isProductInStock(product)
              const imageAlt = getProductImageAlt(product)
              const colors = getAvailableColors(product)
              const relatedPack = findRelatedPack(product.id, packs)

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
                      <h3 className="mb-2 line-clamp-2 text-xl font-semibold transition-colors group-hover:text-gold">
                        {product.name}
                      </h3>
                      {product.description && <p className="mb-3 line-clamp-2 text-sm text-gray-400">{product.description}</p>}
                      <p className="text-lg font-bold text-gold">{formatPrice(product.price)}</p>
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

                      <Button asChild className="w-full bg-white text-black hover:bg-gold">
                        <Link href={`/products/${product.id}`}>Choose product</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

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
    </section>
  )
}
