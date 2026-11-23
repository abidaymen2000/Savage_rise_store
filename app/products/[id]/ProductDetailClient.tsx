"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ShoppingBag, Truck, Shield, RotateCcw, Minus, Plus, Maximize2, Ruler, Zap } from "lucide-react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { getColorSwatch } from "@/lib/color-swatches"
import { useCart } from "@/contexts/CartContext"
import type { Pack, Product, Variant } from "@/types/api"
import { availabilityStatus, availabilityLabel, hasLowStock, isSoldOut } from "@/lib/availability"
import { getProductAvailability, getProductVariantForSelection, getSelectableQuantityLimit, getVariantSize, isSizePurchasable } from "@/lib/inventory"
import { buildMetaProductContent, metaProductId } from "@/lib/meta-content"
import {
  buildPackSelections,
  findCompanionComponents,
  getAvailableSizesForColor,
  getPackPrice,
  getPackSavingsLabel,
  getProductColorOptions,
  getProductImageForColor,
} from "@/lib/pack-offers"
import { getAvailableColors, getAvailableSizes, isProductInStock, formatPrice } from "@/lib/utils"
import { getProductImagesForColor, getProductColorGalleries } from "@/lib/product-color-media"
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
  const [galleryOpen, setGalleryOpen] = useState(false)
  const initialSelection = getInitialSelection(product)
  const [selectedColor, setSelectedColor] = useState<string>(initialSelection.color)
  const [selectedSize, setSelectedSize] = useState<string>(initialSelection.size)
  const [quantity, setQuantity] = useState(1)
  const [currentVariant, setCurrentVariant] = useState<Variant | null>(initialSelection.variant)
  const relatedPack = packsEnabled ? initialRelatedPack : null
  const relatedProducts = initialRelatedProducts
  const [relatedPackSizes, setRelatedPackSizes] = useState<Record<string, string>>({})
  const { addToCart, addPackToCart, buyNow } = useCart()
  const [purchaseError, setPurchaseError] = useState<string | null>(null)
  const restoredPurchase = useRef(false)

  useEffect(() => {
    const nextSelection = getInitialSelection(product)
    setSelectedColor(nextSelection.color)
    setCurrentVariant(nextSelection.variant)
    setSelectedSize(nextSelection.size)
  }, [product])

  useEffect(() => {
    if (!product) return
    const pageViewId = getCurrentPageViewId()
    const analyticsEvent = trackStoreEvent("product_view", {
      product_id: product.id,
      variant_id: currentVariant?.meta_content_id ?? null,
      currency: "TND",
      value: product.price,
      deduplication_key: `product_view:${pageViewId ?? "no_page"}:${product.id}:${currentVariant?.color ?? "none"}:${selectedSize || "none"}`,
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
      content_ids: [metaProductId(product.id)],
      content_name: product.name,
      content_type: "product_group",
      contents: [
        buildMetaProductContent(product),
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
  }, [product, selectedColor, selectedSize])

  useEffect(() => { setSelectedImageIndex(0) }, [product, selectedColor])

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

  useEffect(() => {
    if (restoredPurchase.current) return
    const query = new URLSearchParams(window.location.search)
    const id = query.get("variant")
    if (!id) { restoredPurchase.current = true; return }
    const variant = product.variants.find(v => v.id === id || v.sizes.some(size => size.variant_item_id === id))
    const size = variant?.sizes.find(size => size.variant_item_id === id) ?? variant?.sizes[0]
    if (!variant || !size) { restoredPurchase.current = true; return }
    if (selectedColor !== variant.color || selectedSize !== size.size) {setSelectedColor(variant.color); setSelectedSize(size.size); return}
    setQuantity(Math.max(1, Math.min(99, Number(query.get("qty")) || 1)))
    restoredPurchase.current = true
  }, [product, selectedColor, selectedSize])

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
  const selectedVariantSize = getVariantSize(currentVariant, selectedSize)
  const productAvailability = getProductAvailability(product)
  const selectionAvailability = productAvailability === "available" ? availabilityStatus(selectedVariantSize) : productAvailability
  const stockDisplayStatus = isSoldOut(selectionAvailability) ? "sold-out" : selectionAvailability === "available" ? hasLowStock(selectedVariantSize) ? "low-stock" : "in-stock" : "unavailable"
  const quantityLimit = getSelectableQuantityLimit(selectedVariantSize)
  const currentSelectionInStock = selectionAvailability === "available"
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
  const currentImages = useMemo(() => getProductImagesForColor(product, selectedColor), [product, selectedColor])
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
    <main className="store-product-detail min-h-screen bg-background text-foreground">
      <div className="store-detail-container">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <Link href="/products" className="flex items-center text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour boutique
          </Link>
        </div>

        <div className="store-detail-grid">
          {/* Images */}
          <div className="store-gallery">
            <div className="store-gallery-main relative overflow-hidden bg-muted">
              <Image
                src={displayImages[selectedImageIndex]?.url || "/placeholder.svg?height=600&width=600"}
                alt={displayImages[selectedImageIndex]?.alt_text || product.name}
                fill
                className="object-contain"
                sizes="(min-width: 1024px) 42vw, 100vw"
                priority
              />
              {wishlistEnabled && <div className="absolute right-4 top-4"><WishlistButton productId={product.id} className="store-gallery-wishlist h-12 w-12 rounded-full" /></div>}
              <button type="button" className="store-gallery-zoom" aria-label="Agrandir la photo" onClick={() => setGalleryOpen(true)}><Maximize2 aria-hidden="true" size={20} /></button>
            </div>

            {displayImages.length > 1 && (
              <div className="store-gallery-thumbnails" aria-label="Galerie produit">
                {displayImages.map((image, index) => (
                  <button
                    key={image.id || index}
                    type="button"
                    aria-label={`Photo ${index + 1} — ${selectedColor}`}
                    aria-pressed={selectedImageIndex === index}
                    onClick={() => setSelectedImageIndex(index)}
                    className="store-gallery-thumbnail relative overflow-hidden"
                  >
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={image.alt_text || `${product.name} ${index + 1}`}
                      fill
                      className="object-contain"
                      sizes="(min-width: 1024px) 84px, 72px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
            <DialogContent className="max-w-4xl border-border bg-background p-6">
              <DialogTitle>{product.name}</DialogTitle>
              <DialogDescription>{selectedColor} · Photo {selectedImageIndex + 1} / {displayImages.length}</DialogDescription>
              <div className="relative h-[70dvh]"><Image src={displayImages[selectedImageIndex]?.url || "/placeholder.svg"} alt={displayImages[selectedImageIndex]?.alt_text || product.name} fill sizes="90vw" className="object-contain" /></div>
              {displayImages.length > 1 && <div className="flex justify-between gap-3"><Button variant="outline" onClick={() => setSelectedImageIndex(index => (index - 1 + displayImages.length) % displayImages.length)}>Photo précédente</Button><Button variant="outline" onClick={() => setSelectedImageIndex(index => (index + 1) % displayImages.length)}>Photo suivante</Button></div>}
            </DialogContent>
          </Dialog>

          {/* Product Info */}
          <div className="store-product-info space-y-6">
            <div>
              <h1 className="store-detail-title font-playfair" dir="auto">{product.name}</h1>
              {product.full_name !== product.name && <p className="mt-3 text-muted-foreground">{product.full_name}</p>}
            </div>

            {/* Stock Status */}
            <div className="store-detail-price-row">
              <p className="store-detail-price font-playfair">{formatPrice(product.price, config)}</p>
              {stockDisplayStatus === "in-stock" && (
                <Badge className="border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-300">
                  En stock
                </Badge>
              )}
              {stockDisplayStatus === "low-stock" && (
                <Badge className="border-gold/40 bg-gold/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-gold hover:bg-gold/10">
                  Stock faible — bientôt épuisé
                </Badge>
              )}
              {stockDisplayStatus === "sold-out" && (
                <Badge className="border-red-500/30 bg-red-500/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-red-700 hover:bg-red-500/10 dark:text-red-300">
                  Sold out
                </Badge>
              )}
            </div>

            {stockDisplayStatus === "unavailable" && <p role="status" className="text-sm text-muted-foreground">{availabilityLabel(selectionAvailability)}</p>}

            {/* Description */}
            {product.description && (
              <div className="store-detail-description">
                <p className="leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Color Selection */}
            {availableColors.length > 0 && (
              <fieldset className="store-option-group">
                <legend className="store-option-label">Couleur <span className="store-selected-color">{selectedColor}</span></legend>
                <div className="store-color-options">
                  {getProductColorGalleries(product).map(group => (
                    <button key={group.key} type="button" className="store-color-option" aria-label={`Couleur ${group.color}`} aria-pressed={selectedColor === group.color}
                      onClick={() => { setSelectedImageIndex(0); setSelectedColor(group.color); trackStoreEvent("color_selected", { product_id: product.id, metadata: {color: group.color, product_name: product.name} }) }}>
                      <span className="store-color-disc" style={{backgroundColor: getColorSwatch(group.colorCode || group.color)}} />
                      <span>{group.color}</span>
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <div className="store-option-group">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="store-option-label">Taille</h2>
                  <Link href="/size-guide" className="store-size-guide"><Ruler size={17} aria-hidden="true" />Guide des tailles</Link>
                </div>
                <div className="store-size-options">
                  {availableSizes.map((size) => {
                    const optionVariant = getProductVariantForSelection(product, selectedColor, size)
                    const optionSize = getVariantSize(optionVariant, size)
                    const purchasable = isSizePurchasable(optionSize)
                    const lowStock = hasLowStock(optionSize)
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
                        className={`store-size-button min-h-11 border px-3 py-2 text-sm font-semibold transition-colors ${
                          selected && purchasable
                            ? "border-primary bg-primary text-primary-foreground"
                            : purchasable
                              ? "border-border bg-card text-card-foreground hover:border-foreground"
                              : "cursor-not-allowed border-border bg-muted text-muted-foreground line-through opacity-55"
                        }`}
                        aria-pressed={selected}
                      >
                        {size}
                        {!purchasable ? <span className="sr-only"> {availabilityLabel(availabilityStatus(optionSize))}</span> : lowStock ? <span className="sr-only"> stock limite</span> : null}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="store-purchase-actions">
            {/* Quantity */}
            {selectedVariantSize && (
            <div className="store-quantity" role="group" aria-label="Quantité">
              <button type="button" aria-label="Diminuer la quantité" disabled={quantity <= 1 || quantityLimit === 0} onClick={() => setQuantity(value => Math.max(1, value - 1))}><Minus size={16} /></button>
              <output aria-live="polite">{quantity}</output>
              <button type="button" aria-label="Augmenter la quantité" disabled={quantity >= quantityLimit} onClick={() => setQuantity(value => Math.min(quantityLimit, value + 1))}><Plus size={16} /></button>
            </div>
            )}

            {/* Actions */}
              <Button
                onClick={handleAddToCart}
                disabled={!canAddCurrentSelection}
                className="store-add-button min-h-12 w-full bg-primary px-4 py-3 text-primary-foreground whitespace-normal"
              >
                <ShoppingBag className="mr-2 h-5 w-5 shrink-0" />
                {canAddCurrentSelection ? `Ajouter au panier - ${formatPrice(product.price * quantity, config)}` : selectedSize ? availabilityLabel(selectionAvailability) : "Choisir une taille"}
              </Button>
              <Button type="button" variant="outline" disabled={!canAddCurrentSelection} className="store-buy-button min-h-12 w-full border-accent bg-transparent px-4 py-3 text-foreground hover:bg-primary hover:text-primary-foreground whitespace-normal" onClick={() => {try {if (currentVariant && selectedSize) buyNow(product, currentVariant, selectedSize, quantity)} catch (error) {setPurchaseError(error instanceof Error ? error.message : "Achat rapide indisponible.")}}}><Zap className="mr-2 h-4 w-4 text-accent" />Acheter maintenant</Button>
            </div>

            {purchaseError && <p role="alert" className="text-sm text-destructive">{purchaseError}</p>}
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

              {(currentVariant?.sku || product.sku) && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SKU:</span>
                  <span>{currentVariant?.sku || product.sku}</span>
                </div>
              )}
            </div>

            {/* Services */}
            <Separator className="bg-border" />

            <div className="store-product-services">
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
    </main>
  )
}
