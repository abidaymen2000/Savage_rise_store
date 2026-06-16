"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Loader2, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { formatPrice } from "@/lib/utils"
import type { Pack } from "@/types/api"

function getPackImage(pack: Pack) {
  return pack.image_url || pack.products?.[0]?.image_url || "/placeholder.svg"
}

function getDiscountLabel(pack: Pack) {
  return pack.discount_type === "percent"
    ? `${pack.discount_value}% off`
    : `${formatPrice(pack.discount_value)} off`
}

export default function PacksPage() {
  const [packs, setPacks] = useState<Pack[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function fetchPacks() {
      try {
        setLoading(true)
        setError(null)
        const data = await api.getPacks()
        if (isMounted) setPacks(data)
      } catch (err) {
        console.error("Error loading packs:", err)
        if (isMounted) setError("Unable to load packs right now.")
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchPacks()

    return () => {
      isMounted = false
    }
  }, [])

  const sortedPacks = useMemo(() => [...packs].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)), [packs])

  return (
    <main className="min-h-screen bg-black pt-24 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="mb-10 max-w-3xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-gold">Savage Rise Packs</p>
          <h1 className="font-playfair text-4xl font-bold sm:text-5xl">Curated sets, better value.</h1>
          <p className="mt-4 leading-7 text-gray-400">
            Choose ready-made combinations from Savage Rise and configure the size of each item before checkout.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 className="mr-3 h-6 w-6 animate-spin text-gold" />
            Loading packs...
          </div>
        ) : error ? (
          <div className="rounded-md border border-red-500/30 bg-red-950/30 p-4 text-red-200">{error}</div>
        ) : sortedPacks.length === 0 ? (
          <div className="rounded-md border border-white/10 bg-gray-900 p-8 text-center">
            <Package className="mx-auto mb-4 h-12 w-12 text-gray-600" />
            <p className="text-gray-400">No active packs available yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedPacks.map((pack) => (
              <Link
                key={pack.id}
                href={`/packs/${pack.id}`}
                className="group overflow-hidden rounded-lg border border-white/10 bg-gray-900 transition-colors hover:border-gold/50"
              >
                <div className="relative aspect-[4/3] bg-black">
                  <Image
                    src={getPackImage(pack)}
                    alt={pack.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-black">
                    {getDiscountLabel(pack)}
                  </div>
                </div>
                <div className="space-y-3 p-5">
                  <h2 className="text-xl font-semibold transition-colors group-hover:text-gold">{pack.title}</h2>
                  {pack.description && <p className="line-clamp-2 text-sm leading-6 text-gray-400">{pack.description}</p>}
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className="text-sm text-gray-500 line-through">{formatPrice(pack.original_price ?? 0)}</p>
                      <p className="text-2xl font-bold text-gold">{formatPrice(pack.pack_price ?? 0)}</p>
                    </div>
                    <Button className="bg-gold text-black hover:bg-gold/90">Configure</Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
