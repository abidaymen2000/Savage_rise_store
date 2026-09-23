"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function CatalogError({ error, reset }: { error?: Error & { digest?: string }; reset?: () => void }) {
  const router = useRouter()
  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-32 text-foreground sm:px-6">
      <section role="alert" className="mx-auto max-w-3xl border border-border bg-card p-8 text-center">
        <h1 className="text-2xl font-semibold">La boutique est momentanément indisponible</h1>
        <p className="mt-3 text-muted-foreground">Nous ne pouvons pas charger les produits et leurs disponibilités. Réessayez dans quelques instants. Votre panier est conservé.</p>
        {error?.digest && <p className="mt-3 text-xs text-muted-foreground">Référence : {error.digest}</p>}
        <Button onClick={() => { router.refresh(); reset?.() }} className="mt-5 rounded-none">Réessayer</Button>
        <Link href="/contact" className="ml-5 underline">Nous contacter</Link>
      </section>
    </main>
  )
}
