"use client"

import Image from "next/image"
import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Pack } from "@/types/api"
import { formatPrice } from "@/lib/utils"

interface ProductSetBadgeProps {
  pack: Pack
}

function getPreviewItems(pack: Pack) {
  return (
    pack.components?.map((component) => ({
      id: component.id,
      name: component.product.name,
      image: component.product.image_url || pack.image_url || "/placeholder.svg",
    })) ?? []
  )
}

export default function ProductSetBadge({ pack }: ProductSetBadgeProps) {
  const previewItems = getPreviewItems(pack).slice(0, 2)

  if ((pack.savings_value ?? 0) <= 0) return null

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-accent transition hover:border-accent hover:bg-accent hover:text-accent-foreground"
        >
          Available as a set - Save {formatPrice(pack.savings_value ?? 0)}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl border-border dark:border-white/10 bg-card p-0 text-foreground dark:text-white">
        <div className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
          <div className="grid min-h-[260px] grid-cols-2 bg-black">
            {previewItems.map((item) => (
              <div key={item.id} className="relative min-h-[260px] overflow-hidden">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-3 left-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-foreground dark:text-white backdrop-blur">
                  {item.name}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col p-6">
            <DialogHeader className="text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Complete the look</p>
              <DialogTitle className="font-playfair text-3xl text-foreground dark:text-white">{pack.title}</DialogTitle>
              <DialogDescription className="text-sm leading-6 text-muted-foreground">
                Same-color set. Choose each item&apos;s size separately and unlock the pack price instantly.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 rounded-lg border border-border dark:border-white/10 bg-black/40 p-4">
              <p className="text-sm text-muted-foreground line-through">{formatPrice(pack.original_price ?? 0)}</p>
              <p className="mt-1 text-3xl font-bold text-accent">{formatPrice(pack.pack_price ?? 0)}</p>
              <p className="mt-2 text-sm font-medium text-green-300">You save {formatPrice(pack.savings_value ?? 0)}</p>
            </div>

            <div className="mt-6 space-y-3 text-sm text-muted-foreground">
              <p>Build the full set without leaving the collection.</p>
              <p>Keep the product you discovered, then add the matching piece with the better price.</p>
            </div>

            <Button asChild className="mt-auto w-full bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href={`/packs/${pack.id}`}>Build your set</Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

