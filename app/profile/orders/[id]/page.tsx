"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Package, MapPin, Phone, Mail, CalendarDays, DollarSign, TicketPercent, Truck } from "lucide-react"
import { api } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"
import type { Order, Product } from "@/types/api"
import { formatPrice } from "@/lib/utils"

const SHIPPING_THRESHOLD = 300
const SHIPPING_COST = 7

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // map produit_id -> Product (pour nom + images)
  const [productMap, setProductMap] = useState<Record<string, Product | null>>({})

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/")
      return
    }
    if (isAuthenticated && orderId) {
      fetchOrderDetails()
    }
  }, [orderId, isAuthenticated, authLoading, router])

  const fetchOrderDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.getMyOrder(orderId)
      setOrder(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement des détails de la commande")
    } finally {
      setLoading(false)
    }
  }

  // Récupérer les produits pour afficher nom + image (variante couleur si possible)
  useEffect(() => {
    const loadProducts = async () => {
      if (!order) return
      const ids = Array.from(new Set(order.items.map((i) => i.product_id)))
      const results = await Promise.all(ids.map((id) => api.getProduct(id).catch(() => null)))
      const map: Record<string, Product | null> = {}
      ids.forEach((id, idx) => (map[id] = results[idx]))
      setProductMap(map)
    }
    loadProducts()
  }, [order])

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending": return "bg-yellow-600"
      case "confirmed": return "bg-blue-600"
      case "shipped": return "bg-purple-600"
      case "delivered": return "bg-green-600"
      case "cancelled": return "bg-red-600"
      default: return "bg-gray-600"
    }
  }

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "pending": return "En attente"
      case "confirmed": return "Confirmée"
      case "shipped": return "Expédiée"
      case "delivered": return "Livrée"
      case "cancelled": return "Annulée"
      default: return status
    }
  }

  const handleCancelOrder = async (id: string) => {
    try {
      await api.cancelOrder(id)
      router.push("/profile?tab=orders")
    } catch (error) {
      console.error("Error cancelling order:", error)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement des détails de la commande...</p>
        </div>
      </div>
    )
  }
  if (error || !order) {
    return (
      <div className="min-h-screen bg-black text-white pt-20">
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-red-400 mb-4">Erreur: {error || "Commande non trouvée"}</p>
          <Link href="/profile?tab=orders">
            <Button className="bg-gold text-black hover:bg-gold/90">Retour à mes commandes</Button>
          </Link>
        </div>
      </div>
    )
  }

  // ---- Totaux & affichage fiables (alignés au backend) ----
  const subtotal = order.subtotal ?? order.items.reduce((s, it) => s + it.unit_price * it.qty, 0)
  const discountValue = order.discount_value ?? 0
  const afterDiscount = Math.max(0, subtotal - discountValue)

  // Utilise la valeur de la DB si dispo, sinon on recalcule comme fallback
  const shippingAmount =
    (order as any).shipping_amount ?? (afterDiscount >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST)

  // ATTENTION: total_amount côté backend inclut déjà la livraison.
  const grandTotal =
    order.total_amount ?? afterDiscount + shippingAmount

  const hasPromo = (order.promo_code && discountValue > 0) || discountValue > 0.0001
  const promoLabel = order.promo_code ? `Code promo ${order.promo_code}` : "Remise"

  // ---- Helpers d'affichage produit ----
  const productName = (product_id: string) =>
    productMap[product_id]?.name ?? `Produit ${product_id}`

  const productImage = (product_id: string, color: string | undefined) => {
    const p = productMap[product_id]
    if (!p) return { url: "/placeholder.svg?height=80&width=80", alt: `Produit ${product_id}` }
    const variant =
      p.variants?.find((v) => v.color?.toLowerCase() === (color || "").toLowerCase()) ||
      p.variants?.[0]
    const img = variant?.images?.[0]
    return {
      url: img?.url ?? "/placeholder.svg?height=80&width=80",
      alt: img?.alt_text || p.name || `Produit ${product_id}`,
    }
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/profile?tab=orders" className="flex items-center text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à mes commandes
          </Link>
          <h1 className="text-3xl font-playfair font-bold">Détails de la commande #{order.id.slice(-8)}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche */}
          <div className="lg:col-span-2">
            {/* Produits */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Package className="h-5 w-5 text-gold" />
                  Produits commandés
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item, index) => {
                  const { url, alt } = productImage(item.product_id, item.color)
                  return (
                    <div key={index} className="flex gap-4 items-center">
                      <div className="w-16 h-16 relative overflow-hidden rounded-lg bg-gray-800">
                        <Image src={url} alt={alt} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{productName(item.product_id)}</h3>
                        <p className="text-sm text-gray-400">
                          Couleur: {item.color} • Taille: {item.size} • Qté: {item.qty}
                        </p>
                        <p className="text-gold font-semibold">{formatPrice(item.unit_price * item.qty)}</p>
                      </div>
                    </div>
                  )
                })}

                {/* Résumé paiement (avec remise + livraison) */}
                <Separator className="bg-gray-700" />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Sous-total</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>

                  {hasPromo && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-400 flex items-center gap-2">
                        <TicketPercent className="h-4 w-4" />
                        {promoLabel}
                        {order.promo_code ? (
                          <Badge className="bg-green-700/40 text-green-300">{order.promo_code}</Badge>
                        ) : null}
                      </span>
                      <span className="text-green-400">- {formatPrice(discountValue)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Livraison
                    </span>
                    <span>{shippingAmount === 0 ? "Gratuite" : formatPrice(shippingAmount)}</span>
                  </div>

                  <Separator className="bg-gray-700" />
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-white">Total (articles + livraison)</span>
                    <span className="text-gold">{formatPrice(grandTotal)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Livraison */}
            <Card className="bg-gray-900 border-gray-800 mt-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gold" />
                  Informations de livraison
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-300">
                <p><strong>Nom complet:</strong> {order.shipping.full_name}</p>
                <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> {order.shipping.email}</p>
                <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> {order.shipping.phone}</p>
                <p>
                  {order.shipping.address_line1}
                  {order.shipping.address_line2 && `, ${order.shipping.address_line2}`}
                  <br />
                  {order.shipping.postal_code} {order.shipping.city}, {order.shipping.country}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <Card className="bg-gray-900 border-gray-800 sticky top-24">
              <CardHeader>
                <CardTitle className="text-white">Statut de la commande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className={`${getStatusColor(order.status)} text-white text-base px-3 py-1`}>
                    {getStatusText(order.status)}
                  </Badge>
                  {hasPromo && (
                    <Badge variant="outline" className="border-green-600 text-green-400 flex items-center gap-1">
                      <TicketPercent className="h-4 w-4" />
                      {order.promo_code ? `Promo ${order.promo_code}` : "Remise appliquée"}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 text-gray-300">
                  <CalendarDays className="h-4 w-4" />
                  <span>Date de commande: {new Date(order.created_at).toLocaleDateString("fr-FR")}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <DollarSign className="h-4 w-4" />
                  <span>
                    Méthode de paiement: {order.payment_method === "cod" ? "Paiement à la livraison" : order.payment_method}
                  </span>
                </div>

                <Separator className="bg-gray-700" />
                <p className="text-sm text-gray-400">
                  Vous recevrez des mises à jour par email concernant l'état de votre commande.
                </p>

                {order.status === "pending" && (
                  <Button
                    variant="outline"
                    className="w-full border-red-600 text-red-400 hover:bg-red-900/20"
                    onClick={() => handleCancelOrder(order.id)}
                  >
                    Annuler la commande
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
