"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Check, Loader2, ShoppingBag, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api } from "@/lib/api"
import { getCurrentPageViewId } from "@/lib/analytics-context"
import { getVariantSize, isSizePurchasable } from "@/lib/inventory"
import { formatPrice, getStockForSize, isProductInStock } from "@/lib/utils"
import { useCart } from "@/contexts/CartContext"
import type { Pack, PackComponent, PackOrderComponent, Product } from "@/types/api"
import { trackMetaPixelEvent } from "@/lib/meta-pixel"
import { trackStoreEvent } from "@/lib/store-analytics"

type Selection = {
  color: string
  size: string
}

function getPackImage(pack: Pack) {
  return pack.image_url || pack.products?.[0]?.image_url || "/placeholder.svg"
}

function getProductImage(product?: Product | null, fallback?: string | null) {
  if (fallback) return fallback
  const firstVariant = product?.variants?.[0]
  return firstVariant?.images?.[0]?.url || "/placeholder.svg"
}

function getColorOptions(product?: Product | null) {
  return product?.variants?.map((variant) => variant.color) ?? []
}

function getSizeOptions(product: Product | null | undefined, color: string) {
  if (!product || !isProductInStock(product)) return []
  const variant = product.variants?.find((item) => item.color === color)
  return variant?.sizes.filter((size) => isSizePurchasable(size)).map((size) => size.size) ?? []
}

function getComponentQty(component: PackComponent) {
  return component.qty ?? 1
}

function getEffectiveSize(
  component: PackComponent,
  selection: Selection | undefined,
  sameSizeMode: boolean,
  effectiveSameSize: string,
  commonSizes: string[],
) {
  if (component.size) return component.size
  if (sameSizeMode && commonSizes.length > 0) return effectiveSameSize
  return selection?.size ?? ""
}

