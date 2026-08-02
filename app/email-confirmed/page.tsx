import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EmailConfirmedPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <section className="w-full max-w-md text-center space-y-5">
        <CheckCircle2 className="mx-auto h-12 w-12 text-accent" aria-hidden="true" />
        <p className="text-sm uppercase tracking-[0.18em] text-accent">Email confirmed</p>
        <h1 className="text-3xl font-playfair">Your account is active</h1>
        <p className="text-muted-foreground">
          You can now sign in and continue shopping with Savage Rise.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/">Go to store</Link>
          </Button>
          <Button asChild variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
            <Link href="/profile">My profile</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}


