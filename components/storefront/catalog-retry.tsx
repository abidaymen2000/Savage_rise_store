"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function CatalogRetry() {
  const [pending, setPending] = useState(false)
  return <Button disabled={pending} onClick={() => { setPending(true); window.location.reload() }} className="min-h-11 shrink-0 rounded-none bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground">{pending ? "Retrying…" : "Try Again"}</Button>
}
