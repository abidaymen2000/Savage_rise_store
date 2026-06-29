"use client"

import { getAnalyticsContext } from "./analytics-context"
import type { MetaEventContext } from "@/types/api"

export function captureFbclidFromLocation(): void {
  getAnalyticsContext()
}

export function getMetaEventContext(eventId?: string | null): MetaEventContext | null {
  if (typeof window === "undefined") return null

  const context = getAnalyticsContext({ eventId })

  return {
    event_id: eventId ?? null,
    event_source_url: context.page_url,
    fbp: context.fbp ?? null,
    fbc: context.fbc ?? null,
    fbclid: context.fbclid ?? null,
    consent: null,
  }
}
