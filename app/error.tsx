"use client"
import { useEffect } from "react"
import { studioOrigin } from "@/lib/preview-access"
export default function StoreError({ reset }: { reset: () => void }) {
  useEffect(() => { const origin = studioOrigin(); if (origin && window.parent !== window) window.parent.postMessage({ type: "yovo:store-preview-error", code: "PREVIEW_UNAVAILABLE", status: 503, stage: "exchange" }, origin) }, [])
  return <main className="mx-auto max-w-xl px-6 py-32"><h1 className="text-2xl font-semibold">La boutique est momentanément indisponible.</h1><p className="my-5">Vos informations restent dans votre navigateur. Réessayez dans un instant.</p><button className="min-h-11 rounded border px-6" onClick={reset}>Réessayer</button></main>
}
