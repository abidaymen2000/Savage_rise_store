import { ApiError } from "@/lib/api"
import type { BackendConflictBody } from "@/types/api"

function normalizeCode(value: unknown): string | null {
  if (typeof value !== "string") return null
  return value.trim().toLowerCase().replace(/\s+/g, "_")
}

export function getBackendConflictBody(error: unknown): BackendConflictBody | null {
  if (!(error instanceof ApiError) || error.status !== 409) return null
  if (!error.body || typeof error.body !== "object") return null
  return error.body as BackendConflictBody
}

export function getBackendConflictCode(error: unknown): string | null {
  const body = getBackendConflictBody(error)
  if (!body) return null

  if (typeof body.detail === "object" && body.detail && !Array.isArray(body.detail)) {
    return normalizeCode(body.detail.code) ?? normalizeCode(body.code)
  }

  return normalizeCode(body.code)
}

export function getBackendConflictMessage(error: unknown): string | null {
  const body = getBackendConflictBody(error)
  if (!body) return null

  if (typeof body.detail === "string" && body.detail.trim()) return body.detail
  if (typeof body.detail === "object" && body.detail && !Array.isArray(body.detail)) {
    if (typeof body.detail.message === "string" && body.detail.message.trim()) return body.detail.message
  }
  if (typeof body.message === "string" && body.message.trim()) return body.message
  return null
}

export function isIdempotencyConflict(error: unknown): boolean {
  const code = getBackendConflictCode(error)
  const message = getBackendConflictMessage(error)?.toLowerCase() ?? ""
  return Boolean(
    code?.includes("idempot") ||
      code?.includes("duplicate_order") ||
      message.includes("idempot") ||
      message.includes("already in progress") ||
      message.includes("payload different"),
  )
}

export function isQuoteConflict(error: unknown): boolean {
  const code = getBackendConflictCode(error)
  const message = getBackendConflictMessage(error)?.toLowerCase() ?? ""
  return Boolean(code?.includes("quote") || code?.includes("catalog") || message.includes("quote") || message.includes("catalog"))
}

export function isStockConflict(error: unknown): boolean {
  const code = getBackendConflictCode(error)
  const message = getBackendConflictMessage(error)?.toLowerCase() ?? ""
  return Boolean(
    code?.includes("stock") ||
      code?.includes("inventory") ||
      code?.includes("variant") ||
      message.includes("stock") ||
      message.includes("inventory") ||
      message.includes("available"),
  )
}
