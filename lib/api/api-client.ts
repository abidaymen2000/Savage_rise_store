import { OpenAPI } from "./generated"
import { getApiBaseUrl, getStorefrontHeaders } from "./gateway-config.mjs"

// Consumers import services through this module so standalone CMS/SSR calls
// also configure the generated client before their first request.
export * from "./generated"
export const API_BASE_URL = getApiBaseUrl()

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("savage_rise_token")
}

export function configureApiClient() {
  OpenAPI.BASE = API_BASE_URL
  OpenAPI.HEADERS = async () => {
    const token = getAuthToken()
    const headers: Record<string, string> = getStorefrontHeaders()
    if (token) headers.Authorization = `Bearer ${token}`
    return headers
  }
}

configureApiClient()
