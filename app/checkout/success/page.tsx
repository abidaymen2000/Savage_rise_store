"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { AlertCircle, ArrowLeft, Loader2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/api"
import type { Order } from "@/types/api"
import { formatPrice } from "@/lib/utils"

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order_id")

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function fetchOrder() {
      if (!orderId) {
        setError("Missing order reference.")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const nextOrder = await api.getOrder(orderId)
        if (isMounted) {
          setOrder(nextOrder)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Unable to load your order.")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void fetchOrder()

    return () => {
      isMounted = false
    }
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-24 text-white">
        <div className="container mx-auto flex items-center justify-center px-4 py-20">
          <div className="text-center">
            <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-gold" />
            <p className="text-gray-400">Loading your confirmed order...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-black pt-24 text-white">
        <div className="container mx-auto px-4 py-16">
          <Card className="mx-auto max-w-xl border-red-900/50 bg-gray-950">
            <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
              <AlertCircle className="h-10 w-10 text-red-400" />
              <div>
                <p className="text-lg font-semibold text-white">Order unavailable</p>
                <p className="mt-2 text-sm text-gray-400">{error || "We could not find that order."}</p>
              </div>
              <Button asChild className="bg-gold text-black hover:bg-gold/90">
                <Link href="/products">Continue shopping</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-24 text-white">
      <div className="container mx-auto px-4 py-12">
        <Card className="mx-auto max-w-2xl border-gold/20 bg-gray-950">
          <CardHeader>
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-green-500/10 p-4 text-green-400">
                <ShieldCheck className="h-10 w-10" />
              </div>
            </div>
            <CardTitle className="text-center text-3xl text-white">Order confirmed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 text-center">
            <p className="text-gray-300">
              Your order <span className="font-semibold text-white">#{order.id.slice(-8)}</span> has been created successfully.
            </p>
            <p className="text-sm text-gray-400">
              Payment method: {order.payment_method === "cod" ? "Cash on delivery" : order.payment_method}
            </p>
            <div className="rounded-lg border border-white/10 bg-black/30 p-4 text-left">
              <p className="text-sm text-gray-400">Shipping to</p>
              <p className="mt-1 font-medium text-white">{order.shipping.full_name}</p>
              <p className="text-sm text-gray-300">
                {order.shipping.address_line1}
                {order.shipping.address_line2 ? `, ${order.shipping.address_line2}` : ""}
              </p>
              <p className="text-sm text-gray-300">
                {order.shipping.postal_code} {order.shipping.city}, {order.shipping.country}
              </p>
              <p className="mt-3 text-sm text-gray-400">Total confirmed by backend</p>
              <p className="text-xl font-semibold text-gold">{formatPrice(order.total_amount)}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              {!order.is_guest && (
                <Button asChild className="bg-gold text-black hover:bg-gold/90">
                  <Link href={`/profile/orders/${order.id}`}>View order details</Link>
                </Button>
              )}
              <Button asChild variant="outline" className="border-white/15 bg-transparent text-white hover:bg-white/5">
                <Link href="/products">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continue shopping
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black pt-24 text-white">
          <div className="container mx-auto flex items-center justify-center px-4 py-20">
            <div className="text-center">
              <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-gold" />
              <p className="text-gray-400">Loading your confirmed order...</p>
            </div>
          </div>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  )
}
