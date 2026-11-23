"use client"

import { getStorefrontContent } from "@/lib/storefront/content"

export default function Newsletter() {
  const { newsletter } = getStorefrontContent()

  return (
    <section className="border-t border-border bg-muted px-4 py-14 text-foreground dark:bg-gradient-to-r dark:from-[#0b0b0a] dark:to-black dark:text-white sm:px-6 lg:py-20">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_1fr] md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-foreground dark:text-accent">THE INNER CIRCLE</p>
          <h2 className="mt-3 font-playfair text-4xl leading-tight sm:text-5xl">{newsletter.title}</h2>
          <p className="mt-4 max-w-xl leading-7 text-foreground dark:text-stone-200">{newsletter.body}</p>
        </div>
        <p className="max-w-xl leading-7 text-foreground dark:text-stone-200">
          Something exclusive is coming. Stay tuned for early access to our next drops.
        </p>
      </div>
    </section>
  )
}
