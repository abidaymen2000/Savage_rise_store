"use client"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import type { StorefrontMedia } from "@/types/storefront-content"

export default function StorefrontVideo({ media, className = "", imageClassName = "object-cover", priority = false }: { media: StorefrontMedia; className?: string; imageClassName?: string; priority?: boolean }) {
  const video = useRef<HTMLVideoElement>(null)
  const manualPlay = useRef(false)
  const [load, setLoad] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)
  const [posterFailed, setPosterFailed] = useState(false)
  const [reduced, setReduced] = useState(true)
  const objectPosition = media.objectPosition?.trim() || "50% 50%"
  const wrapperPosition = /\b(absolute|fixed|sticky)\b/.test(className) ? "" : "relative"
  useEffect(() => {
    manualPlay.current = false
    setFailed(false); setPlaying(false); setLoad(false); setPosterFailed(false)
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => { setReduced(preference.matches); if (preference.matches) video.current?.pause() }
    update(); preference.addEventListener('change', update)
    const timer = window.setTimeout(() => { if (!preference.matches) setLoad(true) }, priority ? 1200 : 2500)
    return () => { window.clearTimeout(timer); preference.removeEventListener('change', update) }
  }, [media.src, priority])
  async function toggle() {
    if (!load) { manualPlay.current = true; setLoad(true); return }
    if (playing) video.current?.pause()
    else try { await video.current?.play() } catch { setPlaying(false) }
  }
  return <div className={wrapperPosition + ' h-full w-full overflow-hidden bg-black ' + className} data-hero-media>
    <Image src={posterFailed ? '/placeholder.svg' : media.poster || '/placeholder.svg'} alt={media.alt} fill sizes="100vw" priority={priority} onError={()=>setPosterFailed(true)} style={{ objectPosition }} className={imageClassName + " object-cover transition-opacity duration-500" + (playing ? ' opacity-0' : ' opacity-100')} />
    {load && !failed && media.src && <video ref={video} src={media.src} poster={media.poster} muted loop playsInline preload="metadata" autoPlay={!reduced} aria-label={media.alt}
      onLoadedData={() => { if (!reduced || manualPlay.current) void video.current?.play().catch(() => setPlaying(false)) }} onPlaying={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onError={()=>{setFailed(true);setPlaying(false)}}
      className={'absolute inset-0 block h-full w-full object-cover transition-opacity duration-500 ' + (playing ? 'opacity-100' : 'opacity-0')} style={{ objectPosition }} />}
    {!failed && media.src && <button type="button" className="absolute right-4 top-32 z-30 min-h-11 rounded border border-white/60 bg-black/60 px-4 text-xs text-white" onClick={toggle} aria-label={playing ? 'Mettre la vidéo en pause' : 'Lire la vidéo'}>{playing ? 'Pause' : 'Lire la vidéo'}</button>}
  </div>
}
