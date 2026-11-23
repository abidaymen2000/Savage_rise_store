"use client"
import { useEffect } from "react"
export default function ProductError({ reset }: { reset: () => void }) {
  useEffect(() => {
    const timer = setTimeout(reset, 15000)
    window.addEventListener("online", reset)
    return () => { clearTimeout(timer); window.removeEventListener("online", reset) }
  }, [reset])
  return <main className="mx-auto max-w-xl px-6 py-20"><h1 className="text-2xl font-semibold">Product Temporarily Unavailable</h1><p role="status" className="mt-4">Reconnecting automatically. Your bag is saved.</p></main>
}
