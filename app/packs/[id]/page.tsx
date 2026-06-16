"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Check, Loader2, Package, ShoppingBag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api } from "@/lib/api"
import { formatPrice, getStockForSize, isProductInStock } from "@/lib/utils"
import { useCart } from "@/contexts/CartContext"
import type { Pack, PackComponent, PackOrderComponent, Product } from "@/types/api"

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
  return variant?.sizes.filter((size) => size.stock > 0).map((size) => size.size) ?? []
}

function getComponentQty(component: PackComponent) {
  return component.qty ?? 1
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

        const initialSelections: Record<string, Selection> = {}
        components.forEach((component) => {
          const product = productMap[component.product_id]
          const color = component.color || product?.variants?.[0]?.color || ""
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
        console.error("Error loading pack:", err)
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
      return
    }
    if (!sameSizeMode || commonSizes.length === 0) return
    const nextSize = sameSize && commonSizes.includes(sameSize) ? sameSize : commonSizes[0]
    setSameSize(nextSize)
    setSelections((current) => {
      const next = { ...current }
      components.forEach((component) => {
        if (!component.size && next[component.id]) {
          next[component.id] = { ...next[component.id], size: nextSize }
        }
      })
      return next
    })
  }, [commonSizes, components, sameSize, sameSizeMode])

  const updateSelection = (componentId: string, updates: Partial<Selection>) => {
    setSelections((current) => {
      const previous = current[componentId] ?? { color: "", size: "" }
      const next = { ...previous, ...updates }
      if (updates.color && updates.color !== previous.color) {
        const component = components.find((item) => item.id === componentId)
        const product = component ? products[component.product_id] : null
        next.size = sameSizeMode && sameSize ? sameSize : getSizeOptions(product, updates.color)[0] || ""
      }
      return { ...current, [componentId]: next }
    })
  }

  const packAvailable =
    components.length >= 2 &&
    components.every((component) => {
      const product = products[component.product_id]
      const selection = selections[component.id]
      if (!product || !selection?.color || !selection?.size || !isProductInStock(product)) return false
      return getStockForSize(product, selection.color, selection.size) >= getComponentQty(component)
    })

  const packOrderItems: PackOrderComponent[] = components.map((component) => {
    const product = products[component.product_id]
    const selection = selections[component.id] ?? { color: component.color ?? "", size: component.size ?? "" }
    return {
      component_id: component.id,
      product_id: component.product_id,
      color: selection.color,
      size: selection.size,
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
                  <div key={component.id} className="flex gap-3 rounded-md border border-white/10 bg-gray-900 p-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded bg-black">
                      <Image src={getProductImage(product, component.product.image_url)} alt={component.product.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-white">{component.product.name}</p>
                      <p className="text-sm text-gray-400">Qty {getComponentQty(component)}</p>
                    </div>
                  </div>
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
                    onClick={() => setSameSizeMode(true)}
                    disabled={commonSizes.length === 0}
                    className={`rounded px-3 py-2 ${sameSizeMode ? "bg-gold text-black" : "text-gray-300"} disabled:opacity-40`}
                  >
                    Same size
                  </button>
                  <button
                    type="button"
                    onClick={() => setSameSizeMode(false)}
                    className={`rounded px-3 py-2 ${!sameSizeMode ? "bg-gold text-black" : "text-gray-300"}`}
                  >
                    Each item
                  </button>
                </div>
              </div>

              {sameSizeMode && commonSizes.length > 0 && (
                <div className="mb-5">
                  <Select
                    value={sameSize}
                    onValueChange={(value) => {
                      setSameSize(value)
                      setSelections((current) => {
                        const next = { ...current }
                        components.forEach((component) => {
                          if (!component.size && next[component.id]) {
                            next[component.id] = { ...next[component.id], size: value }
                          }
                        })
                        return next
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

                  return (
                    <div key={component.id} className="rounded-md border border-white/10 bg-black/35 p-4">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-white">{component.product.name}</p>
                          {isUnavailable && <p className="mt-1 text-sm text-red-300">Out of stock</p>}
                        </div>
                        {selection.size && selection.color && !isUnavailable && <Check className="h-5 w-5 text-green-400" />}
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Select
                          value={selection.color}
                          onValueChange={(value) => updateSelection(component.id, { color: value })}
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
                          value={selection.size}
                          onValueChange={(value) => updateSelection(component.id, { size: value })}
                          disabled={sameSizeMode || Boolean(component.size) || isUnavailable}
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
    </main>
  )
}
