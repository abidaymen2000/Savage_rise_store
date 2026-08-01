"use client"

import { useState } from "react"
import Image from "next/image"
import type { StorefrontMedia as StorefrontMediaType } from "@/types/storefront-content"

type StorefrontMediaProps = {
  media: StorefrontMediaType
  className?: string
  imageClassName?: string
  priority?: boolean
  sizes?: string
}

export default function StorefrontMedia({
  media,
  className = "",
  imageClassName = "object-cover",
  priority = false,
  sizes = "100vw",
}: StorefrontMediaProps) {
  const [failed, setFailed] = useState(false)
  const src = failed ? "/placeholder.svg" : media.src

  if (media.type === "video" && !failed) {
    return (
      <div className={`relative overflow-hidden bg-stone-950 ${className}`}>
        <video
          src={media.src}
          poster={media.poster}
          autoPlay
          muted
          loop
          playsInline
          preload={priority ? "auto" : "metadata"}
          aria-label={media.alt}
          onError={() => setFailed(true)}
          className={`h-full w-full ${imageClassName}`}
        />
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden bg-stone-950 ${className}`}>
      <Image
        src={src}
        alt={media.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={imageClassName}
        onError={() => setFailed(true)}
        unoptimized={src.startsWith("http")}
      />
    </div>
  )
}
