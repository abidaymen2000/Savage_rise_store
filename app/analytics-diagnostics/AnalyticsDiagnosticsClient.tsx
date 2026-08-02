"use client"

import { useState } from "react"
import { getStorefrontAnalyticsUrl } from "@/lib/api/analytics-api"
import { trackInternalEvent } from "@/lib/store-analytics"

type DiagnosticResult = {
  endpoint: string
  status: string
  response: string
}

function getSafeError(error: unknown) {
  if (error && typeof error === "object") {
    const maybeError = error as { status?: unknown; response?: unknown; message?: unknown }
    return {
      status: typeof maybeError.status === "number" ? String(maybeError.status) : "network_error",
      response: typeof maybeError.response === "string" ? maybeError.response : String(maybeError.message ?? "Analytics request failed"),
    }
  }
  return {
    status: "network_error",
    response: "Analytics request failed",
  }
}

export default function AnalyticsDiagnosticsClient() {
  const [result, setResult] = useState<DiagnosticResult | null>(null)
  const [isSending, setIsSending] = useState(false)

  async function sendDiagnosticEvent() {
    setIsSending(true)
    const endpoint = getStorefrontAnalyticsUrl()
    const event = trackInternalEvent("page_view", {
      page_path: window.location.pathname,
      page_title: document.title,
      currency: "TND",
      deduplication_key: `diagnostic:${Date.now()}`,
      metadata: {
        diagnostic: true,
      },
      throw_errors: true,
    })

    try {
      const response = (await event.request) as { status?: number; response?: string } | undefined
      setResult({
        endpoint,
        status: String(response?.status ?? "sent"),
        response: response?.response ?? "",
      })
    } catch (error) {
      const safeError = getSafeError(error)
      setResult({
        endpoint,
        status: safeError.status,
        response: safeError.response,
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <main className="min-h-screen bg-background px-6 py-24 text-foreground">
      <section className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold">Savage Rise analytics diagnostics</h1>
        <p className="mt-3 text-sm text-muted-foreground">Development-only endpoint check for internal storefront analytics.</p>
        <button
          type="button"
          onClick={sendDiagnosticEvent}
          disabled={isSending}
          className="mt-6 rounded bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-60"
        >
          {isSending ? "Sending..." : "Send diagnostic page_view"}
        </button>
        {result && (
          <pre className="mt-6 overflow-auto rounded border border-border bg-muted p-4 text-xs">
{`endpoint=${result.endpoint}
status=${result.status}
response=${result.response}`}
          </pre>
        )}
      </section>
    </main>
  )
}
