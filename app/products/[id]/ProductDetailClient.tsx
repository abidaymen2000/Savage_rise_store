"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ShoppingBag, Truck, Shield, RotateCcw } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import type { Pack, Product, Variant } from "@/types/api"
import { getAvailableStock, getProductVariantForSelection, getSelectableQuantityLimit, getVariantSize, isSizePurchasable, isSizeTracked } from "@/lib/inventory"
import { getMetaContentId, getVariantSizeByName } from "@/lib/meta-content"
import {
  buildPackSelections,
  findCompanionComponents,
  getAvailableSizesForColor,
  getPackPrice,
  getPackSavingsLabel,
  getProductColorOptions,
  getProductImageForColor,
} from "@/lib/pack-offers"
import { getAvailableColors, getAvailableSizes, getStockForSize, isProductInStock, formatPrice } from "@/lib/utils"
import WishlistButton from "@/components/WishlistButton"
import { getCurrentPageViewId } from "@/lib/analytics-context"
import { trackMetaPixelEvent } from "@/lib/meta-pixel"
import { trackStoreEvent } from "@/lib/store-analytics"
import { useStoreConfig } from "@/contexts/StoreConfigContext"
import { isFeatureEnabled } from "@/lib/store-config-shared"

const ProductReviewSection = dynamic(() => import("@/components/ProductReviewSection"), {
  loading: () => null,
})

type ProductDetailClientProps = {
  product: Product
  initialRelatedPack: Pack | null
  initialRelatedProducts: Record<string, Product>
}

function getInitialSelection(product: Product) {
  const variant =
    product.variants.find((item) => item.sizes.some((size) => isSizePurchasable(size))) ??
    product.variants[0] ??
    null
  const size = variant?.sizes.find((item) => isSizePurchasable(item)) ?? variant?.sizes[0] ?? null
  return {
    variant,
    color: variant?.color ?? "",
    size: size?.size ?? "",
  }
}

