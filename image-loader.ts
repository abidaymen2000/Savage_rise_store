import type { ImageLoaderProps } from "next/image"

export default function imageLoader({ src, width, quality }: ImageLoaderProps) {
  if (!src.includes("ik.imagekit.io")) return src
  const separator = src.includes("?") ? "&" : "?"
  return `${src}${separator}tr=w-${width},q-${quality ?? 75},f-auto`
}
