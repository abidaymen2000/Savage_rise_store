"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingBag, Plus, Minus, X, Truck, Ticket, Loader2, ChevronDown } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import AuthModal from "@/app/components/AuthModal"
import { api } from "@/lib/api"
import {
  buildPackSelections,
  findCartUpgradeCandidate,
  getAvailableSizesForColor,
  getPackPrice,
  getPackSavingsLabel,
  getProductColorOptions,
  getProductImageForColor,
} from "@/lib/pack-offers"
import { trackStoreEvent } from "@/lib/store-analytics"
import type { ApplyResponse, CartPackItem, OrderItem, Pack, Product } from "@/types/api"
import { formatPrice } from "@/lib/utils"

export default function Cart() {
  const router = useRouter()
  const { state, addPackToCart, updateQuantity, removeFromCart, updatePackQuantity, removePackFromCart, getPackCartKey } = useCart()
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
  const [packs, setPacks] = useState<Pack[]>([])
  const [upgradeCompanionProduct, setUpgradeCompanionProduct] = useState<Product | null>(null)
  const [upgradeSelection, setUpgradeSelection] = useState<{ color: string; size: string } | null>(null)
  const [upgradeLoading, setUpgradeLoading] = useState(false)

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
    () => [
      ...orderItems.map((i) => `${i.product_id}-${i.color}-${i.size}-${i.qty}`),
      ...state.packItems.map((item) => getPackCartKey(item.pack.id, item.selections) + `-${item.quantity}`),
    ].join("|"),
    [getPackCartKey, orderItems, state.packItems],
  )

  // Totaux
  const subtotal = state.total
  const discount = promo?.valid ? promo.discount_value ?? 0 : 0
  const totalAfterDiscount = Math.max(0, subtotal - discount)

  const grandTotal = totalAfterDiscount
  const upgradeCandidate = useMemo(() => findCartUpgradeCandidate(state.items, state.packItems, packs), [state.items, state.packItems, packs])

  const handleQuantityChange = (productId: string, color: string, size: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, color, size)
    } else {
      updateQuantity(productId, color, size, newQuantity)
    }
  }

  const handlePackQuantityChange = (item: CartPackItem, newQuantity: number) => {
    const selectionKey = getPackCartKey(item.pack.id, item.selections).replace(`${item.pack.id}-`, "")
    if (newQuantity <= 0) {
      removePackFromCart(item.pack.id, selectionKey)
    } else {
      updatePackQuantity(item.pack.id, selectionKey, newQuantity)
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
        trackStoreEvent("coupon_applied", {
          metadata: {
            code: normalized,
            discount_value: res.discount_value ?? 0,
            cart_total: subtotal,
          },
        })
      } else {
        localStorage.removeItem("savage_rise_promo_code")
        if (res.reason === "login_required") {
          setShowPromo(true)
          setShowAuthModal(true)
        }
      }
    } catch {
      setPromoError("Unable to apply this code. Please try again.")
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
    if (saved && orderItems.length > 0) {
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
    trackStoreEvent("button_clicked", {
      metadata: {
        button: "proceed_to_checkout",
        cart_total: state.total,
        item_count: state.itemCount,
      },
    })
    setIsOpen(false)
    router.push("/checkout")
  }

  useEffect(() => {
    if (!isOpen || state.items.length === 0) return

    let isMounted = true

    async function loadUpgradePack() {
      setUpgradeLoading(true)
      try {
        const packsData = await api.getPacks(0, 50).catch(() => [] as Pack[])
        if (!isMounted) return

        setPacks(packsData)

        const nextCandidate = findCartUpgradeCandidate(state.items, state.packItems, packsData)
        if (!nextCandidate) {
          setUpgradeCompanionProduct(null)
          setUpgradeSelection(null)
          return
        }

        const companionProduct = await api.getProduct(nextCandidate.companion.product_id).catch(() => null)
        if (!isMounted) return

        setUpgradeCompanionProduct(companionProduct)

        if (companionProduct) {
          const sameColorAvailable = getProductColorOptions(companionProduct).includes(nextCandidate.item.selectedVariant.color)
          const color = nextCandidate.companion.color || (sameColorAvailable ? nextCandidate.item.selectedVariant.color : companionProduct.variants?.[0]?.color || "")
          const size = nextCandidate.companion.size || getAvailableSizesForColor(companionProduct, color)[0] || ""
          setUpgradeSelection({ color, size })
        } else {
          setUpgradeSelection(null)
        }
      } finally {
        if (isMounted) setUpgradeLoading(false)
      }
    }

    loadUpgradePack()

    return () => {
      isMounted = false
    }
  }, [isOpen, state.items, state.packItems])

  const handleUpgradeToSet = () => {
    if (!upgradeCandidate || !upgradeCompanionProduct || !upgradeSelection) return

    const selections = buildPackSelections(
      upgradeCandidate.pack,
      {
        [upgradeCandidate.item.product.id]: upgradeCandidate.item.product,
        [upgradeCompanionProduct.id]: upgradeCompanionProduct,
      },
      {
        preferredColor: upgradeCandidate.item.selectedVariant.color,
        overrides: {
          [upgradeCandidate.item.product.id]: {
            color: upgradeCandidate.item.selectedVariant.color,
            size: upgradeCandidate.item.selectedSize,
          },
          [upgradeCompanionProduct.id]: upgradeSelection,
        },
      },
    )

    if (!selections) return

    addPackToCart(upgradeCandidate.pack, selections, upgradeCandidate.item.quantity)
    removeFromCart(
      upgradeCandidate.item.product.id,
      upgradeCandidate.item.selectedVariant.color,
      upgradeCandidate.item.selectedSize,
    )
    trackStoreEvent("button_clicked", {
      product_id: upgradeCandidate.item.product.id,
      metadata: {
        action: "cart_upgrade_to_set",
        pack_id: upgradeCandidate.pack.id,
        quantity: upgradeCandidate.item.quantity,
      },
    })
  }

  return (
    <>
      <Sheet
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open)
          if (open) {
            trackStoreEvent("cart_viewed", {
              metadata: {
                item_count: state.itemCount,
                cart_total: state.total,
              },
            })
          }
        }}
      >
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
            <SheetTitle className="text-white font-playfair text-2xl">Cart ({state.itemCount})</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col h-full">
            {state.itemCount === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <ShoppingBag className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg mb-2">Your cart is empty</p>
                  <p className="text-gray-500 text-sm">Add products to start shopping</p>
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
                              <p className="text-xs text-gray-400">Color: {item.selectedVariant.color}</p>
                              <p className="text-xs text-gray-400">Size: {item.selectedSize}</p>
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

                  {state.packItems.map((item) => {
                    const selectionKey = getPackCartKey(item.pack.id, item.selections).replace(`${item.pack.id}-`, "")
                    const cartKey = getPackCartKey(item.pack.id, item.selections)
                    const imageUrl = item.pack.image_url || item.pack.products?.[0]?.image_url || "/placeholder.svg?height=80&width=80"
                    const linePrice = (item.pack.pack_price ?? item.selections.reduce((sum, selection) => sum + selection.unit_price * (selection.qty ?? 1), 0)) * item.quantity

                    return (
                      <div key={cartKey} className="flex gap-4 rounded-lg border border-gold/20 bg-gold/5 p-3">
                        <div className="w-20 h-20 relative overflow-hidden rounded-lg bg-gray-900">
                          <Image src={imageUrl} alt={item.pack.title} fill className="object-cover" />
                        </div>

                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Pack</p>
                              <h3 className="font-semibold text-sm line-clamp-2">{item.pack.title}</h3>
                              <div className="mt-1 space-y-0.5">
                                {item.selections.map((selection) => (
                                  <p key={`${selection.product_id}-${selection.color}-${selection.size}`} className="text-xs text-gray-400">
                                    {selection.color} / {selection.size} x{selection.qty ?? 1}
                                  </p>
                                ))}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-gray-400 hover:text-white"
                              onClick={() => removePackFromCart(item.pack.id, selectionKey)}
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
                                onClick={() => handlePackQuantityChange(item, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                                onClick={() => handlePackQuantityChange(item, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="font-semibold text-gold">{linePrice.toFixed(2)} TND</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {upgradeLoading && (
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-gray-400">
                      Looking for a matching set...
                    </div>
                  )}

                  {upgradeCandidate && upgradeCompanionProduct && upgradeSelection && (
                    <div className="rounded-xl border border-gold/25 bg-gradient-to-br from-gold/10 via-black to-black p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Complete your set</p>
                      <div className="mt-3 flex gap-3">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-900">
                          <Image
                            src={getProductImageForColor(upgradeCompanionProduct, upgradeSelection.color)}
                            alt={upgradeCompanionProduct.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-white">{upgradeCandidate.pack.title}</p>
                          <p className="mt-1 text-sm text-gray-300">
                            Add the matching {upgradeCompanionProduct.name.toLowerCase()} and save{" "}
                            {formatPrice(getPackSavingsLabel(upgradeCandidate.pack) * upgradeCandidate.item.quantity)}.
                          </p>
                          <p className="mt-2 text-xs text-gray-400">
                            Same-color set. Your current {upgradeCandidate.item.selectedSize} stays selected.
                          </p>
                        </div>
                      </div>

                      {!upgradeCandidate.companion.size && (
                        <div className="mt-4">
                          <Select
                            value={upgradeSelection.size}
                            onValueChange={(value) =>
                              setUpgradeSelection((current) => (current ? { ...current, size: value } : current))
                            }
                          >
                            <SelectTrigger className="border-gray-700 bg-gray-950 text-white">
                              <SelectValue placeholder="Choose matching size" />
                            </SelectTrigger>
                            <SelectContent className="border-gray-700 bg-gray-900">
                              {getAvailableSizesForColor(upgradeCompanionProduct, upgradeSelection.color).map((size) => (
                                <SelectItem key={size} value={size} className="text-white">
                                  {size}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div className="mt-4 flex items-end justify-between gap-3">
                        <div>
                          <p className="text-sm text-gray-500 line-through">
                            {formatPrice((upgradeCandidate.pack.original_price ?? 0) * upgradeCandidate.item.quantity)}
                          </p>
                          <p className="text-xl font-bold text-gold">
                            {formatPrice(getPackPrice(upgradeCandidate.pack) * upgradeCandidate.item.quantity)}
                          </p>
                        </div>
                        <Button className="bg-gold text-black hover:bg-gold/90" onClick={handleUpgradeToSet}>
                          Upgrade to the set
                        </Button>
                      </div>
                    </div>
                  )}
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
                      <span className={`text-sm ${isPromoError ? "text-red-400" : "text-gray-300"}`}>Promo code</span>

                      {promo?.valid && <span className="ml-2 text-xs text-green-400">{promo.code} applied</span>}
                      {alreadyUsed && <span className="ml-2 text-xs text-red-400">{promo?.code || promoInput} already used</span>}
                      {loginRequired && <span className="ml-2 text-xs text-red-400">sign in required</span>}
                      {maxReached && <span className="ml-2 text-xs text-red-400">usage limit reached</span>}
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
                                placeholder="ENTER YOUR CODE"
                                className={`bg-transparent text-white placeholder:text-gray-500 ${
                                  isPromoError ? "border-red-600 focus-visible:ring-red-600" : "border-gray-700"
                                }`}
                              />
                              <Button
                                type="submit"
                                disabled={promoLoading}
                                className={isPromoError ? "bg-red-600 hover:bg-red-700" : "bg-gold text-black hover:bg-gold/90"}
                              >
                                {promoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                              </Button>
                            </form>

                            {/* messages d’erreur */}
                            {alreadyUsed && <p className="text-sm text-red-400">This code has already been used by your account.</p>}
                            {loginRequired && (
                              <p className="text-sm text-red-400">
                                Sign in to use this code.{" "}
                                <button className="underline hover:opacity-80" onClick={() => setShowAuthModal(true)}>
                                  Sign in
                                </button>
                              </p>
                            )}
                            {maxReached && <p className="text-sm text-red-400">The usage limit for this code has been reached.</p>}
                            {promoError && <p className="text-sm text-red-500">{promoError}</p>}
                            {promo && !promo.valid && !isPromoError && (
                              <p className="text-sm text-red-500">
                                Invalid code{promo.reason ? `: ${promo.reason}` : ""}.
                              </p>
                            )}
                          </>
                        ) : (
                          <div className="flex items-center justify-between rounded-lg border border-green-700/40 p-2">
                            <div className="text-sm">
                              <span className="text-green-500 font-medium">{promo.code}</span>{" "}
                              <span className="text-gray-400">applied</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={clearPromo} className="text-gray-400 hover:text-white">
                              Remove
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
                    <span>Shipping is calculated at the next step</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Subtotal</span>
                      <span>{subtotal.toFixed(2)} TND</span>
                    </div>

                    {promo?.valid && (
                      <div className="flex justify-between text-sm text-green-500">
                        <span>Discount ({promo.code})</span>
                        <span>-{discount.toFixed(2)} TND</span>
                      </div>
                    )}

                    {alreadyUsed && (
                      <div className="flex justify-between text-sm text-red-400">
                        <span>Code {promo?.code || promoInput}</span>
                        <span>already used</span>
                      </div>
                    )}

                    {maxReached && (
                      <div className="flex justify-between text-sm text-red-400">
                        <span>Code {promo?.code || promoInput}</span>
                        <span>limit reached</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Shipping</span>
                      <span>To calculate</span>
                    </div>

                    <Separator className="bg-gray-800" />

                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-gold">{grandTotal.toFixed(2)} TND</span>
                    </div>
                  </div>

                  <Button className="w-full bg-gold text-black hover:bg-gold/90 font-semibold py-3" onClick={handleProceed}>
                    Proceed to checkout
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
