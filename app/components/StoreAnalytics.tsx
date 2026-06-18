"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { trackEvent, trackStoreEvent } from "@/lib/store-analytics"

function getElementLabel(element: HTMLElement) {
  return (
    element.getAttribute("aria-label") ||
    element.getAttribute("title") ||
    element.textContent?.replace(/\s+/g, " ").trim().slice(0, 120) ||
    element.getAttribute("href") ||
    element.tagName.toLowerCase()
  )
}

export default function StoreAnalytics() {
  const pathname = usePathname()
  const previousUrl = useRef<string | null>(null)

  useEffect(() => {
    const url = `${window.location.pathname}${window.location.search}`
    if (previousUrl.current === url) return
    previousUrl.current = url

    trackStoreEvent("page_viewed", {
      metadata: {
        url,
      },
    })
  }, [pathname])

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return

      const element = target.closest("button,a,[role='button']") as HTMLElement | null
      if (!element) return

      trackEvent("button_clicked", {
        metadata: {
          auto: true,
          label: getElementLabel(element),
          tag: element.tagName.toLowerCase(),
          href: element instanceof HTMLAnchorElement ? element.href : null,
          role: element.getAttribute("role"),
        },
      })
    }

    const handleSubmit = (event: SubmitEvent) => {
      const form = event.target
      if (!(form instanceof HTMLFormElement)) return

      trackEvent("button_clicked", {
        metadata: {
          auto: true,
          action: "form_submitted",
          form_id: form.id || null,
          form_name: form.getAttribute("name"),
        },
      })
    }

    document.addEventListener("click", handleClick, true)
    document.addEventListener("submit", handleSubmit, true)

    return () => {
      document.removeEventListener("click", handleClick, true)
      document.removeEventListener("submit", handleSubmit, true)
    }
  }, [])

  return null
}
