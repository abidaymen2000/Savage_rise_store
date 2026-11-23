import { randomUUID } from "node:crypto"
import { getStorefrontHeaders } from "@/lib/api/gateway-config.mjs"
import type { CatalogObservation, CatalogObserver } from "@/lib/catalog-read"

/** One summary per anomalous render; opt in to successful summaries when diagnosing.
 * No query text, tokens, customer data, API bodies or cross-request cache. */
export function createCatalogDiagnostics(route: string) {
  const started = Date.now()
  const events: CatalogObservation[] = []
  const requestId = randomUUID()
  let apiPages = 0, announcedTotal: number | undefined
  const observe: CatalogObserver = (event) => {
    if (event.operation === "products" && event.attempt) apiPages++
    if (event.operation === "page" || event.operation === "listing") announcedTotal = event.total
    if (events.length < 200) events.push(event)
  }
  return {
    observe,
    finish(summary: { outcome: "complete" | "unavailable"; loaded: number; categoriesAvailable: boolean; excluded?: Record<string, number>; shown?: number }) {
      const anomalies = events.filter((event) => event.reason)
      if (!anomalies.length && summary.outcome === "complete" && summary.categoriesAvailable && process.env.CATALOG_DIAGNOSTICS !== "1") return
      const payload = {
        event: "storefront_catalog", requestId, tenant: getStorefrontHeaders()["X-Store-Domain"], route,
        durationMs: Date.now() - started, apiPages, announcedTotal, ...summary,
        listedPages: events.filter((event) => event.operation === "listing"),
        fallback: !summary.categoriesAvailable ? "unfiltered_catalog" : "none",
        missingIds: [...new Set(events.flatMap((event) => event.missingIds ?? []))],
        reads: events.filter((event) => event.attempt).map(({ operation, attempt, status, durationMs, reason }) => ({ operation, attempt, status, durationMs, reason })),
        anomalies,
      }
      if (anomalies.length || summary.outcome === "unavailable" || !summary.categoriesAvailable) console.warn(JSON.stringify(payload))
      else console.info(JSON.stringify(payload))
    },
  }
}
