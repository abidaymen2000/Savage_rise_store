import { API_BASE_URL } from "./api-client"
import type { StoreAnalyticsEventPayload } from "@/types/api"

export const FALLBACK_STOREFRONT_ANALYTICS_SLUG = "savage-rise"
export const ANALYTICS_API_BASE_URL_MISSING = "ANALYTICS_API_BASE_URL_MISSING"

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

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.replace(/\/+$/, "")
}

export function getAnalyticsApiBaseUrl() {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  if (configuredBaseUrl) return normalizeBaseUrl(configuredBaseUrl)
  if (process.env.NODE_ENV === "development") {
    throw new Error(ANALYTICS_API_BASE_URL_MISSING)
  }
  return normalizeBaseUrl(API_BASE_URL)
}

export function getStorefrontAnalyticsUrl() {
  return `${getAnalyticsApiBaseUrl()}${getStorefrontAnalyticsEndpoint()}`
}

function cleanPayload<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => cleanPayload(item)) as T
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entryValue]) => entryValue !== undefined)
        .map(([key, entryValue]) => [key, cleanPayload(entryValue)]),
    ) as T
  }
  return value
}

async function readSafeResponse(response: Response) {
  const text = await response.text().catch(() => "")
  if (!text) return ""
  const parsed = parseSafeJson(text)
  if (parsed !== null) return JSON.stringify(parsed)
  return text.slice(0, 500)
}

function parseSafeJson(text: string) {
  if (!text) return null
  try {
    return JSON.parse(text) as unknown
  } catch {
    return null
  }
}

export type AnalyticsTransportResult = {
  event_name: string
  url: string
  status: number
  response: string
}

export class AnalyticsTransportError extends Error {
  status?: number
  url?: string
  response?: string

  constructor(message: string, options: { status?: number; url?: string; response?: string } = {}) {
    super(message)
    this.name = "AnalyticsTransportError"
    this.status = options.status
    this.url = options.url
    this.response = options.response
  }
}

export const analyticsApi = {
  async trackEvent(payload: StoreAnalyticsEventPayload): Promise<AnalyticsTransportResult> {
    const endpoint = getStorefrontAnalyticsUrl()
    const body = JSON.stringify(cleanPayload(payload))
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body,
      keepalive: true,
      credentials: "omit",
    })

    const responseBody = await readSafeResponse(response)
    if (!response.ok) {
      const error = new AnalyticsTransportError(`Analytics request failed with HTTP ${response.status}`, {
        status: response.status,
        url: endpoint,
        response: responseBody,
      })
      throw error
    }

    const parsedBody = parseSafeJson(responseBody)
    if (
      parsedBody &&
      typeof parsedBody === "object" &&
      "tracked" in parsedBody &&
      (parsedBody as { tracked?: unknown }).tracked === false
    ) {
      throw new AnalyticsTransportError("Analytics request was accepted but not tracked", {
        status: response.status,
        url: endpoint,
        response: responseBody,
      })
    }

    return {
      event_name: payload.event_name,
      url: endpoint,
      status: response.status,
      response: responseBody,
    }
  },
}
