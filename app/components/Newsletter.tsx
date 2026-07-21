"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { trackEvent } from "@/lib/store-analytics"

export default function Newsletter() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    trackEvent("button_clicked", {
      metadata: {
        action: "newsletter_submitted",
      },
    })
    setEmail("")
  }

  return (
    <section className="py-20 bg-[var(--surface-secondary)] text-[var(--foreground)] dark:bg-gradient-to-r dark:from-gray-900 dark:to-black theme-aware-secondary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">STAY INFORMED</h2>
        <p className="text-[var(--muted-foreground)] dark:text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
          Be the first to discover our new collections, exclusive events, and privileged offers.
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col gap-4 sm:flex-row">
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[#77716A] focus-visible:ring-gold dark:bg-white/10 dark:border-white/20 dark:text-white dark:placeholder:text-gray-400"
            required
          />
          <Button type="submit" className="bg-gold text-black hover:bg-gold/90 font-semibold px-8">
            SUBSCRIBE
          </Button>
        </form>

        <p className="text-[var(--muted-foreground)] dark:text-gray-500 text-sm mt-4">
          By subscribing, you agree to receive our marketing communications.
        </p>
      </div>
    </section>
  )
}