export default function ProductDetailClient({ product, initialRelatedPack, initialRelatedProducts }: ProductDetailClientProps) {
  const { config } = useStoreConfig()
  const packsEnabled = isFeatureEnabled(config, "packs", true)
  const wishlistEnabled = isFeatureEnabled(config, "wishlist", true)
  const reviewsEnabled = isFeatureEnabled(config, "reviews", true)

  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const initialSelection = getInitialSelection(product)
  const [selectedColor, setSelectedColor] = useState<string>(initialSelection.color)
  const [selectedSize, setSelectedSize] = useState<string>(initialSelection.size)
  const [quantity, setQuantity] = useState(1)
  const [currentVariant, setCurrentVariant] = useState<Variant | null>(initialSelection.variant)
  const relatedPack = packsEnabled ? initialRelatedPack : null
  const relatedProducts = initialRelatedProducts
  const [relatedPackSizes, setRelatedPackSizes] = useState<Record<string, string>>({})
  const { addToCart, addPackToCart } = useCart()

  useEffect(() => {
    const nextSelection = getInitialSelection(product)
    setSelectedColor(nextSelection.color)
    setCurrentVariant(nextSelection.variant)
    setSelectedSize(nextSelection.size)
  }, [product])

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

  useEffect(() => {
    if (!product || !selectedColor) return
    const variantsForColor = product.variants.filter((variant) => variant.color === selectedColor)
    const sizesForColor = variantsForColor.flatMap((variant) => variant.sizes)
    if (sizesForColor.length === 0) return
    if (sizesForColor.some((size) => size.size === selectedSize)) return
    const firstAvailableSize = sizesForColor.find((size) => isSizePurchasable(size))
    setSelectedSize((firstAvailableSize ?? sizesForColor[0])?.size ?? "")
  }, [product, selectedColor, selectedSize])

  useEffect(() => {
    if (!product || !selectedColor) {
      setCurrentVariant(null)
      return
    }
    setCurrentVariant(getProductVariantForSelection(product, selectedColor, selectedSize))
    setSelectedImageIndex(0)
  }, [product, selectedColor, selectedSize])

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
  const availableSizes = product ? getAvailableSizes(product, selectedColor) : []
  const currentStock =
    productInStock && product && selectedColor && selectedSize ? getStockForSize(product, selectedColor, selectedSize) : 0
  const selectedVariantSize = getVariantSize(currentVariant, selectedSize)
  const selectedSizeTracked = isSizeTracked(selectedVariantSize)
  const quantityLimit = getSelectableQuantityLimit(selectedVariantSize)
  const currentSelectionInStock = Boolean(selectedVariantSize && isSizePurchasable(selectedVariantSize))
  const canAddCurrentSelection =
    Boolean(productInStock && currentVariant && selectedSize && currentSelectionInStock) &&
    quantity <= quantityLimit
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

  useEffect(() => {
    if (quantity > quantityLimit) setQuantity(1)
  }, [quantity, quantityLimit])

  // Get current images to display
  const currentImages = currentVariant?.images?.length ? currentVariant.images : product.images || []
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

  return (
    <div className="min-h-screen bg-background pt-20 text-foreground">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <Link href="/products" className="flex items-center text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour boutique
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-[4/5] relative overflow-hidden rounded-none bg-muted">
              <Image
                src={displayImages[selectedImageIndex]?.url || "/placeholder.svg?height=600&width=600"}
                alt={displayImages[selectedImageIndex]?.alt_text || product.name}
                fill
                className="object-contain"
              />
            </div>

            {displayImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {displayImages.map((image, index) => (
                  <button
                    key={image.id || index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square relative overflow-hidden rounded-none border border-border ${
                      selectedImageIndex === index ? "ring-2 ring-gold" : ""
                    }`}
                  >
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={image.alt_text || `${product.name} ${index + 1}`}
                      fill
                      className="object-contain"
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
              <p className="mb-4 text-xl text-muted-foreground">{product.full_name}</p>
              <p className="text-3xl font-bold text-gold">{formatPrice(product.price, config)}</p>
            </div>

            {/* Stock Status */}
            <div>
              {currentSelectionInStock ? (
                <Badge className="bg-green-600 text-white">
                  {selectedSizeTracked ? `En stock — ${currentStock} disponibles` : "Disponible"}
                </Badge>
              ) : (
                <Badge className="bg-red-600 text-white">Hors stock</Badge>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="leading-relaxed text-muted-foreground">{product.description}</p>
              </div>
            )}

            {/* Color Selection */}
            {availableColors.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Couleur</h3>
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
                  <SelectTrigger className="border-border bg-card text-card-foreground">
                    <SelectValue placeholder="Choisir une couleur" />
                  </SelectTrigger>
                  <SelectContent className="border-border bg-popover text-popover-foreground">
                    {availableColors.map((color) => (
                      <SelectItem key={color} value={color}>
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
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold">Taille</h3>
                  <Link href="/size-guide" className="text-sm font-semibold text-accent hover:text-foreground">Guide des tailles</Link>
                </div>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                  {availableSizes.map((size) => {
                    const optionVariant = getProductVariantForSelection(product, selectedColor, size)
                    const optionSize = getVariantSize(optionVariant, size)
                    const purchasable = isSizePurchasable(optionSize)
                    const stock = getAvailableStock(optionSize)
                    const selected = selectedSize === size
                    return (
                      <button
                        key={size}
                        type="button"
                        disabled={!purchasable}
                        onClick={() => {
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
                        className={`min-h-11 border px-3 py-2 text-sm font-semibold transition-colors ${
                          selected
                            ? "border-accent bg-accent text-accent-foreground"
                            : purchasable
                              ? "border-border bg-card text-card-foreground hover:border-foreground"
                              : "cursor-not-allowed border-border bg-muted text-muted-foreground line-through opacity-55"
                        }`}
                        aria-pressed={selected}
                      >
                        {size}
                        {!purchasable ? <span className="sr-only"> epuise</span> : isSizeTracked(optionSize) && stock < 5 ? <span className="sr-only"> stock limite</span> : null}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            {selectedVariantSize && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Quantite</h3>
              <Select value={quantity.toString()} onValueChange={(value) => setQuantity(Number.parseInt(value))} disabled={quantityLimit === 0}>
                <SelectTrigger className="w-24 border-border bg-card text-card-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-border bg-popover text-popover-foreground">
                  {Array.from({ length: quantityLimit }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
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
                className="w-full flex-1 bg-accent px-4 py-3 font-semibold leading-snug text-accent-foreground hover:bg-accent/90 whitespace-normal text-center"
              >
                <ShoppingBag className="mr-2 h-5 w-5 shrink-0" />
                {canAddCurrentSelection ? `Ajouter au panier - ${formatPrice(product.price * quantity, config)}` : selectedSize ? "Epuise" : "Choisir une taille"}
              </Button>
              {wishlistEnabled && <WishlistButton productId={product.id} className="h-12 w-full min-[400px]:w-12 shrink-0" />}
            </div>

            {packsEnabled && relatedPack && companionComponents.length > 0 && (
              <div className="rounded-2xl border border-accent/25 bg-card p-5 text-card-foreground dark:bg-gradient-to-br dark:from-gold/10 dark:via-black dark:to-black">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Completer le look</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={displayImages[0]?.url || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-contain"
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
                        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted">
                          <Image
                            src={getProductImageForColor(companionProduct, companionColor)}
                            alt={companionProduct.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-card-foreground">{companionProduct.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {sameColorAvailable ? `Couleur coordonnee : ${selectedColor}` : `Couleur du set : ${companionColor}`}
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
                            <SelectTrigger className="border-border bg-card text-card-foreground">
                              <SelectValue placeholder="Choose matching size" />
                            </SelectTrigger>
                            <SelectContent className="border-border bg-popover text-popover-foreground">
                              {companionSizes.map((size) => (
                                <SelectItem key={size} value={size}>
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

                <div className="mt-5 rounded-xl border border-border bg-muted p-4 dark:border-white/10 dark:bg-black/50">
                  <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">{relatedPack.title}</p>
                          <p className="mt-2 text-sm text-muted-foreground">Commande la piece seule ou complete le set lorsque le pack est disponible.</p>
                  <div className="mt-4 flex flex-wrap items-end gap-4">
                    <div>
                        <p className="text-sm text-muted-foreground line-through">
                          {formatPrice((relatedPack.original_price ?? product.price) * quantity, config)}
                        </p>
                      <p className="text-3xl font-bold text-gold">{formatPrice(getPackPrice(relatedPack) * quantity, config)}</p>
                    </div>
                    <p className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-sm font-medium text-green-700 dark:text-green-300">
                      Economise {formatPrice(getPackSavingsLabel(relatedPack) * quantity, config)}
                    </p>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">Set coordonne. Choisis la taille de chaque piece separement.</p>
                </div>

                <Button
                  onClick={handleAddRelatedPack}
                  disabled={!canAddCurrentSelection || !completeLookReady}
                  className="mt-5 w-full bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  Ajouter le pack - {formatPrice(getPackPrice(relatedPack) * quantity, config)}
                </Button>
              </div>
            )}

            {/* Product Details */}
            <Separator className="bg-border" />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Details produit</h3>

              {product.fabric && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Matiere :</span>
                  <span>{product.fabric}</span>
                </div>
              )}

              {product.composition && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Composition :</span>
                  <span>
                    {Object.entries(product.composition)
                      .map(([material, percentage]) => `${material} ${percentage}%`)
                      .join(", ")}
                  </span>
                </div>
              )}

              {product.care_instructions && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Entretien :</span>
                  <span>{product.care_instructions}</span>
                </div>
              )}

              {product.sku && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SKU:</span>
                  <span>{product.sku}</span>
                </div>
              )}
            </div>

            {/* Services */}
            <Separator className="bg-border" />

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-gold" />
                <span>Livraison dans toute la Tunisie</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-gold" />
                <span>Echange de taille disponible selon disponibilite</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-gold" />
                <span>Paiement a la livraison</span>
              </div>
            </div>

            {/* Product Review Section */}
            {reviewsEnabled && <ProductReviewSection productId={product.id} />}
          </div>
        </div>
      </div>
    </div>
  )
}
