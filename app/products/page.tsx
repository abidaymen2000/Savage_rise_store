"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingBag, Search, Filter } from "lucide-react"
import { api } from "@/lib/api"
import ProductSetBadge from "@/components/ProductSetBadge"
import { getColorSwatch } from "@/lib/color-swatches"
import { useCart } from "@/contexts/CartContext"
import type { Pack, Product } from "@/types/api"
import { getFirstAvailableVariantSelection } from "@/lib/meta-content"
import { findRelatedPack } from "@/lib/pack-offers"
import { isActiveBundlePack, isShopProduct, SHOP_PRODUCT_KIND } from "@/lib/product-kind"
import { getAvailableSizes, getFirstProductImage, getProductImageAlt, isProductInStock, formatPrice, sortProductsByStockStatus } from "@/lib/utils"
import WishlistButton from "@/components/WishlistButton"
import { trackMetaPixelEvent } from "@/lib/meta-pixel"
import { trackStoreEvent } from "@/lib/store-analytics"

function getProductColorOptions(product: Product): Array<{ label: string; swatch: string }> {
  const seen = new Set<string>()
  return (product.variants ?? []).reduce<Array<{ label: string; swatch: string }>>((options, variant) => {
    const label = variant.option_values?.color ?? variant.color
    const key = label.trim().toLowerCase()
    if (!label || seen.has(key)) return options
    seen.add(key)
    options.push({
      label,
      swatch: getColorSwatch(variant.color_code ?? label),
    })
    return options
  }, [])
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
            swatch: getColorSwatch(variant.color_code ?? variant.color),
            url: image.url,
            alt: image.alt_text || `${product.name} - ${variant.color}`,
          }
        })
        .filter((item): item is { color: string; swatch: string; url: string; alt: string } => Boolean(item)) ?? []

    const uniqueSlides = variantSlides.filter(
      (slide, index, list) => list.findIndex((item) => item.url === slide.url) === index,
    )

    return uniqueSlides.length > 0
      ? uniqueSlides
      : [{ color: "Default", swatch: getColorSwatch("Default"), url: getFirstProductImage(product), alt }]
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
    <div className="relative aspect-[3/4] overflow-hidden bg-gray-900">
      {slides.map((slide, index) => (
        <Image
          key={`${slide.url}-${slide.color}`}
          src={slide.url || "/placeholder.svg"}
          alt={slide.alt}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
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
                style={{ backgroundColor: slide.swatch }}
              />
            ))}
          </div>
        </>
      )}

      {!isInStock && (
        <div className="absolute left-4 top-4">
          <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
            Out of stock
          </span>
        </div>
      )}
    </div>
  )
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [packs, setPacks] = useState<Pack[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [genderFilter, setGenderFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const { addToCart } = useCart()

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [productsData, packsData] = await Promise.all([
        api.getProducts(0, 50, { productKind: SHOP_PRODUCT_KIND }),
        api.getPacks(0, 50).catch(() => [] as Pack[]),
      ])
      setProducts(productsData.filter(isShopProduct))
      setPacks(packsData.filter(isActiveBundlePack))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error loading products"
      setError(errorMessage)
      // Don't show error if we have fallback data
      if (errorMessage.includes("Network error")) {
        setError(null)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    trackStoreEvent("collection_viewed", {
      metadata: {
        collection: "products",
        gender: genderFilter,
      },
    })
  }, [genderFilter])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setGenderFilter(params.get("gender") || "all")
  }, [])

  const filteredAndSortedProducts = useMemo(
    () =>
      sortProductsByStockStatus(
        products
          .filter(
            (product) =>
              (genderFilter === "all" || product.gender === genderFilter) &&
              (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchTerm.toLowerCase())),
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
          }),
      ),
    [genderFilter, products, searchTerm, sortBy],
  )

  useEffect(() => {
    const query = searchTerm.trim()
    if (query.length < 2) return

    const timeout = window.setTimeout(() => {
      trackMetaPixelEvent("Search", {
        search_string: query,
        content_type: "product",
      })
      trackStoreEvent("search_submitted", {
        metadata: {
          query,
          result_count: filteredAndSortedProducts.length,
        },
      })
    }, 700)

    return () => window.clearTimeout(timeout)
  }, [filteredAndSortedProducts.length, searchTerm])

  const handleAddToCart = (product: Product) => {
    if (!isProductInStock(product)) return

    const selection = getFirstAvailableVariantSelection(product)
    if (selection) {
      addToCart(product, selection.variant, selection.size.size, 1)
    }
  }

  if (loading) {
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
              const imageAlt = getProductImageAlt(product)
              const relatedPack = findRelatedPack(product.id, packs)
              const colors = getProductColorOptions(product)
              const sizes = getAvailableSizes(product)

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
                                key={color.label}
                                title={color.label}
                                className="h-5 w-5 rounded-full border border-white/30"
                                style={{ backgroundColor: color.swatch }}
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
        )}
      </div>
    </div>
  )
}
