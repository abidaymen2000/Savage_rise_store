import { API_BASE_URL, ApiError as GeneratedApiError } from "./api-client"
import { getStorefrontHeaders } from "./gateway-config.mjs"

export type ApiOperation = { method: string; path: string }

export class ApiError extends Error {
  status: number
  body: unknown
  operation?: ApiOperation

  constructor(status: number, body: unknown, message: string, operation?: ApiOperation) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.body = body
    this.operation = operation
  }
}

function errorBody(error: ApiError): Record<string, unknown> {
  return error.body && typeof error.body === "object" ? error.body as Record<string, unknown> : {}
}

export function isGatewayRoutingError(error: unknown) {
  return error instanceof ApiError && error.status === 404 &&
    errorBody(error).message === "no Route matched with those values"
}

export function isResourceNotFound(error: unknown) {
  // A missing route or tenant is an outage, not a missing product/SEO 404.
  return error instanceof ApiError && error.status === 404 &&
    !isGatewayRoutingError(error) && errorBody(error).code !== "STORE_DOMAIN_UNKNOWN" &&
    typeof errorBody(error).detail === "string"
}

const loggedErrors = new WeakSet<object>()

export function reportApiFailure(error: unknown, operation?: ApiOperation) {
  if (typeof window !== "undefined") return
  if (error && typeof error === "object") {
    if (loggedErrors.has(error)) return
    loggedErrors.add(error)
  }
  const apiError = error instanceof ApiError ? error : null
  const body = apiError ? errorBody(apiError) : {}
  const context = apiError?.operation ?? operation
  const requestId = typeof body.request_id === "string" && /^[\w-]{1,128}$/.test(body.request_id) ? body.request_id : null
  const code = isGatewayRoutingError(error) ? "GATEWAY_ROUTE_MISSING"
    : body.code === "STORE_DOMAIN_UNKNOWN" ? "STORE_DOMAIN_UNKNOWN"
    : body.code === "INVALID_API_RESPONSE" ? "INVALID_API_RESPONSE"
    : apiError ? "HTTP_ERROR" : "TRANSPORT_OR_PROCESSING_ERROR"
  // Use the generated route template, never the resolved URL, body, token or query.
  console.error("[storefront-api]", {
    method: context?.method ?? null,
    url: context ? `${API_BASE_URL}${context.path.split("?")[0]}` : null,
    storeDomain: getStorefrontHeaders()["X-Store-Domain"],
    status: apiError?.status ?? null,
    code,
    requestId,
  })
}

function getErrorMessage(body: unknown, fallback: string) {
  if (typeof body === "string" && body.trim()) return body
  if (body && typeof body === "object") {
    const detail = (body as Record<string, unknown>).detail
    if (typeof detail === "string" && detail.trim()) return detail
    if (Array.isArray(detail)) {
      const first = detail.find((item) => item && typeof item === "object" && typeof (item as Record<string, unknown>).msg === "string")
      if (first && typeof (first as Record<string, unknown>).msg === "string") {
        return (first as Record<string, unknown>).msg as string
      }
    }
    const message = (body as Record<string, unknown>).message
    if (typeof message === "string" && message.trim()) return message
  }
  return fallback
}

export async function withApiErrors<T>(operation: Promise<T>, context?: ApiOperation): Promise<T> {
  try {
    return await operation
  } catch (error) {
    if (error instanceof GeneratedApiError) {
      const wrapped = new ApiError(error.status, error.body, getErrorMessage(error.body, error.message), {
        method: error.request.method, path: error.request.url,
      })
      reportApiFailure(wrapped)
      throw wrapped
    }
    reportApiFailure(error, context)
    throw error
  }
}