export default function PackDetailPage() {
  const params = useParams()
  const packId = params.id as string
  const { addPackToCart } = useCart()

  const [pack, setPack] = useState<Pack | null>(null)
  const [products, setProducts] = useState<Record<string, Product>>({})
  const [selections, setSelections] = useState<Record<string, Selection>>({})
  const [sameSizeMode, setSameSizeMode] = useState(true)
  const [sameSize, setSameSize] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [added, setAdded] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    let isMounted = true

    async function fetchPack() {
      try {
        setLoading(true)
        setError(null)
        const data = await api.getPack(packId)
        const components = data.components ?? []
        const fullProducts = await Promise.all(
          components.map((component) => api.getProduct(component.product_id).catch(() => null)),
        )

        if (!isMounted) return

        const productMap: Record<string, Product> = {}
        fullProducts.forEach((product) => {
          if (product) productMap[product.id] = product
        })

        const unlockedColorSets = components
          .filter((component) => !component.color)
          .map((component) => getColorOptions(productMap[component.product_id]))

        const commonColors =
          unlockedColorSets.length > 0
            ? unlockedColorSets.reduce<string[]>(
                (common, colors) => common.filter((color) => colors.includes(color)),
                unlockedColorSets[0] ?? [],
              )
            : []
        const defaultColor = commonColors[0]

        const initialSelections: Record<string, Selection> = {}
        components.forEach((component) => {
          const product = productMap[component.product_id]
          const color = component.color || defaultColor || product?.variants?.[0]?.color || ""
          const sizes = component.size ? [component.size] : getSizeOptions(product, color)
          initialSelections[component.id] = {
            color,
            size: sizes[0] || "",
          }
        })

        setPack(data)
        setProducts(productMap)
        setSelections(initialSelections)
      } catch (err) {
        if (isMounted) setError("Unable to load this pack.")
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchPack()

    return () => {
      isMounted = false
    }
  }, [packId])

  useEffect(() => {
    if (!pack) return
    const pageViewId = getCurrentPageViewId()
    const analyticsEvent = trackStoreEvent("product_viewed", {
      currency: "TND",
      value: pack.pack_price ?? 0,
      deduplication_key: `product_viewed:${pageViewId ?? "no_page"}:pack:${pack.id}`,
      items: (pack.components ?? []).map((component) => ({
        product_id: component.product_id,
        item_type: "pack_component",
        pack_id: pack.id,
        quantity: component.qty ?? 1,
        unit_price: products[component.product_id]?.price ?? component.product.price,
        line_total: (products[component.product_id]?.price ?? component.product.price) * (component.qty ?? 1),
        currency: "TND",
      })),
      metadata: {
        item_type: "pack",
        pack_id: pack.id,
        pack_title: pack.title,
        value: pack.pack_price ?? 0,
        components: pack.components,
      },
    })
    if (!analyticsEvent.eventId) return

    trackMetaPixelEvent("ViewContent", {
      content_ids: [pack.id],
      content_name: pack.title,
      content_type: "product_group",
      currency: "TND",
      value: pack.pack_price ?? 0,
    }, {
      eventID: analyticsEvent.eventId,
    })
  }, [pack, products])

  const components = pack?.components ?? []

  const commonSizes = useMemo(() => {
    if (components.length === 0) return []
    const sizeSets = components.map((component) => {
      const product = products[component.product_id]
      const color = selections[component.id]?.color || component.color || ""
      if (component.size) return [component.size]
      return getSizeOptions(product, color)
    })

    return sizeSets.reduce<string[]>((common, sizes) => common.filter((size) => sizes.includes(size)), sizeSets[0] ?? [])
  }, [components, products, selections])

  useEffect(() => {
    if (sameSizeMode && commonSizes.length === 0) {
      setSameSizeMode(false)
    }
  }, [sameSizeMode, commonSizes.length])

  const effectiveSameSize = sameSize && commonSizes.includes(sameSize) ? sameSize : commonSizes[0] ?? ""

  const updateSelection = (componentId: string, updates: Partial<Selection>) => {
    setSelections((current) => {
      const previous = current[componentId] ?? { color: "", size: "" }

      if (updates.color && updates.color !== previous.color) {
        const next = { ...current }
        components.forEach((component) => {
          if (component.color) return
          const product = products[component.product_id]
          if (!getColorOptions(product).includes(updates.color!)) return
          const existing = next[component.id] ?? { color: "", size: "" }
          const sizeOptions = getSizeOptions(product, updates.color!)
          next[component.id] = {
            color: updates.color!,
            size: sizeOptions.includes(existing.size) ? existing.size : sizeOptions[0] || "",
          }
        })
        return next
      }

      return { ...current, [componentId]: { ...previous, ...updates } }
    })
  }

  const packAvailable =
    components.length >= 2 &&
    components.every((component) => {
      const product = products[component.product_id]
      const selection = selections[component.id]
      const size = getEffectiveSize(component, selection, sameSizeMode, effectiveSameSize, commonSizes)
      if (!product || !selection?.color || !size || !isProductInStock(product)) return false
      return getStockForSize(product, selection.color, size) >= getComponentQty(component)
    })

  const packOrderItems: PackOrderComponent[] = components.map((component) => {
    const product = products[component.product_id]
    const selection = selections[component.id] ?? { color: component.color ?? "", size: component.size ?? "" }
    const size = getEffectiveSize(component, selection, sameSizeMode, effectiveSameSize, commonSizes)
    const variant = product?.variants?.find((item) => item.color === selection.color)
    const variantSize = getVariantSize(variant, size)
    return {
      component_id: component.id,
      product_id: component.product_id,
      variant_id: component.variant_id ?? variant?.id ?? null,
      variant_item_id: component.variant_item_id ?? variantSize?.variant_item_id ?? null,
      sku: component.sku ?? variantSize?.sku ?? null,
      color: selection.color,
      size,
      qty: getComponentQty(component),
      unit_price: product?.price ?? component.product.price,
    }
  })

  const handleAddPack = () => {
    if (!pack || !packAvailable) return
    addPackToCart(pack, packOrderItems, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 2200)
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black pt-20 text-white">
        <Loader2 className="mr-3 h-6 w-6 animate-spin text-gold" />
        Loading pack...
      </main>
    )
  }

  if (error || !pack) {
    return (
      <main className="min-h-screen bg-black pt-24 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="mb-4 text-red-400">{error || "Pack not found."}</p>
          <Button asChild className="bg-gold text-black hover:bg-gold/90">
            <Link href="/packs">Back to packs</Link>
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black pt-24 text-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/packs" className="mb-8 inline-flex items-center text-gray-400 transition-colors hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to packs
        </Link>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="space-y-4">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-gray-900">
              <Image src={getPackImage(pack)} alt={pack.title} fill className="object-cover" />
              <div className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-black">
                Pack deal
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {components.map((component) => {
                const product = products[component.product_id]
                return (
                  <button
                    key={component.id}
                    type="button"
                    onClick={() => {
                      if (!product) return

                      setSelectedProduct(product)
                      trackStoreEvent("button_clicked", {
                        product_id: product.id,
                        metadata: {
                          action: "pack_component_details_opened",
                          pack_id: pack.id,
                          component_id: component.id,
                        },
                      })
                    }}
                    disabled={!product}
                    className="group flex w-full gap-3 rounded-md border border-white/10 bg-gray-900 p-3 text-left transition hover:border-gold/60 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded bg-black">
                      <Image
                        src={getProductImage(product, component.product.image_url)}
                        alt={component.product.name}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-white">{component.product.name}</p>
                      <p className="text-sm text-gray-400">Qty {getComponentQty(component)}</p>
                      <p className="mt-1 text-xs font-medium text-gold">View details</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Badge className="mb-4 bg-gold text-black">
                {pack.discount_type === "percent" ? `${pack.discount_value}% off` : `${formatPrice(pack.discount_value)} off`}
              </Badge>
              <h1 className="font-playfair text-4xl font-bold sm:text-5xl">{pack.title}</h1>
              {pack.description && <p className="mt-4 leading-7 text-gray-300">{pack.description}</p>}
              <div className="mt-5 flex flex-wrap items-end gap-4">
                <div>
                  <p className="text-sm text-gray-500 line-through">{formatPrice(pack.original_price ?? 0)}</p>
                  <p className="text-3xl font-bold text-gold">{formatPrice(pack.pack_price ?? 0)}</p>
                </div>
                {(pack.savings_value ?? 0) > 0 && (
                  <p className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-sm text-green-300">
                    Save {formatPrice(pack.savings_value ?? 0)}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-gray-900 p-4">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-white">Choose sizes</p>
                  <p className="text-sm text-gray-400">Use one size when it exists for every product, or configure each item.</p>
                </div>
                <div className="grid grid-cols-2 rounded-md border border-white/10 bg-black p-1 text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setSameSizeMode(true)
                      trackStoreEvent("button_clicked", {
                        metadata: {
                          action: "pack_same_size_mode_selected",
                          pack_id: pack.id,
                        },
                      })
                    }}
                    disabled={commonSizes.length === 0}
                    className={`rounded px-3 py-2 ${sameSizeMode ? "bg-gold text-black" : "text-gray-300"} disabled:opacity-40`}
                  >
                    Same size
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSameSizeMode(false)
                      trackStoreEvent("button_clicked", {
                        metadata: {
                          action: "pack_each_item_mode_selected",
                          pack_id: pack.id,
                        },
                      })
                    }}
                    className={`rounded px-3 py-2 ${!sameSizeMode ? "bg-gold text-black" : "text-gray-300"}`}
                  >
                    Each item
                  </button>
                </div>
              </div>

              {sameSizeMode && commonSizes.length > 0 && (
                <div className="mb-5">
                  <Select
                    value={effectiveSameSize}
                    onValueChange={(value) => {
                      setSameSize(value)
                      trackStoreEvent("size_selected", {
                        metadata: {
                          item_type: "pack",
                          pack_id: pack.id,
                          size: value,
                          mode: "same_size",
                        },
                      })
                    }}
                  >
                    <SelectTrigger className="bg-black border-gray-700 text-white">
                      <SelectValue placeholder="Choose one size for all" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      {commonSizes.map((size) => (
                        <SelectItem key={size} value={size} className="text-white">
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-4">
                {components.map((component) => {
                  const product = products[component.product_id]
                  const selection = selections[component.id] ?? { color: component.color ?? "", size: component.size ?? "" }
                  const colorOptions = getColorOptions(product)
                  const sizeOptions = component.size ? [component.size] : getSizeOptions(product, selection.color)
                  const isUnavailable = !product || !isProductInStock(product)
                  const sizeLockedToSameSize = sameSizeMode && commonSizes.length > 0
                  const effectiveSize = getEffectiveSize(component, selection, sameSizeMode, effectiveSameSize, commonSizes)

                  return (
                    <div key={component.id} className="rounded-md border border-white/10 bg-black/35 p-4">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-white">{component.product.name}</p>
                          {isUnavailable && <p className="mt-1 text-sm text-red-300">Out of stock</p>}
                        </div>
                        {effectiveSize && selection.color && !isUnavailable && <Check className="h-5 w-5 text-green-400" />}
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Select
                          value={selection.color}
                          onValueChange={(value) => {
                            updateSelection(component.id, { color: value })
                            trackStoreEvent("color_selected", {
                              product_id: component.product_id,
                              metadata: {
                                item_type: "pack_component",
                                pack_id: pack.id,
                                component_id: component.id,
                                color: value,
                              },
                            })
                          }}
                          disabled={Boolean(component.color) || isUnavailable}
                        >
                          <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                            <SelectValue placeholder="Color" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-700">
                            {(component.color ? [component.color] : colorOptions).map((color) => (
                              <SelectItem key={color} value={color} className="text-white">
                                {color}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={effectiveSize}
                          onValueChange={(value) => {
                            updateSelection(component.id, { size: value })
                            trackStoreEvent("size_selected", {
                              product_id: component.product_id,
                              metadata: {
                                item_type: "pack_component",
                                pack_id: pack.id,
                                component_id: component.id,
                                size: value,
                                color: selection.color,
                              },
                            })
                          }}
                          disabled={sizeLockedToSameSize || Boolean(component.size) || isUnavailable}
                        >
                          <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                            <SelectValue placeholder="Size" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-700">
                            {sizeOptions.map((size) => (
                              <SelectItem key={size} value={size} className="text-white">
                                {size}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <Button
              onClick={handleAddPack}
              disabled={!packAvailable}
              className="w-full bg-gold py-6 text-base font-semibold text-black hover:bg-gold/90"
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              {added ? "Pack added" : packAvailable ? "Add pack to cart" : "Complete available selections"}
            </Button>
          </div>
        </div>
      </div>

      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="pack-product-title"
            onClick={(event) => event.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl border border-white/10 bg-gray-950 shadow-2xl"
          >
            <button
              type="button"
              aria-label="Close product details"
              onClick={() => setSelectedProduct(null)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-gold hover:text-black"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid md:grid-cols-2">
              <div className="relative min-h-[400px] bg-black md:min-h-[600px]">
                <Image
                  src={getProductImage(selectedProduct)}
                  alt={selectedProduct.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col p-6 sm:p-8">
                <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-gold">
                  Included in this pack
                </p>

                <h2 id="pack-product-title" className="font-playfair text-3xl font-bold text-white">
                  {selectedProduct.name}
                </h2>

                <p className="mt-4 text-2xl font-bold text-gold">{formatPrice(selectedProduct.price)}</p>

                {selectedProduct.description && (
                  <p className="mt-5 whitespace-pre-line leading-7 text-gray-300">
                    {selectedProduct.description}
                  </p>
                )}

                <div className="mt-6">
                  <p className="mb-3 font-semibold text-white">Available colors</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.variants?.map((variant) => (
                      <span
                        key={variant.color}
                        className="rounded-full border border-white/15 bg-gray-900 px-3 py-1.5 text-sm text-gray-200"
                      >
                        {variant.color}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <p className="mb-3 font-semibold text-white">Available sizes</p>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(
                      new Set(
                        selectedProduct.variants?.flatMap((variant) =>
                          variant.sizes
                            .filter((size) => isSizePurchasable(size))
                            .map((size) => size.size),
                        ) ?? [],
                      ),
                    ).map((size) => (
                      <span
                        key={size}
                        className="flex h-10 min-w-10 items-center justify-center rounded border border-white/15 bg-gray-900 px-3 text-sm text-white"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-8">
                  <Button
                    type="button"
                    onClick={() => setSelectedProduct(null)}
                    className="w-full bg-gold text-black hover:bg-gold/90"
                  >
                    Continue configuring pack
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
