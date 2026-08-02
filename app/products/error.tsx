"use client"

import { Button } from "@/components/ui/button"

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-32 text-foreground sm:px-6">
      <div className="mx-auto max-w-3xl border border-red-900/50 bg-red-950/20 p-8 text-center">
        <p className="text-red-200">{error.message || "Impossible de charger le catalogue."}</p>
        <Button onClick={reset} className="mt-5 rounded-none bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground">Reessayer</Button>
      </div>
    </main>
  )
}

