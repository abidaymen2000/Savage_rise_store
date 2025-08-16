"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { ShoppingBag, Plus, Minus, X, Truck, Ticket, Loader2, ChevronDown } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import AuthModal from "@/app/components/AuthModal"
import { api } from "@/lib/api"
import type { OrderItem, ApplyResponse } from "@/types/api"

export default function Cart() {
  const router = useRouter()
  const { state, updateQuantity, removeFromCart } = useCart()
  const { isAuthenticated } = useAuth()

  const [isOpen, setIsOpen] = useState(false)

  // Auth modal
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Promo state
  const [promoInput, setPromoInput] = useState("")
  const [promo, setPromo] = useState<ApplyResponse | null>(null)
  const [promoLoading, setPromoLoading] = useState(false)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [showPromo, setShowPromo] = useState(false)

  // Items -> OrderItem[]
  const orderItems: OrderItem[] = useMemo(
    () =>
      state.items.map((it) => ({
        product_id: it.product.id,
        color: it.selectedVariant.color,
        size: it.selectedSize,
        qty: it.quantity,
        unit_price: it.product.price,
      })),
    [state.items]
  )

  // Signature du panier pour revalidation
  const cartSignature = useMemo(
    () => orderItems.map((i) => `${i.product_id}-${i.color}-${i.size}-${i.qty}`).join("|"),
    [orderItems]
  )

  // Totaux
  const subtotal = useMemo(() => orderItems.reduce((s, it) => s + it.qty * it.unit_price, 0), [orderItems])
  const discount = promo?.valid ? promo.discount_value ?? 0 : 0
  const totalAfterDiscount = Math.max(0, subtotal - discount)

  const SHIPPING_THRESHOLD = 300
  const SHIPPING_COST = 7
  const shipping = totalAfterDiscount >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const grandTotal = totalAfterDiscount + shipping

  const handleQuantityChange = (productId: string, color: string, size: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, color, size)
    } else {
      updateQuantity(productId, color, size, newQuantity)
    }
  }

  const getItemImage = (item: (typeof state.items)[0]) => {
    if (item.selectedVariant?.images?.length) return item.selectedVariant.images[0].url
    if (item.product.variants?.length && item.product.variants[0].images?.length) return item.product.variants[0].images[0].url
    return "/placeholder.svg?height=80&width=80"
  }

  const getItemImageAlt = (item: (typeof state.items)[0]) => {
    if (item.selectedVariant?.images?.length) return item.selectedVariant.images[0].alt_text || item.product.name
    return item.product.name
  }

  // Flags d’affichage
  const alreadyUsed = !!promo && !promo.valid && promo.reason === "per_user_limit_reached"
  const loginRequired = !!promo && !promo.valid && promo.reason === "login_required"
  const maxReached = !!promo && !promo.valid && promo.reason === "max_uses_reached"
  const isPromoError = alreadyUsed || loginRequired || maxReached

  // Appliquer / revalider le code promo
  const applyPromo = async (code: string) => {
    const normalized = code.trim().toUpperCase()
    if (!normalized) return

    setPromoLoading(true)
    setPromoError(null)
    try {
      const res = await api.applyPromo(normalized, orderItems) // nécessite Authorization dans lib/api
      setPromo(res)
      setPromoInput(normalized)
      if (res.valid) {
        localStorage.setItem("savage_rise_promo_code", normalized)
      } else {
        localStorage.removeItem("savage_rise_promo_code")
        if (res.reason === "login_required") {
          setShowPromo(true)
          setShowAuthModal(true)
        }
      }
    } catch {
      setPromoError("Impossible d'appliquer le code. Réessaie.")
    } finally {
      setPromoLoading(false)
    }
  }

  const clearPromo = () => {
    setPromo(null)
    setPromoError(null)
    localStorage.removeItem("savage_rise_promo_code")
  }

  // Réappliquer un code sauvegardé quand le panier change
  useEffect(() => {
    const saved = localStorage.getItem("savage_rise_promo_code")
    if (saved && state.items.length > 0) {
      applyPromo(saved)
    } else if (!saved) {
      clearPromo()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartSignature])

  // ✅ PATCH: si l’utilisateur vient de se connecter, revalider le code immédiatement
  useEffect(() => {
    if (isAuthenticated) {
      const saved = localStorage.getItem("savage_rise_promo_code") || promoInput
      if (saved) applyPromo(saved)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  // Quand l’utilisateur se connecte via le modal, on file sur /checkout
  useEffect(() => {
    if (showAuthModal && isAuthenticated) {
      setShowAuthModal(false)
      router.push("/checkout")
    }
  }, [isAuthenticated, showAuthModal, router])

  const handleProceed = () => {
    setIsOpen(false)
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }
    router.push("/checkout")
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-white hover:text-gold relative">
            <ShoppingBag className="h-5 w-5" />
            {state.itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {state.itemCount}
              </span>
            )}
          </Button>
        </SheetTrigger>

        <SheetContent className="bg-black text-white border-gray-800 w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="text-white font-playfair text-2xl">Panier ({state.itemCount})</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col h-full">
            {state.items.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <ShoppingBag className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg mb-2">Votre panier est vide</p>
                  <p className="text-gray-500 text-sm">Ajoutez des produits pour commencer vos achats</p>
                </div>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto py-6 space-y-6">
                  {state.items.map((item) => {
                    const cartKey = `${item.product.id}-${item.selectedVariant.color}-${item.selectedSize}`
                    const imageUrl = getItemImage(item)
                    const imageAlt = getItemImageAlt(item)

                    return (
                      <div key={cartKey} className="flex gap-4">
                        <div className="w-20 h-20 relative overflow-hidden rounded-lg bg-gray-900">
                          <Image src={imageUrl || "/placeholder.svg"} alt={imageAlt} fill className="object-cover" />
                        </div>

                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-sm line-clamp-2">{item.product.name}</h3>
                              <p className="text-xs text-gray-400">Couleur: {item.selectedVariant.color}</p>
                              <p className="text-xs text-gray-400">Taille: {item.selectedSize}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-gray-400 hover:text-white"
                              onClick={() => removeFromCart(item.product.id, item.selectedVariant.color, item.selectedSize)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.product.id,
                                    item.selectedVariant.color,
                                    item.selectedSize,
                                    item.quantity - 1
                                  )
                                }
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.product.id,
                                    item.selectedVariant.color,
                                    item.selectedSize,
                                    item.quantity + 1
                                  )
                                }
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="font-semibold text-gold">{(item.product.price * item.quantity).toFixed(2)} TND</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <Separator className="bg-gray-800" />

                {/* Promo code (toggle) */}
                <div className="py-2">
                  <button
                    type="button"
                    onClick={() => setShowPromo((v) => !v)}
                    aria-expanded={showPromo}
                    className={`w-full flex items-center justify-between rounded-md px-1 py-2 transition ${
                      isPromoError ? "bg-red-900/20" : "hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Ticket className={`h-4 w-4 ${isPromoError ? "text-red-400" : "text-gold"}`} />
                      <span className={`text-sm ${isPromoError ? "text-red-400" : "text-gray-300"}`}>Code promo</span>

                      {promo?.valid && <span className="ml-2 text-xs text-green-400">{promo.code} appliqué</span>}
                      {alreadyUsed && <span className="ml-2 text-xs text-red-400">{promo?.code || promoInput} déjà utilisé</span>}
                      {loginRequired && <span className="ml-2 text-xs text-red-400">connexion requise</span>}
                      {maxReached && <span className="ml-2 text-xs text-red-400">quota atteint</span>}
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform text-gray-400 ${showPromo ? "rotate-180" : ""}`} />
                  </button>

                  {/* zone repliable */}
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                      showPromo ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="pt-3 space-y-3">
                        {!promo?.valid ? (
                          <>
                            <form
                              className="flex gap-2"
                              onSubmit={(e) => {
                                e.preventDefault()
                                applyPromo(promoInput)
                              }}
                            >
                              <Input
                                value={promoInput}
                                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                                placeholder="ENTREZ VOTRE CODE"
                                className={`bg-transparent text-white placeholder:text-gray-500 ${
                                  isPromoError ? "border-red-600 focus-visible:ring-red-600" : "border-gray-700"
                                }`}
                              />
                              <Button
                                type="submit"
                                disabled={promoLoading}
                                className={isPromoError ? "bg-red-600 hover:bg-red-700" : "bg-gold text-black hover:bg-gold/90"}
                              >
                                {promoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Appliquer"}
                              </Button>
                            </form>

                            {/* messages d’erreur */}
                            {alreadyUsed && <p className="text-sm text-red-400">Ce code a déjà été utilisé par votre compte.</p>}
                            {loginRequired && (
                              <p className="text-sm text-red-400">
                                Connectez-vous pour utiliser ce code.{" "}
                                <button className="underline hover:opacity-80" onClick={() => setShowAuthModal(true)}>
                                  Se connecter
                                </button>
                              </p>
                            )}
                            {maxReached && <p className="text-sm text-red-400">Le quota d’utilisation pour ce code est atteint.</p>}
                            {promoError && <p className="text-sm text-red-500">{promoError}</p>}
                            {promo && !promo.valid && !isPromoError && (
                              <p className="text-sm text-red-500">
                                Code invalide{promo.reason ? ` : ${promo.reason}` : ""}.
                              </p>
                            )}
                          </>
                        ) : (
                          <div className="flex items-center justify-between rounded-lg border border-green-700/40 p-2">
                            <div className="text-sm">
                              <span className="text-green-500 font-medium">{promo.code}</span>{" "}
                              <span className="text-gray-400">appliqué</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={clearPromo} className="text-gray-400 hover:text-white">
                              Retirer
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="bg-gray-800" />

                {/* Cart Summary */}
                <div className="space-y-4 py-6">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Truck className="h-4 w-4" />
                    <span>Livraison gratuite dès {SHIPPING_THRESHOLD}TND</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Sous-total</span>
                      <span>{subtotal.toFixed(2)} TND</span>
                    </div>

                    {promo?.valid && (
                      <div className="flex justify-between text-sm text-green-500">
                        <span>Remise ({promo.code})</span>
                        <span>-{discount.toFixed(2)} TND</span>
                      </div>
                    )}

                    {alreadyUsed && (
                      <div className="flex justify-between text-sm text-red-400">
                        <span>Code {promo?.code || promoInput}</span>
                        <span>déjà utilisé</span>
                      </div>
                    )}

                    {maxReached && (
                      <div className="flex justify-between text-sm text-red-400">
                        <span>Code {promo?.code || promoInput}</span>
                        <span>quota atteint</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Livraison</span>
                      <span>{shipping === 0 ? "Gratuite" : `${SHIPPING_COST.toFixed(2)} TND`}</span>
                    </div>

                    <Separator className="bg-gray-800" />

                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-gold">{grandTotal.toFixed(2)} TND</span>
                    </div>
                  </div>

                  <Button className="w-full bg-gold text-black hover:bg-gold/90 font-semibold py-3" onClick={handleProceed}>
                    Procéder au paiement
                  </Button>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Modal d'authentification */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} defaultTab="login" />
    </>
  )
}
