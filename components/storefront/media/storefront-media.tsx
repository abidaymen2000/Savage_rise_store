import Image from "next/image"
import type { StorefrontMedia as StorefrontMediaType } from "@/types/storefront-content"
import StorefrontVideo from "./storefront-video"

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
  const wrapperPosition = /\b(absolute|fixed|sticky)\b/.test(className) ? "" : "relative"

  if (media.type === "video") {
    return (
      <StorefrontVideo
        media={media}
        className={className}
        imageClassName={imageClassName}
        containPortraitVideoOnDesktop={containPortraitVideoOnDesktop}
        priority={priority}
      />
    )
  }

  return (
    <div className={`${wrapperPosition} overflow-hidden bg-stone-950 ${className}`}>
      <Image
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
