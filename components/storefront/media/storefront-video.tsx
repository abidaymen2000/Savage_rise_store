"use client"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useStudio } from "@/components/studio-runtime"
import { useMediaActive } from "@/hooks/use-media-active"
import { startVideoPlayback, type VideoPlaybackMode, type VideoPlaybackState } from "@/lib/video-playback"
import type { StorefrontMedia } from "@/types/storefront-content"
import HeroPoster from "./hero-poster"

const HERO_POSTER_WAIT_MS = 5000

type Props = { media: StorefrontMedia; className?: string; imageClassName?: string; priority?: boolean; sizes?: string; playback?: VideoPlaybackMode }
export default function StorefrontVideo(props: Props) {
  return <VideoPlayback key={props.media.src + "|" + props.media.poster + "|" + props.playback} {...props} />
}

function VideoPlayback({ media, className = "", imageClassName = "object-cover", priority = false, sizes = "100vw", playback = "loop" }: Props) {
  const { preview, reportMedia } = useStudio()
  const container = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const active = useMediaActive(container)
  const [load, setLoad] = useState(priority)
  const [posterState, setPosterState] = useState<"loading" | "ready" | "fallback">(media.poster ? "loading" : "fallback")
  const [playState, setPlayState] = useState<VideoPlaybackState>("poster")
  const [state, setState] = useState<"loading" | "ready" | "error">("loading")
  const [failedPoster, setFailedPoster] = useState(false)
  const readyToPlay = playback !== "hero-cycle" || posterState !== "loading"
  const failed = state === "error"
  const objectPosition = media.objectPosition?.trim() || "50% 50%"
  const wrapperPosition = /\b(absolute|fixed|sticky)\b/.test(className) ? "" : "relative"

  useEffect(() => { if (active) setLoad(true) }, [active])
  useEffect(() => {
    if (!active || playback !== "hero-cycle" || posterState !== "loading") return
    // The introduction never waits on media. A stalled poster also cannot stop
    // the cycle: the inline fallback gets its own two-second image interval.
    const timer = setTimeout(() => setPosterState("fallback"), HERO_POSTER_WAIT_MS)
    return () => clearTimeout(timer)
  }, [active, playback, posterState])
  useEffect(() => {
    const element = video.current
    // React StrictMode may clean up and re-run effects on the same video element.
    if (element && element.getAttribute("src") !== media.src) element.src = media.src
    return () => { if (element) { element.pause(); element.removeAttribute("src"); element.load() } }
  }, [load, failed, media.src])
  useEffect(() => {
    if (!active || !load || failed || !readyToPlay) {
      setPlayState("poster")
      return
    }
    const element = video.current
    if (!element) return
    return startVideoPlayback(element, playback, setPlayState)
  // A late decoded image restarts the full interval, even after a fallback cycle.
  }, [active, load, failed, playback, readyToPlay, posterState])
  useEffect(() => {
    reportMedia({ url: media.src, state, current_src: video.current?.currentSrc || undefined })
  }, [media.src, state, reportMedia])
  useEffect(() => {
    if (media.poster && failedPoster) reportMedia({ url: media.poster, state: "error" })
  }, [media.poster, failedPoster, reportMedia])

  return <div ref={container} className={wrapperPosition + " h-full w-full overflow-hidden bg-black " + className} data-hero-media data-media-src={media.src} data-media-state={state} data-playback={playback} data-playback-state={playState}>
    {/* Keep the poster underneath buffering, denied autoplay and failed decoders. */}
    {playback === "hero-cycle" ? <HeroPoster src={media.poster} alt={media.alt} sizes={sizes} priority={priority}
      onReady={() => setPosterState("ready")} onError={() => { setFailedPoster(true); setPosterState("fallback") }}
      objectPosition={objectPosition} className={imageClassName + " object-cover"} /> :
      <Image src={failedPoster ? "/placeholder.svg" : media.poster || "/placeholder.svg"} alt={media.alt} fill sizes={sizes} priority={priority}
        onError={() => setFailedPoster(true)} style={{ objectPosition }} className={imageClassName + " object-cover"} />}
    {load && !failed && media.src && <video ref={video} src={media.src} poster={media.poster} muted playsInline loop={playback === "loop"} preload={priority ? "auto" : "metadata"} aria-label={media.alt}
      onLoadedData={() => setState("ready")} onError={() => { setState("error"); setPlayState("error") }}
      className={"absolute inset-0 block h-full w-full object-cover " + (playState === "video" ? "opacity-100 transition-opacity duration-300 motion-reduce:transition-none" : "opacity-0")} style={{ objectPosition }} />}
    {preview && failed && <p role="alert" className="absolute bottom-4 left-4 right-4 z-30 rounded bg-black/80 p-3 text-sm text-white">La vidéo sélectionnée ne peut pas être chargée. Son image poster est affichée.</p>}
  </div>
}
