"use client"

import { useEffect } from "react"
import Link from "next/link"
import { API_BASE_URL } from "@/lib/api"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

export default function VerifyEmailPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get("token")

    if (!token) {
      window.location.replace("/email-verification-failed")
      return
    }

    const verifyUrl = `${API_BASE_URL}/auth/verify-email?token=${encodeURIComponent(token)}`
    window.location.replace(verifyUrl)
  }, [])

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <section className="w-full max-w-md text-center space-y-5">
        <p className="text-sm uppercase tracking-[0.18em] text-accent">Savage Rise</p>
        <h1 className="text-3xl font-playfair">Confirming your email</h1>
        <p className="text-muted-foreground">
          Please wait while we validate your account.
        </p>
        <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Link href="/">Back to store</Link>
        </Button>
      </section>
    </main>
  )
}

