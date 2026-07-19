import { ApiError } from "@/lib/api"
import type { BackendConflictBody } from "@/types/api"

export function getBackendConflictBody(error: unknown): BackendConflictBody | null {
  if (error instanceof ApiError && error.body && typeof error.body === "object") return error.body as BackendConflictBody
  return null
}

export function getBackendConflictCode(error: unknown): string | null {
  const body = getBackendConflictBody(error)
  const detail = body?.detail
  if (detail && !Array.isArray(detail) && typeof detail === "object" && typeof detail.code === "string") return detail.code
  return typeof body?.code === "string" ? body.code : null
}

export function getBackendConflictMessage(error: unknown): string {
  const body = getBackendConflictBody(error)
  const detail = body?.detail
  if (typeof detail === "string") return detail
  if (detail && !Array.isArray(detail) && typeof detail === "object" && typeof detail.message === "string") return detail.message
  if (typeof body?.message === "string") return body.message
  return error instanceof Error ? error.message : "Une erreur est survenue."
}

export function isIdempotencyConflict(error: unknown) {
  return error instanceof ApiError && error.status === 409
}

export function isQuoteConflict(error: unknown) {
  const code = getBackendConflictCode(error)
  return code === "quote_mismatch" || code === "QUOTE_MISMATCH"
}

export function isStockConflict(error: unknown) {
  const code = getBackendConflictCode(error)
  return code === "stock_conflict" || code === "out_of_stock" || code === "STOCK_CONFLICT" || code === "INVENTORY_CONFLICT"
}
