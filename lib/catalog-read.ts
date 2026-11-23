import { withApiErrors } from "@/lib/api/api-error"
import { isTemporaryReadError } from "@/lib/read-retry"

export type CatalogObservation = {
  operation: "products" | "detail" | "categories" | "listing" | "page" | "integrity"
  attempt?: number
  status?: number
  durationMs?: number
  page?: number
  total?: number
  loaded?: number
  productId?: string
  missingIds?: string[]
  reason?: string
}
export type CatalogObserver = (event: CatalogObservation) => void

export class CatalogIntegrityError extends Error {
  readonly reason: string
  constructor(reason: string) {
    super("The full catalog could not be loaded. Please try again.")
    this.name = "CatalogIntegrityError"
    this.reason = reason
  }
}

/** Catalog GETs only. Cancel the SDK request as well as bounding the wait. */
export async function readCatalog<T>(
  operation: () => Promise<T> & { cancel?: () => void },
  options: {
    operation?: CatalogObservation["operation"]
    observer?: CatalogObserver
    productId?: string
    validate?: (value: T) => void
    timeoutMs?: number
    wait?: (ms: number) => Promise<void>
  } = {},
): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    const start = Date.now()
    let timer: ReturnType<typeof setTimeout> | undefined
    let status = 0
    try {
      const request = operation()
      const timeout = new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          const error = Object.assign(new Error("Catalog request timed out"), { status: 408 })
          reject(error)
          request.cancel?.()
        }, options.timeoutMs ?? 12_000)
      })
      const value = await Promise.race([withApiErrors(request), timeout])
      status = 200
      options.validate?.(value)
      options.observer?.({ operation: options.operation ?? "products", productId: options.productId, attempt, status, durationMs: Date.now() - start })
      return value
    } catch (error) {
      const apiStatus = error && typeof error === "object" && "status" in error ? Number(error.status) : status
      options.observer?.({ operation: options.operation ?? "products", productId: options.productId, attempt, status: apiStatus, durationMs: Date.now() - start, reason: error instanceof CatalogIntegrityError ? error.reason : "request_failed" })
      if (attempt >= 2 || !isTemporaryReadError(error)) throw error
    } finally {
      clearTimeout(timer)
    }
    await (options.wait ?? ((ms) => new Promise<void>((resolve) => setTimeout(resolve, ms))))(600)
  }
}

type PageMetadata = { items?: { id: string }[]; total: number; page: number; page_size: number; pages: number; has_next?: boolean; has_prev?: boolean }

export function validateCatalogPage(page: PageMetadata, expectedPage: number) {
  if (!page || !Array.isArray(page.items) || !Number.isSafeInteger(page.total) || page.total < 0 ||
    !Number.isSafeInteger(page.page_size) || page.page_size < 1 || page.page !== expectedPage ||
    !Number.isSafeInteger(page.pages) || page.pages < 0) throw new CatalogIntegrityError("invalid_page_metadata")
  const expectedPages = Math.ceil(page.total / page.page_size)
  if (page.pages !== expectedPages && !(page.total === 0 && page.pages === 1)) throw new CatalogIntegrityError("inconsistent_page_count")
  if (page.total > 0 && page.page > expectedPages) throw new CatalogIntegrityError("page_out_of_range")
  if (page.has_next !== undefined && page.has_next !== (page.page < expectedPages)) throw new CatalogIntegrityError("inconsistent_has_next")
  if (page.has_prev !== undefined && page.has_prev !== (page.page > 1)) throw new CatalogIntegrityError("inconsistent_has_prev")
  if (page.items.length !== Math.max(0, Math.min(page.page_size, page.total - (page.page - 1) * page.page_size))) throw new CatalogIntegrityError("incomplete_page")
  const ids = page.items.map((item) => item?.id)
  if (ids.some((id) => typeof id !== "string" || !id) || new Set(ids).size !== ids.length) throw new CatalogIntegrityError("invalid_or_duplicate_ids")
}
