"use client"

import { useState } from "react"
import Image from "next/image"

type Props = {
  src?: string
  alt: string
  sizes: string
  priority: boolean
  className: string
  objectPosition?: string
  onReady?: () => void
  onError?: () => void
}

/** The local SR signature is rendered in HTML, so even a stalled CDN cannot leave a blank Hero. */
export default function HeroPoster({ src, alt, sizes, priority, className, objectPosition, onReady, onError }: Props) {
  const [ready, setReady] = useState(false)

  return <div className="absolute inset-0" data-hero-poster data-hero-poster-state={ready ? "ready" : "fallback"}>
    <div data-hero-fallback aria-hidden="true" className="absolute inset-0 overflow-hidden bg-[#292720] text-[#c4a65c]">
      {/* Monogram from the existing local brand icon; no image or font request is required. */}
      <svg viewBox="0 0 512 512" className="absolute right-0 top-0 h-56 w-full max-w-xl md:h-full" focusable="false">
        <text x="256" y="275" textAnchor="middle" dominantBaseline="middle" fill="currentColor"
          fontFamily="var(--font-playfair), Georgia, serif" fontSize="172" fontWeight="500" letterSpacing="-10">SR</text>
        <path d="M185 350h142" stroke="currentColor" strokeWidth="4" />
      </svg>
    </div>
    {src && <Image src={src} alt={alt} fill sizes={sizes} priority={priority} loading={priority ? "eager" : "lazy"}
      onLoad={() => { setReady(true); onReady?.() }}
      onError={() => { setReady(false); onError?.() }}
      style={{ objectPosition, opacity: ready ? 1 : 0 }} className={className} />}
  </div>
}
