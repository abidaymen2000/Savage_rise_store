"use client"

import { useState, useEffect } from "react"
import EntranceAnimation from "./EntranceAnimation"

interface EntranceWrapperProps {
  children: React.ReactNode
}

export default function EntranceWrapper({ children }: EntranceWrapperProps) {
  const [showAnimation, setShowAnimation] = useState(true)
  const [hasVisited, setHasVisited] = useState(false)

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà visité le site dans cette session
    const visited = sessionStorage.getItem("savage_rise_visited")
    if (visited) {
      setShowAnimation(false)
      setHasVisited(true)
    }
  }, [])

  const handleAnimationComplete = () => {
    setShowAnimation(false)
    setHasVisited(true)
    // Marquer comme visité pour cette session
    sessionStorage.setItem("savage_rise_visited", "true")
  }

  // Si l'utilisateur a déjà visité, ne pas montrer l'animation
  if (hasVisited && !showAnimation) {
    return <>{children}</>
  }

  return (
    <>
      {showAnimation && <EntranceAnimation onComplete={handleAnimationComplete} />}
      <div className={showAnimation ? "opacity-0" : "opacity-100 transition-opacity duration-500"}>
        {children}
      </div>
    </>
  )
}
