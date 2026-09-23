import type { MetaEventContext } from "@/types/api"

function getCookie(name: string) {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

export function getMetaEventContext(eventId?: string | null): MetaEventContext {
  if (typeof window === "undefined") return { event_id: eventId ?? null }
  const url = new URL(window.location.href)
  return {
    event_id: eventId ?? null,
    event_source_url: window.location.href,
    fbp: getCookie("_fbp"),
    fbc: getCookie("_fbc"),
    fbclid: url.searchParams.get("fbclid"),
    consent: "granted",
  }
}

