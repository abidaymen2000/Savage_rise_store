"use client"
import { useStudio } from "@/components/studio-runtime"
import Image from "next/image"
import type { StorefrontMedia as StorefrontMediaType } from "@/types/storefront-content"
import StorefrontVideo from "./storefront-video"
import HeroPoster from "./hero-poster"

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

  if (playback === "hero-cycle") {
    return <div className={`${wrapperPosition} overflow-hidden ${className}`} data-hero-media>
      <HeroPoster key={media.src} src={media.src} alt={media.alt} sizes={sizes} priority={priority} className={imageClassName}
        objectPosition={media.objectPosition?.trim() || "50% 50%"}
        onReady={() => reportMedia({ url: media.src, state: "ready" })}
        onError={() => reportMedia({ url: media.src, state: "error" })} />
    </div>
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
