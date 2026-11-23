"use client"
import { useStudio } from "@/components/studio-runtime"
import Image from "next/image"
import type { StorefrontMedia as StorefrontMediaType } from "@/types/storefront-content"
import StorefrontVideo from "./storefront-video"

type StorefrontMediaProps = {
  media: StorefrontMediaType
  className?: string
  imageClassName?: string
  priority?: boolean
  sizes?: string
  playback?: import("@/lib/video-playback").VideoPlaybackMode
}

export default function StorefrontMedia({
  media,
  className = "",
  imageClassName = "object-cover",
  priority = false,
  sizes = "100vw",
  playback = "loop",
}: StorefrontMediaProps) {
  const {reportMedia} = useStudio()
  const wrapperPosition = /\b(absolute|fixed|sticky)\b/.test(className) ? "" : "relative"

  if (media.type === "video") {
    return (
      <StorefrontVideo
        media={media}
        className={className}
        imageClassName={imageClassName}
        priority={priority}
        playback={playback}
        sizes={sizes}
      />
    )
  }

  return (
    <div className={`${wrapperPosition} overflow-hidden bg-stone-950 ${className}`}>
      <Image
        key={media.src}
        onError={()=>reportMedia({url:media.src,state:"error"})}
        onLoad={()=>reportMedia({url:media.src,state:"ready"})}
        src={media.src}
        alt={media.alt}
        fill
        sizes={sizes}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        className={imageClassName}
      />
    </div>
  )
}
