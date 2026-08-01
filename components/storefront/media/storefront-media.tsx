"use client"

import { useState } from "react"
import Image from "next/image"
import type { StorefrontMedia as StorefrontMediaType } from "@/types/storefront-content"

type StorefrontMediaProps = {
  media: StorefrontMediaType
  className?: string
  imageClassName?: string
  containPortraitVideoOnDesktop?: boolean
  priority?: boolean
  sizes?: string
}

export default function StorefrontMedia({
  media,
  className = "",
  imageClassName = "object-cover",
  containPortraitVideoOnDesktop = false,
  priority = false,
  sizes = "100vw",
}: StorefrontMediaProps) {
  const [failed, setFailed] = useState(false)
  const [videoOrientation, setVideoOrientation] = useState<"portrait" | "landscape" | null>(null)
  const fallbackSrc = media.poster || "/placeholder.svg"
  const src = failed ? fallbackSrc : media.src

  if (media.type === "video" && !failed) {
    const shouldContainOnDesktop =
      containPortraitVideoOnDesktop && (videoOrientation === null || videoOrientation === "portrait")
    const videoClassName = `${imageClassName} ${
      shouldContainOnDesktop ? "md:object-contain md:object-[50%_50%]" : "md:object-cover md:object-[50%_50%]"
    }`

    return (
      <div className={`relative overflow-hidden bg-black ${className}`}>
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
          onLoadedMetadata={(event) => {
            const element = event.currentTarget
            setVideoOrientation(element.videoWidth > element.videoHeight ? "landscape" : "portrait")
          }}
          className={`absolute inset-0 h-full w-full ${videoClassName}`}
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
