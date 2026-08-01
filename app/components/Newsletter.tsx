"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getStorefrontContent } from "@/lib/storefront/content"
import { trackStoreEvent } from "@/lib/store-analytics"

export default function Newsletter() {
  const { newsletter } = getStorefrontContent()
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "disabled">("idle")
  const [message, setMessage] = useState("L'inscription newsletter sera activee prochainement.")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setStatus("error")
      setMessage("Entre une adresse email valide.")
      return
    }

    setStatus("loading")
    trackStoreEvent("form_submitted", {
      event_category: "newsletter",
      action_target: "homepage_newsletter",
      metadata: { provider: "pending" },
    })
    window.setTimeout(() => {
      setStatus("disabled")
      setMessage("Merci. L'inscription automatique n'est pas encore connectee; suis Instagram pour les Drops en attendant.")
    }, 350)
  }

  return (
    <section className="border-t border-stone-800 bg-[var(--surface-secondary)] px-4 py-14 text-[var(--foreground)] dark:bg-gradient-to-r dark:from-[#0b0b0a] dark:to-black dark:text-white sm:px-6 lg:py-20">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_1fr] md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D4AF37]">Newsletter</p>
          <h2 className="mt-3 font-playfair text-4xl leading-tight sm:text-5xl">{newsletter.title}</h2>
          <p className="mt-4 max-w-xl leading-7 text-stone-300">{newsletter.body}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          <label htmlFor="newsletter-email" className="sr-only">Email</label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="email@example.com"
              className="h-12 rounded-none border-stone-700 bg-black text-white placeholder:text-stone-500"
              aria-describedby="newsletter-status"
            />
            <Button type="submit" disabled={status === "loading"} className="h-12 rounded-none bg-white px-6 text-xs font-semibold uppercase tracking-[0.16em] text-black hover:bg-[#D4AF37]">
              {status === "loading" ? "Verification" : "Recevoir les Drops"}
            </Button>
          </div>
          <p id="newsletter-status" role={status === "error" ? "alert" : "status"} className={`text-sm ${status === "error" ? "text-red-300" : "text-stone-400"}`}>
            {message}
          </p>
        </form>
      </div>
    </section>
  )
}
