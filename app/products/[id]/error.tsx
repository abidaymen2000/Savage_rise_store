"use client"
import { useEffect } from "react"
export default function ProductError({ reset }: { reset: () => void }) {
  useEffect(() => {
    const timer = setTimeout(reset, 15000)
    window.addEventListener("online", reset)
    return () => { clearTimeout(timer); window.removeEventListener("online", reset) }
  }, [reset])
  return <main className="mx-auto max-w-xl px-6 py-20"><h1 className="text-2xl font-semibold">Produit momentanément indisponible</h1><p role="status" className="mt-4">La connexion se rétablit automatiquement. Votre panier est conservé.</p></main>
}
