import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EmailConfirmedPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <section className="w-full max-w-md text-center space-y-5">
        <CheckCircle2 className="mx-auto h-12 w-12 text-gold" aria-hidden="true" />
        <p className="text-sm uppercase tracking-[0.18em] text-gold">Email confirmed</p>
        <h1 className="text-3xl font-playfair">Your account is active</h1>
        <p className="text-gray-400">
          You can now sign in and continue shopping with Savage Rise.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-gold text-black hover:bg-gold/90">
            <Link href="/">Go to store</Link>
          </Button>
          <Button asChild variant="outline" className="border-gold text-gold hover:bg-gold hover:text-black">
            <Link href="/profile">My profile</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
