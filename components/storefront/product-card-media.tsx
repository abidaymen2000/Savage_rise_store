"use client"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useMediaActive } from "@/hooks/use-media-active"
import { getProductColorSlides, productImageFallback, PRODUCT_IMAGE_FALLBACK } from "@/lib/product-color-media"
import type { Product, ProductImage } from "@/types/api"

const sizes = "(min-width: 1536px) 300px, (min-width: 1280px) 23vw, (min-width: 1024px) 30vw, (min-width: 768px) 33vw, (min-width: 390px) 50vw, 100vw"

export default function ProductCardMedia({ product, priority, inStock }: { product: Product; priority: boolean; inStock: boolean }) {
  const slides = getProductColorSlides(product)
  return <ColorRotation key={JSON.stringify([product.id, slides.map(s => s.url)])} slides={slides} fallback={productImageFallback(product).url} priority={priority} inStock={inStock} />
}

function ColorRotation({ slides, fallback, priority, inStock }: { slides: ProductImage[]; fallback: string; priority: boolean; inStock: boolean }) {
  const container = useRef<HTMLDivElement>(null)
  const active = useMediaActive(container, true)
  const [index, setIndex] = useState(0)
  const [previousIndex, setPreviousIndex] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState(false)
  const [loaded, setLoaded] = useState<Record<string, boolean>>({})
  const [failed, setFailed] = useState<Record<string, boolean>>({})
  const source = (image: ProductImage) => !failed[image.url] ? image.url : !failed[fallback] ? fallback : PRODUCT_IMAGE_FALLBACK
  const next = (index + 1) % slides.length
  const currentSrc = source(slides[index])
  const nextSrc = source(slides[next])
  const rotating = active && slides.length > 1
  const currentReady = Boolean(loaded[currentSrc])
  const nextReady = Boolean(loaded[nextSrc])
  useEffect(() => {
    setElapsed(false)
    if (!rotating || !currentReady) return
    const timer = window.setTimeout(() => setElapsed(true), 2000)
    return () => window.clearTimeout(timer)
  }, [rotating, index, currentReady])
  useEffect(() => {
    if (rotating && elapsed && nextReady) { setPreviousIndex(index); setIndex(next); setElapsed(false) }
  }, [rotating, elapsed, nextReady, next, index])

  useEffect(() => {
    if (previousIndex === null) return
    const timer = window.setTimeout(() => setPreviousIndex(null), 300)
    return () => window.clearTimeout(timer)
  }, [previousIndex])

  return <div ref={container} className="pointer-events-none absolute inset-0" data-color-slide={index} data-color-slides={slides.length}>
    {/* Keep the preceding frame only during the crossfade; preload just the next color. */}
    {[...new Set([...(previousIndex === null ? [] : [previousIndex]), index, ...(rotating ? [next] : [])])].map(i => {
      const src = source(slides[i])
      const current = i === index
      return <Image key={i} src={src} alt={current ? slides[i].alt_text || "" : ""} aria-hidden={!current} fill sizes={sizes}
        priority={priority && i === 0} loading={priority && i === 0 ? undefined : "lazy"}
        onLoad={() => setLoaded(previous => previous[src] ? previous : { ...previous, [src]: true })}
        onError={() => setFailed(previous => previous[src] ? previous : { ...previous, [src]: true })}
        className={`object-contain ${current ? "transition-[opacity,transform] duration-300 motion-reduce:transition-none" : "transition-none"} group-hover:scale-[1.025] ${current || i === previousIndex ? inStock ? "opacity-100" : "opacity-90 grayscale-[20%]" : "opacity-0"}`} />
    })}
  </div>
}
