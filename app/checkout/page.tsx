"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Truck, Shield, CreditCard, Loader2, Ticket, X } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api"
import AuthModal from "@/app/components/AuthModal"
import EmailVerificationModal from "@/app/components/EmailVerificationModal"
import Image from "next/image"
import Link from "next/link"
import type { ShippingInfo, OrderItem, ApplyResponse } from "@/types/api"

const SHIPPING_THRESHOLD = 300
const SHIPPING_COST = 7
const PROMO_STORAGE_KEY = "savage_rise_promo_code"

export default function CheckoutPage() {
  const router = useRouter()
  const { state: cartState, clearCart } = useCart()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()

  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showEmailVerification, setShowEmailVerification] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    full_name: "",
    email: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    postal_code: "",
    city: "",
    country: "Tunisie",
  })

  // --- Promo state ---
  const [promoCode, setPromoCode] = useState<string | null>(null)
  const [promoResult, setPromoResult] = useState<ApplyResponse | null>(null)
  const [promoLoading, setPromoLoading] = useState(false)
  const [promoError, setPromoError] = useState<string | null>(null)

  // Redirect if cart is empty
  useEffect(() => {
    if (cartState.items.length === 0 && !authLoading) {
      router.push("/products")
    }
  }, [cartState.items.length, authLoading, router])

  // Pre-fill shipping info if user is logged in
  useEffect(() => {
    if (user) {
      setShippingInfo((prev) => ({
        ...prev,
        email: user.email,
        full_name: user.full_name || "",
      }))
    }
  }, [user])

  // Convert cart items to OrderItem[] (pour API)
  const orderItems: OrderItem[] = useMemo(
    () =>
      cartState.items.map((item) => ({
        product_id: item.product.id,
        color: item.selectedVariant.color,
        size: item.selectedSize,
        qty: item.quantity,
        unit_price: item.product.price,
      })),
    [cartState.items]
  )

  // (Re)valider un code promo sauvegardé
  const revalidatePromo = async (code: string) => {
    if (!code || orderItems.length === 0) return
    setPromoLoading(true)
    setPromoError(null)
    try {
      const res = await api.applyPromo(code, orderItems)
      setPromoResult(res)
      setPromoCode(res.valid ? code : null)
      if (!res.valid) {
        localStorage.removeItem(PROMO_STORAGE_KEY)
      }
    } catch {
      setPromoError("Impossible de valider le code promo pour le moment.")
    } finally {
      setPromoLoading(false)
    }
  }

  // Charger et valider le code promo stocké quand on arrive sur le checkout
  useEffect(() => {
    const saved = localStorage.getItem(PROMO_STORAGE_KEY)
    if (saved) {
      setPromoCode(saved)
      revalidatePromo(saved)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Si le panier change (quantités), on revalide le code
  useEffect(() => {
    if (promoCode) revalidatePromo(promoCode)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderItems.map((i) => `${i.product_id}-${i.size}-${i.qty}`).join("|")])

  const handleRemovePromo = () => {
    setPromoCode(null)
    setPromoResult(null)
    localStorage.removeItem(PROMO_STORAGE_KEY)
  }

  const handleInputChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo((prev) => ({ ...prev, [field]: value }))
  }

  const validateShippingInfo = (): boolean => {
    const required = ["full_name", "email", "phone", "address_line1", "postal_code", "city", "country"]
    return required.every((field) => shippingInfo[field as keyof ShippingInfo]?.toString().trim())
  }

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }

    if (!user?.is_active) {
      setShowEmailVerification(true)
      return
    }

    if (!validateShippingInfo()) {
      setError("Veuillez remplir tous les champs obligatoires")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const order = await api.createOrder(orderItems, shippingInfo, promoCode ?? undefined)

      setSuccess(true)
      clearCart()
      localStorage.removeItem(PROMO_STORAGE_KEY)

      setTimeout(() => {
        router.push(`/profile/orders/${order.id}`)
      }, 2000)
    } catch (err) {
      console.error("Order creation failed:", err)
      setError(err instanceof Error ? err.message : "Erreur lors de la création de la commande")
    } finally {
      setIsProcessing(false)
    }
  }

  // Totaux
  const subtotal = useMemo(
    () => orderItems.reduce((s, it) => s + it.qty * it.unit_price, 0),
    [orderItems]
  )

  const discount = promoResult?.valid ? promoResult.discount_value ?? 0 : 0
  const afterDiscount = Math.max(0, subtotal - discount)
  const shipping = afterDiscount >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const total = afterDiscount + shipping

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement...</p>
        </div>
      </div>
    )
  }

  if (cartState.items.length === 0) return null // redirect déjà programmé

  if (success) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Commande confirmée !</h1>
          <p className="text-gray-400 mb-4">
            Votre commande a été créée avec succès. Vous allez être redirigé vers les détails de votre commande.
          </p>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gold mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/products" className="flex items-center text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continuer mes achats
          </Link>
          <h1 className="text-3xl font-playfair font-bold">Finaliser ma commande</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Récapitulatif de commande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartState.items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedVariant.color}-${item.selectedSize}`}
                    className="flex gap-4"
                  >
                    <div className="w-16 h-16 relative overflow-hidden rounded-lg bg-gray-800">
                      <Image
                        src={item.selectedVariant.images[0]?.url || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{item.product.name}</h3>
                      <p className="text-sm text-gray-400">
                        {item.selectedVariant.color} • {item.selectedSize} • Qté: {item.quantity}
                      </p>
                      <p className="text-gold font-semibold">{(item.product.price * item.quantity).toFixed(2)} TND</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Shipping Form */}
            <Card className="bg-gray-900 border-gray-800 mt-6">
              <CardHeader>
                <CardTitle className="text-white">Informations de livraison</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name">Nom complet *</Label>
                    <Input
                      id="full_name"
                      value={shippingInfo.full_name}
                      onChange={(e) => handleInputChange("full_name", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input
                    id="phone"
                    value={shippingInfo.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="+216 XX XXX XXX"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="address_line1">Adresse *</Label>
                  <Input
                    id="address_line1"
                    value={shippingInfo.address_line1}
                    onChange={(e) => handleInputChange("address_line1", e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="address_line2">Complément d'adresse</Label>
                  <Input
                    id="address_line2"
                    value={shippingInfo.address_line2 || ""}
                    onChange={(e) => handleInputChange("address_line2", e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Appartement, étage, etc."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="postal_code">Code postal *</Label>
                    <Input
                      id="postal_code"
                      value={shippingInfo.postal_code}
                      onChange={(e) => handleInputChange("postal_code", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Ville *</Label>
                    <Input
                      id="city"
                      value={shippingInfo.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Pays *</Label>
                    <Input
                      id="country"
                      value={shippingInfo.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Total */}
          <div>
            <Card className="bg-gray-900 border-gray-800 sticky top-24">
              <CardHeader>
                <CardTitle className="text-white">Total de la commande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Sous-total</span>
                  <span className="text-white">{subtotal.toFixed(2)} TND</span>
                </div>

                {/* Ligne remise si code valide */}
                {promoResult?.valid && (
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2 text-green-500">
                      <Ticket className="h-4 w-4" />
                      <span>Code {promoResult.code}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-green-500">- { (promoResult.discount_value ?? 0).toFixed(2) } TND</span>
                      <button
                        className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
                        onClick={handleRemovePromo}
                        disabled={promoLoading}
                        title="Retirer le code"
                      >
                        <X className="h-3 w-3" /> Retirer
                      </button>
                    </div>
                  </div>
                )}

                {/* Erreur promo éventuelle */}
                {promoError && (
                  <Alert className="border-red-600 bg-red-900/20">
                    <AlertDescription className="text-red-400">{promoError}</AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-400">Livraison</span>
                  <span className="text-white">{shipping === 0 ? "Gratuite" : `${SHIPPING_COST.toFixed(2)} TND`}</span>
                </div>

                <Separator className="bg-gray-700" />

                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-white">Total</span>
                  <span className="text-gold">{total.toFixed(2)} TND</span>
                </div>

                {error && (
                  <Alert className="border-red-600 bg-red-900/20">
                    <AlertDescription className="text-red-400">{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Truck className="h-4 w-4" />
                    <span>Livraison gratuite dès {SHIPPING_THRESHOLD}TND</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Shield className="h-4 w-4" />
                    <span>Paiement sécurisé</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <CreditCard className="h-4 w-4" />
                    <span>Paiement à la livraison</span>
                  </div>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || promoLoading}
                  className="w-full bg-gold text-black hover:bg-gold/90 font-semibold py-3"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Traitement...
                    </>
                  ) : (
                    `Confirmer la commande • ${total.toFixed(2)} TND`
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  En confirmant votre commande, vous acceptez nos conditions de vente.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} defaultTab="login" />

      {/* Email Verification Modal */}
      <EmailVerificationModal
        isOpen={showEmailVerification}
        onClose={() => setShowEmailVerification(false)}
        email={user?.email || ""}
      />
    </div>
  )
}
