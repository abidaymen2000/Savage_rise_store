"use client"

import type { RefObject } from "react"
import type { EntranceStage } from "@/lib/storefront/entrance"

// The paired doors, handles, wordmark and copy are the historical Savage Rise intro.
const lights = [[12, 22], [26, 70], [39, 12], [61, 82], [76, 30], [88, 66]]

type Props = {
  stage: EntranceStage
  name: string
  panelRef: RefObject<HTMLDivElement>
  onSkip: () => void
}

export default function EntranceAnimation({ stage, name, panelRef, onSkip }: Props) {
  return (
    <div ref={panelRef} className="store-entrance" data-entrance-stage={stage}
      role="dialog" aria-modal="true" aria-label="Introduction Savage Rise" tabIndex={-1}>
      <div className="store-entrance-ground" aria-hidden="true" />
      {(["left", "right"] as const).map(side => (
        <div key={side} className={`store-entrance-door store-entrance-door-${side}`} aria-hidden="true">
          <div className="store-entrance-door-frame" />
          <div className="store-entrance-handle"><span /><i /></div>
        </div>
      ))}
      <div className="store-entrance-signature">
        <p className="store-entrance-wordmark">{name}</p>
        <p className="store-entrance-welcome">Welcome to the world of contemporary luxury</p>
        <div className="store-entrance-ornament" aria-hidden="true"><span /><i /><span /></div>
        <p className="store-entrance-motto">EXCELLENCE • ELEGANCE • SOPHISTICATION</p>
      </div>
      <div className="store-entrance-lights" aria-hidden="true">
        {lights.map(([left, top], index) => <span key={index} style={{ left: `${left}%`, top: `${top}%`, animationDelay: `${index * 160}ms` }} />)}
      </div>
      <button type="button" className="store-entrance-skip" onClick={onSkip}>Passer l’introduction</button>
    </div>
  )
}
