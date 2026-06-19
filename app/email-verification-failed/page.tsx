import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EmailVerificationFailedPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <section className="w-full max-w-md text-center space-y-5">
        <AlertCircle className="mx-auto h-12 w-12 text-red-400" aria-hidden="true" />
        <p className="text-sm uppercase tracking-[0.18em] text-red-300">Verification failed</p>
        <h1 className="text-3xl font-playfair">This link is invalid or expired</h1>
        <p className="text-gray-400">
          Please sign in again and request a new verification email.
        </p>
        <Button asChild className="bg-gold text-black hover:bg-gold/90">
          <Link href="/">Back to store</Link>
        </Button>
      </section>
    </main>
  )
}
