"use client"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useStudio } from "@/components/studio-runtime"
import type { StorefrontMedia } from "@/types/storefront-content"

type Props = { media: StorefrontMedia; className?: string; imageClassName?: string; priority?: boolean }
export default function StorefrontVideo(props: Props) {
  // A new source must never retain the previous decoder, pending play(), or error.
  return <VideoPlayback key={props.media.src} {...props} />
}
function VideoPlayback({ media, className = "", imageClassName = "object-cover", priority = false }: Props) {
  const { preview, reportMedia } = useStudio()
  const video = useRef<HTMLVideoElement>(null)
  const manualPlay = useRef(false)
  const [load, setLoad] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [state, setState] = useState<"loading" | "ready" | "error">("loading")
  const [failedPoster, setFailedPoster] = useState<string | null>(null)
  const [reduced, setReduced] = useState(true)
  const failed = state === "error"
  const objectPosition = media.objectPosition?.trim() || "50% 50%"
  const wrapperPosition = /\b(absolute|fixed|sticky)\b/.test(className) ? "" : "relative"
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => { setReduced(preference.matches); if (preference.matches) video.current?.pause(); else if (preview) setLoad(true) }
    update(); preference.addEventListener('change', update)
    const timer = window.setTimeout(() => { if (!preference.matches) setLoad(true) }, preview ? 0 : priority ? 1200 : 2500)
    return () => { window.clearTimeout(timer); preference.removeEventListener('change', update) }
  }, [priority, preview])
  useEffect(() => {
    const element = video.current
    return () => { if (element) { element.pause(); element.removeAttribute('src'); element.load() } }
  }, [load, failed])
  useEffect(() => { reportMedia({url:media.src, state, current_src:video.current?.currentSrc || undefined}) }, [media.src, state, reportMedia])
  useEffect(() => { if (media.poster && failedPoster === media.poster) reportMedia({url:media.poster, state:"error"}) }, [media.poster, failedPoster, reportMedia])
  async function toggle() {
    if (!load) { manualPlay.current = true; setLoad(true); return }
    if (playing) video.current?.pause()
    else try { await video.current?.play() } catch { setPlaying(false) }
  }
  return <div className={wrapperPosition + ' h-full w-full overflow-hidden bg-black ' + className} data-hero-media data-media-src={media.src} data-media-state={state}>
    <Image key={media.poster} src={failedPoster === media.poster ? '/placeholder.svg' : media.poster || '/placeholder.svg'} alt={media.alt} fill sizes="100vw" priority={priority} onError={()=>setFailedPoster(media.poster || null)} style={{ objectPosition }} className={imageClassName + " object-cover transition-opacity duration-500 motion-reduce:transition-none" + (playing ? ' opacity-0' : ' opacity-100')} />
    {load && !failed && media.src && <video ref={video} src={media.src} poster={media.poster} muted loop playsInline preload="metadata" autoPlay={!reduced} aria-label={media.alt}
      onLoadedData={event => { setState("ready"); if (!reduced || manualPlay.current) void event.currentTarget.play().catch(() => setPlaying(false)) }} onPlaying={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onError={()=>{setState("error");setPlaying(false)}}
      className={'absolute inset-0 block h-full w-full object-cover transition-opacity duration-500 motion-reduce:transition-none ' + (playing ? 'opacity-100' : 'opacity-0')} style={{ objectPosition }} />}
    {!failed && media.src && <button type="button" className="absolute right-4 top-32 z-30 min-h-11 rounded border border-white/60 bg-black/60 px-4 text-xs text-white" onClick={toggle} aria-label={playing ? 'Mettre la vidéo en pause' : 'Lire la vidéo'}>{playing ? 'Pause' : 'Lire la vidéo'}</button>}
    {preview && failed && <p role="alert" className="absolute bottom-4 left-4 right-4 z-30 rounded bg-black/80 p-3 text-sm text-white">La vidéo sélectionnée ne peut pas être chargée. Son image poster est affichée.</p>}
  </div>
}
