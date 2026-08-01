"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getBundleColorOptions, getBundlePreviewItems } from "@/lib/bundle-media"
import { getColorSwatch } from "@/lib/color-swatches"
import { formatPrice } from "@/lib/utils"
import type { Pack, Product } from "@/types/api"

function getDiscountLabel(pack: Pack) {
  return (pack.savings_value ?? 0) > 0 ? `${formatPrice(pack.savings_value ?? 0)} off` : null
}

export default function PackCardClient({ pack, productLookup }: { pack: Pack; productLookup: Record<string, Product> }) {
  const colorOptions = useMemo(() => getBundleColorOptions(pack, productLookup), [pack, productLookup])
  const [selectedColor, setSelectedColor] = useState("")

  useEffect(() => {
    if (colorOptions.length === 0) return
    if (!selectedColor || !colorOptions.some((color) => color.trim().toLowerCase() === selectedColor.trim().toLowerCase())) {
      setSelectedColor(colorOptions[0])
    }
  }, [colorOptions, selectedColor])

  const previewItems = getBundlePreviewItems(pack, productLookup, selectedColor || colorOptions[0])
  const discountLabel = getDiscountLabel(pack)
  const mediaItems =
    previewItems.length > 0
      ? previewItems
      : [{ id: pack.id, name: pack.title, image: pack.image_url ?? "/placeholder.svg", qty: 1 }]

  return (
    <Link
      href={`/packs/${pack.id}`}
      className="group overflow-hidden rounded-2xl border border-gold/20 bg-black transition-colors hover:border-gold/70 theme-aware-pack-card"
    >
      <div className="grid gap-0 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div
          className={`relative grid min-h-[260px] overflow-hidden bg-gray-900 ${
            mediaItems.length > 1 ? "grid-cols-2" : "grid-cols-1"
          }`}
        >
          {mediaItems.slice(0, 4).map((item, index) => (
            <div key={`${item.id}-${index}`} className="relative min-h-[260px] overflow-hidden">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                fill
                sizes="(min-width: 1024px) 35vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10" />
              {item.qty > 1 && (
                <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                  <span>{item.name}</span>
                  <span className="text-gold">x{item.qty}</span>
                </div>
              )}
            </div>
          ))}
          {discountLabel && (
            <div className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-black">
              {discountLabel}
            </div>
          )}
          {mediaItems.length > 4 && (
            <div className="absolute bottom-4 right-4 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              +{mediaItems.length - 4}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between gap-5 p-6 theme-aware-panel">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-gold">The set offer</p>
            <h2 className="text-2xl font-semibold transition-colors group-hover:text-gold">{pack.title}</h2>
            {pack.description && <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">{pack.description}</p>}
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-300">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 theme-aware-card">Choose each item&apos;s size separately</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 theme-aware-card">Same-color set</span>
            </div>
            {colorOptions.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {colorOptions.map((color) => {
                  const isSelected = color.trim().toLowerCase() === selectedColor.trim().toLowerCase()
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={(event) => {
                        event.preventDefault()
                        setSelectedColor(color)
                      }}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                        isSelected ? "border-gold bg-gold text-black" : "border-white/15 bg-white/5 text-white hover:border-gold/70"
                      }`}
                    >
                      <span className="h-3 w-3 rounded-full border border-white/40" style={{ backgroundColor: getColorSwatch(color) }} />
                      {color}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-gray-500 line-through">{formatPrice(pack.original_price ?? 0)}</p>
              <p className="text-3xl font-bold text-gold">{formatPrice(pack.pack_price ?? 0)}</p>
              {(pack.savings_value ?? 0) > 0 && (
                <p className="mt-1 text-sm font-medium text-green-300">Save {formatPrice(pack.savings_value ?? 0)}</p>
              )}
            </div>
            <Button className="bg-gold text-black hover:bg-gold/90">Configure</Button>
          </div>
        </div>
      </div>
    </Link>
  )
}
