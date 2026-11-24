"use client"

import Link from "next/link"
import { useStudio } from "@/components/studio-runtime"
import { heroHref } from "@/lib/hero-purchase"
import type { StudioHeroAction } from "@/lib/studio-contract"

export function StudioHeroAction({ action, label, className }: { action: StudioHeroAction; label: string; className?: string }) {
  const studio = useStudio()
  let href: string | null = null
  let error = ""
  try {
    if (studio.manifest) href = heroHref(action, studio.manifest, studio.content?.visibility)
  } catch (cause) {
    error = cause instanceof Error ? cause.message : "This destination is unavailable in this store."
  }

  // Both Studio product actions open the premium detail route. That route reads
  // the published product once; a Hero click never chooses a variant or buys it.
  return <div className="flex flex-col gap-2">
    {href ? <Link href={href} prefetch={false} className={`inline-flex items-center justify-center ${className ?? ""}`}>{label}</Link>
      : <button type="button" className={className} disabled>{label}</button>}
    {error && <p role="alert" className="max-w-sm text-sm">{error}</p>}
  </div>
}
