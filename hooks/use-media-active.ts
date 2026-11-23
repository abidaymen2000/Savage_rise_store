"use client"
import { useEffect, useState, type RefObject } from "react"

/** Stop decorative motion offscreen, in a hidden tab, or on reduced-motion devices. */
export function useMediaActive(ref: RefObject<HTMLElement>, pauseOnFocus = false) {
  const [active, setActive] = useState(false)
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)")
    const focusTarget = element.closest("article") ?? element
    let visible = !('IntersectionObserver' in window)
    const update = () => setActive(visible && !element.closest('[data-store-entrance-pending="true"]') && !document.hidden && !preference.matches &&
      !(pauseOnFocus && focusTarget.matches(":focus-within")))
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(entries => {
      visible = entries[0]?.isIntersecting ?? false
      update()
    })
    observer?.observe(element)
    // Opacity/visibility transitions need not trigger IntersectionObserver.
    // Start a fresh Hero image interval only when the entrance unlocks content.
    const entrance = element.closest('[data-store-entrance-pending]')
    const entranceObserver = entrance ? new MutationObserver(update) : null
    if (entrance) entranceObserver?.observe(entrance, { attributes: true, attributeFilter: ["data-store-entrance-pending"] })
    preference.addEventListener("change", update)
    document.addEventListener("visibilitychange", update)
    focusTarget.addEventListener("focusin", update)
    focusTarget.addEventListener("focusout", update)
    update()
    return () => {
      observer?.disconnect()
      entranceObserver?.disconnect()
      preference.removeEventListener("change", update)
      document.removeEventListener("visibilitychange", update)
      focusTarget.removeEventListener("focusin", update)
      focusTarget.removeEventListener("focusout", update)
    }
  }, [ref, pauseOnFocus])
  return active
}
