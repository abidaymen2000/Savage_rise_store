"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import type { StorefrontMedia as StorefrontMediaType } from "@/types/storefront-content"

type StorefrontVideoProps = {
  media: StorefrontMediaType
  className?: string
  imageClassName?: string
  priority?: boolean
}

export default function StorefrontVideo({
  media,
  className = "",
  imageClassName = "object-cover",
  priority = false,
}: StorefrontVideoProps) {
  const [failed, setFailed] = useState(false)
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false)
  const wrapperPosition = /\b(absolute|fixed|sticky)\b/.test(className) ? "" : "relative"
  const poster = media.poster

  useEffect(() => {
    const timeout = window.setTimeout(() => setShouldLoadVideo(true), priority ? 1200 : 2500)
    return () => window.clearTimeout(timeout)
  }, [priority])

  if (failed || !media.src) {
    return (
      <div className={`${wrapperPosition} h-full w-full overflow-hidden bg-stone-950 ${className}`} data-hero-media>
        <Image
          src={poster || "/placeholder.svg"}
          alt={media.alt}
          fill
          sizes="100vw"
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          className={`${imageClassName} object-cover`}
        />
      </div>
    )
  }

  const objectPosition = media.objectPosition?.trim() || "50% 50%"

  return (
    <div className={`${wrapperPosition} h-full w-full overflow-hidden bg-black ${className}`} data-hero-media>
      {poster && (
        <Image
          src={poster}
          alt=""
          fill
          sizes="100vw"
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          className={`${imageClassName} object-cover transition-opacity duration-500 ${shouldLoadVideo ? "opacity-0" : "opacity-100"}`}
          style={{ objectPosition }}
        />
      )}
      {shouldLoadVideo && (
        <video
          src={media.src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload={priority ? "metadata" : "none"}
          aria-label={media.alt}
          onError={() => setFailed(true)}
          className="absolute inset-0 block h-full w-full object-cover opacity-100 transition-opacity duration-500"
          style={{ objectPosition }}
        />
      )}
    </div>
  )
}
