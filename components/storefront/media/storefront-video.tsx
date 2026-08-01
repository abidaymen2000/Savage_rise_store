"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import type { StorefrontMedia as StorefrontMediaType } from "@/types/storefront-content"

type StorefrontVideoProps = {
  media: StorefrontMediaType
  className?: string
  imageClassName?: string
  containPortraitVideoOnDesktop?: boolean
  priority?: boolean
}

export default function StorefrontVideo({
  media,
  className = "",
  imageClassName = "object-cover",
  containPortraitVideoOnDesktop = false,
  priority = false,
}: StorefrontVideoProps) {
  const [failed, setFailed] = useState(false)
  const [videoOrientation, setVideoOrientation] = useState<"portrait" | "landscape" | null>(null)
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false)
  const wrapperPosition = /\b(absolute|fixed|sticky)\b/.test(className) ? "" : "relative"
  const poster = media.poster

  useEffect(() => {
    const timeout = window.setTimeout(() => setShouldLoadVideo(true), priority ? 1200 : 2500)
    return () => window.clearTimeout(timeout)
  }, [priority])

  if (failed || !media.src || !shouldLoadVideo) {
    return (
      <div className={`${wrapperPosition} overflow-hidden bg-stone-950 ${className}`}>
        <Image
          src={poster || "/placeholder.svg"}
          alt={media.alt}
          fill
          sizes="100vw"
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          className={imageClassName}
        />
      </div>
    )
  }

  const shouldContainOnDesktop =
    containPortraitVideoOnDesktop && (videoOrientation === null || videoOrientation === "portrait")
  const videoClassName = `${imageClassName} ${
    shouldContainOnDesktop ? "md:object-contain md:object-[50%_50%]" : "md:object-cover md:object-[50%_50%]"
  }`

  return (
    <div className={`${wrapperPosition} overflow-hidden bg-black ${className}`}>
      {poster && (
        <Image
          src={poster}
          alt=""
          fill
          sizes="100vw"
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          className={imageClassName}
        />
      )}
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
        onLoadedMetadata={(event) => {
          const element = event.currentTarget
          setVideoOrientation(element.videoWidth > element.videoHeight ? "landscape" : "portrait")
        }}
        className={`absolute inset-0 h-full w-full ${videoClassName}`}
      />
    </div>
  )
}
