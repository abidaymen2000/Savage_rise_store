import { OpenAPI } from "./generated"

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  (process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://savage-rise-backend-8f0f0a23c13f.herokuapp.com")

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("savage_rise_token")
}

export function configureApiClient() {
  OpenAPI.BASE = API_BASE_URL
  OpenAPI.HEADERS = async () => {
    const token = getAuthToken()
    const headers: Record<string, string> = {}
    if (token) headers.Authorization = `Bearer ${token}`
    return headers
  }
}

configureApiClient()
