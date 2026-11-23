export type VideoPlaybackMode = "loop" | "hero-cycle"
export type VideoPlaybackState = "poster" | "video" | "blocked" | "error"
export const HERO_IMAGE_DURATION_MS = 2000

/** One play request per cycle. The poster stays underneath until real playback starts. */
export function startVideoPlayback(video: HTMLVideoElement, mode: VideoPlaybackMode,
  onState: (state: VideoPlaybackState) => void) {
  let disposed = false
  let failed = false
  let pending = false
  let timer: ReturnType<typeof setTimeout> | undefined
  const clear = () => { if (timer !== undefined) clearTimeout(timer); timer = undefined }
  const play = () => {
    if (disposed || failed || pending) return
    pending = true
    try {
      if (mode === "hero-cycle") video.currentTime = 0
      void Promise.resolve(video.play()).catch(() => {
        if (!disposed && !failed) onState("blocked")
      }).finally(() => { pending = false })
    } catch {
      pending = false
      if (!disposed && !failed) onState("blocked")
    }
  }
  const schedule = () => {
    clear()
    onState("poster")
    timer = setTimeout(play, HERO_IMAGE_DURATION_MS)
  }
  const playing = () => { if (!disposed && !failed) onState("video") }
  const ended = () => {
    if (disposed || failed) return
    if (mode === "hero-cycle") schedule()
    else play() // Native loop normally handles this; fallback for browsers emitting ended.
  }
  const error = () => { failed = true; clear(); onState("error") }
  video.muted = true
  video.playsInline = true
  video.loop = mode === "loop"
  video.addEventListener("playing", playing)
  video.addEventListener("ended", ended)
  video.addEventListener("error", error)
  if (mode === "hero-cycle") schedule()
  else play()
  return () => {
    disposed = true
    clear()
    video.removeEventListener("playing", playing)
    video.removeEventListener("ended", ended)
    video.removeEventListener("error", error)
    video.pause()
  }
}
