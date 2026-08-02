import { API_BASE_URL } from "./api-client"
import type { StoreAnalyticsEventPayload } from "@/types/api"

export const FALLBACK_STOREFRONT_ANALYTICS_SLUG = "savage-rise"

let storefrontAnalyticsSlug = FALLBACK_STOREFRONT_ANALYTICS_SLUG

function normalizeStoreSlug(slug: string | null | undefined) {
  const normalized = slug?.trim().toLowerCase()
  return normalized || FALLBACK_STOREFRONT_ANALYTICS_SLUG
}

export function setStorefrontAnalyticsSlug(slug: string | null | undefined) {
  storefrontAnalyticsSlug = normalizeStoreSlug(slug)
}

export function getStorefrontAnalyticsEndpoint() {
  return `/analytics/${storefrontAnalyticsSlug}/events`
}

export const analyticsApi = {
  async trackEvent(payload: StoreAnalyticsEventPayload): Promise<void> {
    const response = await fetch(`${API_BASE_URL}${getStorefrontAnalyticsEndpoint()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = new Error(`Analytics request failed with HTTP ${response.status}`) as Error & { status?: number }
      error.status = response.status
      throw error
    }
  },
}
