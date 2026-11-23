"use client"

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import EntranceAnimation from "./EntranceAnimation"
import type { EntranceController, EntranceStage } from "@/lib/storefront/entrance"

type EntranceWindow = Window & { __savageEntrance?: EntranceController }

export default function EntranceWrapper({ children, name, disabled = false }: { children: ReactNode; name: string; disabled?: boolean }) {
  const [stage, setStage] = useState<EntranceStage>("checking")
  const panel = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const running = stage === "playing" || stage === "revealing"
  const reveal = useCallback(() => (window as EntranceWindow).__savageEntrance?.reveal(), [])

  useEffect(() => {
    const controller = (window as EntranceWindow).__savageEntrance
    const element = content.current
    if (disabled) controller?.complete()
    const update = () => setStage(disabled ? "complete" : controller?.stage ?? "complete")
    window.addEventListener("savage-rise:entrance-change", update)
    update()
    return () => {
      window.removeEventListener("savage-rise:entrance-change", update)
      // StrictMode's rehearsal keeps this node connected; a real unmount does not.
      queueMicrotask(() => { if (!element?.isConnected) controller?.complete() })
    }
  }, [disabled])

  useEffect(() => {
    if (!running) return
    const element = content.current
    const entrancePanel = panel.current
    const previousFocus = document.activeElement as HTMLElement | null
    if (element) element.inert = true
    entrancePanel?.focus({ preventScroll: true })
    return () => {
      if (element) element.inert = false
      if (previousFocus && previousFocus !== document.body && previousFocus.isConnected && !entrancePanel?.contains(previousFocus)) previousFocus.focus({ preventScroll: true })
      else element?.focus({ preventScroll: true })
    }
  }, [running])

  return (
    <>
      {stage !== "complete" && <EntranceAnimation stage={stage} name={name} panelRef={panel} onSkip={reveal} />}
      {/* A stable subtree preserves the Hero, forms and navigation through the reveal. */}
      <div ref={content} className="store-entrance-content" data-store-entrance-pending={stage !== "complete"} aria-hidden={running || undefined} tabIndex={-1}>
        {children}
      </div>
    </>
  )
}
