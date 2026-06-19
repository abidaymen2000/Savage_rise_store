"use client"

import { useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { trackEvent, trackStoreEvent } from "@/lib/store-analytics"

const IDLE_AFTER_MS = 30000
const ACTIVITY_THROTTLE_MS = 10000
const ENGAGEMENT_INTERVAL_MS = 15000

type PageTiming = {
  id: string
  url: string
  title: string
  enteredAt: number
  lastActivityAt: number
  lastEngagementAt: number
  activeMs: number
  visibleMs: number
  lastVisibleAt: number | null
  maxScrollDepth: number
  interactionCount: number
  isIdle: boolean
}

function getElementLabel(element: HTMLElement) {
  return (
    element.getAttribute("aria-label") ||
    element.getAttribute("title") ||
    element.textContent?.replace(/\s+/g, " ").trim().slice(0, 120) ||
    element.getAttribute("href") ||
    element.tagName.toLowerCase()
  )
}

function getElementTarget(element: HTMLElement) {
  return (
    element.getAttribute("data-analytics-target") ||
    element.id ||
    element.getAttribute("name") ||
    element.getAttribute("href") ||
    getElementLabel(element)
  )
}

function getFormLabel(form: HTMLFormElement) {
  return form.getAttribute("data-analytics-target") || form.id || form.getAttribute("name") || form.action || "form"
}

function getFieldLabel(element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) {
  return (
    element.getAttribute("data-analytics-target") ||
    element.name ||
    element.id ||
    element.getAttribute("aria-label") ||
    element.getAttribute("placeholder") ||
    element.type ||
    element.tagName.toLowerCase()
  )
}

function shouldTrackField(element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) {
  if (element.hasAttribute("data-analytics-ignore")) return false
  if (element instanceof HTMLInputElement) {
    return !["password", "hidden", "file"].includes(element.type)
  }
  return true
}

function createPageTiming(url: string): PageTiming {
  const now = Date.now()

  return {
    id: `page_${now}_${Math.random().toString(36).slice(2)}`,
    url,
    title: document.title,
    enteredAt: now,
    lastActivityAt: now,
    lastEngagementAt: now,
    activeMs: 0,
    visibleMs: 0,
    lastVisibleAt: document.visibilityState === "visible" ? now : null,
    maxScrollDepth: 0,
    interactionCount: 0,
    isIdle: false,
  }
}

function getPageTimingSnapshot(page: PageTiming) {
  const now = Date.now()
  const visibleMs = page.visibleMs + (page.lastVisibleAt ? now - page.lastVisibleAt : 0)
  const activeMs =
    page.activeMs +
    (document.visibilityState === "visible" && !page.isIdle ? Math.min(now - page.lastActivityAt, IDLE_AFTER_MS) : 0)

  return {
    page_view_id: page.id,
    entered_at: new Date(page.enteredAt).toISOString(),
    duration_ms: now - page.enteredAt,
    active_ms: activeMs,
    visible_ms: visibleMs,
    idle_ms: Math.max(0, now - page.enteredAt - activeMs),
    max_scroll_depth: page.maxScrollDepth,
    interaction_count: page.interactionCount,
    is_idle: page.isIdle,
  }
}

export default function StoreAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const previousUrl = useRef<string | null>(null)
  const currentPage = useRef<PageTiming | null>(null)
  const lastActivityEventAt = useRef(0)

  const markActivity = (activityType: string, metadata: Record<string, unknown> = {}) => {
    const page = currentPage.current
    if (!page) return

    const now = Date.now()
    const delta = Math.min(now - page.lastActivityAt, IDLE_AFTER_MS)
    if (document.visibilityState === "visible" && delta > 0) {
      page.activeMs += delta
    }

    page.lastActivityAt = now
    page.interactionCount += 1

    if (page.isIdle) {
      page.isIdle = false
      trackEvent("user_activity", {
        event_category: "engagement",
        page_path: page.url,
        page_title: page.title,
        action_target: activityType,
        metadata: {
          auto: true,
          resumed_from_idle: true,
          activity_type: activityType,
          ...getPageTimingSnapshot(page),
          ...metadata,
        },
      })
      lastActivityEventAt.current = now
      return
    }

    if (now - lastActivityEventAt.current >= ACTIVITY_THROTTLE_MS) {
      trackEvent("user_activity", {
        event_category: "engagement",
        page_path: page.url,
        page_title: page.title,
        action_target: activityType,
        metadata: {
          auto: true,
          activity_type: activityType,
          ...getPageTimingSnapshot(page),
          ...metadata,
        },
      })
      lastActivityEventAt.current = now
    }
  }

  const flushCurrentPage = (reason: string) => {
    const page = currentPage.current
    if (!page) return

    const now = Date.now()
    if (document.visibilityState === "visible" && page.lastVisibleAt) {
      page.visibleMs += now - page.lastVisibleAt
      page.lastVisibleAt = now
    }

    trackStoreEvent("page_exited", {
      event_category: "navigation",
      page_path: page.url,
      page_title: page.title,
      action_target: reason,
      metadata: {
        auto: true,
        exit_reason: reason,
        ...getPageTimingSnapshot(page),
      },
    })
  }

  useEffect(() => {
    const url = `${window.location.pathname}${window.location.search}`
    if (previousUrl.current === url) return

    flushCurrentPage(previousUrl.current ? "route_change" : "initial_mount")

    previousUrl.current = url
    currentPage.current = createPageTiming(url)

    trackStoreEvent("page_viewed", {
      event_category: "navigation",
      page_path: url,
      page_title: document.title,
      metadata: {
        url,
        page_view_id: currentPage.current.id,
        entered_at: new Date(currentPage.current.enteredAt).toISOString(),
      },
    })
  }, [pathname, searchParams])

  useEffect(() => {
    trackStoreEvent("session_started", {
      event_category: "session",
      metadata: {
        visibility_state: document.visibilityState,
      },
    })

    const handleClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return

      const element = target.closest("button,a,[role='button']") as HTMLElement | null
      if (!element) return

      markActivity("click", {
        target: getElementTarget(element),
        label: getElementLabel(element),
      })

      trackEvent("button_clicked", {
        event_category: "interaction",
        action_target: getElementTarget(element),
        metadata: {
          auto: true,
          label: getElementLabel(element),
          tag: element.tagName.toLowerCase(),
          href: element instanceof HTMLAnchorElement ? element.href : null,
          role: element.getAttribute("role"),
          x: event.clientX,
          y: event.clientY,
        },
      })
    }

    const handleSubmit = (event: SubmitEvent) => {
      const form = event.target
      if (!(form instanceof HTMLFormElement)) return

      markActivity("form_submit", {
        form: getFormLabel(form),
      })

      trackEvent("form_submitted", {
        event_category: "form",
        action_target: getFormLabel(form),
        metadata: {
          auto: true,
          form_id: form.id || null,
          form_name: form.getAttribute("name"),
          method: form.method || null,
        },
      })
    }

    const handleFieldChange = (event: Event) => {
      const target = event.target
      if (
        !(target instanceof HTMLInputElement) &&
        !(target instanceof HTMLSelectElement) &&
        !(target instanceof HTMLTextAreaElement)
      ) {
        return
      }
      if (!shouldTrackField(target)) return

      markActivity("field_change", {
        field: getFieldLabel(target),
      })

      trackEvent("form_field_changed", {
        event_category: "form",
        action_target: getFieldLabel(target),
        metadata: {
          auto: true,
          field: getFieldLabel(target),
          tag: target.tagName.toLowerCase(),
          type: target instanceof HTMLInputElement ? target.type : target.tagName.toLowerCase(),
          form: target.form ? getFormLabel(target.form) : null,
          checked: target instanceof HTMLInputElement && ["checkbox", "radio"].includes(target.type) ? target.checked : null,
        },
      })
    }

    const handleFieldFocus = (event: FocusEvent) => {
      const target = event.target
      if (
        !(target instanceof HTMLInputElement) &&
        !(target instanceof HTMLSelectElement) &&
        !(target instanceof HTMLTextAreaElement)
      ) {
        return
      }
      if (!shouldTrackField(target)) return

      markActivity("field_focus", {
        field: getFieldLabel(target),
      })

      trackEvent("form_field_focused", {
        event_category: "form",
        action_target: getFieldLabel(target),
        metadata: {
          auto: true,
          field: getFieldLabel(target),
          tag: target.tagName.toLowerCase(),
          type: target instanceof HTMLInputElement ? target.type : target.tagName.toLowerCase(),
          form: target.form ? getFormLabel(target.form) : null,
        },
      })
    }

    const reachedScrollDepths = new Set<number>()
    let scrollTicking = false
    const handleScroll = () => {
      if (scrollTicking) return
      scrollTicking = true

      window.requestAnimationFrame(() => {
        scrollTicking = false

        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
        if (scrollableHeight <= 0) return

        const depth = Math.round((window.scrollY / scrollableHeight) * 100)
        if (currentPage.current) {
          currentPage.current.maxScrollDepth = Math.max(currentPage.current.maxScrollDepth, depth)
        }
        markActivity("scroll", {
          scroll_depth: depth,
        })

        for (const threshold of [25, 50, 75, 90]) {
          if (depth >= threshold && !reachedScrollDepths.has(threshold)) {
            reachedScrollDepths.add(threshold)
            trackEvent("scroll_depth_reached", {
              event_category: "engagement",
              action_target: `${threshold}%`,
              metadata: {
                auto: true,
                depth: threshold,
              },
            })
          }
        }
      })
    }

    const handleVisibilityChange = () => {
      const page = currentPage.current
      const now = Date.now()
      if (page) {
        if (document.visibilityState === "hidden" && page.lastVisibleAt) {
          page.visibleMs += now - page.lastVisibleAt
          page.lastVisibleAt = null
          trackEvent("page_engagement", {
            event_category: "engagement",
            page_path: page.url,
            page_title: page.title,
            action_target: "page_hidden",
            metadata: {
              auto: true,
              ...getPageTimingSnapshot(page),
            },
          })
        }

        if (document.visibilityState === "visible") {
          page.lastVisibleAt = now
          markActivity("page_visible")
        }
      }

      trackEvent(document.visibilityState === "hidden" ? "page_hidden" : "page_visible", {
        event_category: "session",
        metadata: {
          auto: true,
          visibility_state: document.visibilityState,
          ...(page ? getPageTimingSnapshot(page) : {}),
        },
      })
    }

    const heartbeatId = window.setInterval(() => {
      if (document.visibilityState !== "visible") return
      const page = currentPage.current
      if (page) {
        const now = Date.now()
        const inactiveFor = now - page.lastActivityAt
        if (inactiveFor >= IDLE_AFTER_MS && !page.isIdle) {
          page.isIdle = true
          trackEvent("user_idle", {
            event_category: "engagement",
            page_path: page.url,
            page_title: page.title,
            action_target: "idle",
            metadata: {
              auto: true,
              inactive_ms: inactiveFor,
              ...getPageTimingSnapshot(page),
            },
          })
        }

        trackEvent("page_engagement", {
          event_category: "engagement",
          page_path: page.url,
          page_title: page.title,
          action_target: "heartbeat",
          metadata: {
            auto: true,
            ...getPageTimingSnapshot(page),
          },
        })
        page.lastEngagementAt = now
      }

      trackEvent("session_heartbeat", {
        event_category: "session",
        metadata: {
          auto: true,
          scroll_y: window.scrollY,
          ...(page ? getPageTimingSnapshot(page) : {}),
        },
      })
    }, ENGAGEMENT_INTERVAL_MS)

    const handlePageHide = () => {
      flushCurrentPage("pagehide")
      trackEvent("session_ended", {
        event_category: "session",
        metadata: {
          auto: true,
          visibility_state: document.visibilityState,
          ...(currentPage.current ? getPageTimingSnapshot(currentPage.current) : {}),
        },
      })
    }

    const handlePointerMove = () => markActivity("pointer_move")
    const handleKeyDown = () => markActivity("key_down")

    document.addEventListener("click", handleClick, true)
    document.addEventListener("submit", handleSubmit, true)
    document.addEventListener("change", handleFieldChange, true)
    document.addEventListener("focusin", handleFieldFocus, true)
    document.addEventListener("visibilitychange", handleVisibilityChange)
    document.addEventListener("pointermove", handlePointerMove, { passive: true })
    document.addEventListener("keydown", handleKeyDown)
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("pagehide", handlePageHide)

    return () => {
      flushCurrentPage("component_unmount")
      document.removeEventListener("click", handleClick, true)
      document.removeEventListener("submit", handleSubmit, true)
      document.removeEventListener("change", handleFieldChange, true)
      document.removeEventListener("focusin", handleFieldFocus, true)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      document.removeEventListener("pointermove", handlePointerMove)
      document.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("pagehide", handlePageHide)
      window.clearInterval(heartbeatId)
    }
  }, [])

  return null
}
