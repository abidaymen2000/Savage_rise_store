"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { trackStoreEvent } from "@/lib/store-analytics"

export default function HeroPrimaryAction({
  href,
  label,
  hasActiveDrop,
}: {
  href: string
  label: string
  hasActiveDrop: boolean
}) {
  return (
    <Button asChild className="h-12 rounded-none bg-white px-6 text-xs font-semibold uppercase tracking-[0.16em] text-black hover:bg-[#D4AF37]">
      <Link
        href={href}
        onClick={() =>
          trackStoreEvent("button_clicked", {
            metadata: { button: "hero_primary", href, has_active_drop: hasActiveDrop },
          })
        }
      >
        {label}
        <ChevronRight className="ml-2 h-4 w-4" />
      </Link>
    </Button>
  )
}
