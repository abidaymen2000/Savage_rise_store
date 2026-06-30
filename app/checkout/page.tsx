"use client"

import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Coins, Truck, Shield, CreditCard, Loader2, Ticket, X } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import { ApiError, api } from "@/lib/api"
import { clearCheckoutId, createEventId, getAnalyticsContext, getOrCreateCheckoutId } from "@/lib/analytics-context"
import { clearCheckoutIdempotencyKey, getOrCreateCheckoutIdempotencyKey, getStoredCheckoutIdempotencyKey } from "@/lib/checkout-idempotency"
import { buildCheckoutFingerprint, buildQuoteSignature } from "@/lib/checkout-fingerprint"
import { getMetaEventContext } from "@/lib/meta-event-context"
import { trackPurchasePixelOnce } from "@/lib/meta-purchase"
import { getBackendConflictBody, getBackendConflictCode, getBackendConflictMessage, isIdempotencyConflict, isQuoteConflict, isStockConflict } from "@/lib/order-conflicts"
import { buildOrderPayload } from "@/lib/order-payload"
import AuthModal from "@/app/components/AuthModal"
import EmailVerificationModal from "@/app/components/EmailVerificationModal"
import Image from "next/image"
import Link from "next/link"
import type { ShippingInfo, ApplyResponse, Order, LoyaltyBalance, LoyaltyQuote, OrderQuoteOut } from "@/types/api"
import { getCartItemMetaContentId } from "@/lib/meta-content"
import { trackMetaPixelEvent } from "@/lib/meta-pixel"
import { trackStoreEvent } from "@/lib/store-analytics"

const PROMO_STORAGE_KEY = "savage_rise_promo_code"

type CheckoutStatus = "idle" | "quoting" | "ready" | "submitting" | "success" | "conflict" | "error"

export default function CheckoutPage() {
  const router = useRouter()
  const { state: cartState, clearCart, refreshCartProducts } = useCart()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()

  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showEmailVerification, setShowEmailVerification] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [checkoutStatus, setCheckoutStatus] = useState<CheckoutStatus>("idle")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null)

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    full_name: "",
    email: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    postal_code: "",
    city: "",
    country: "Tunisia",
  })

  // --- Promo state ---
  const [promoCode, setPromoCode] = useState<string | null>(null)
  const [promoResult, setPromoResult] = useState<ApplyResponse | null>(null)
  const [promoLoading, setPromoLoading] = useState(false)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [orderQuote, setOrderQuote] = useState<OrderQuoteOut | null>(null)
  const [quoteLoading, setQuoteLoading] = useState(false)
  const [quoteError, setQuoteError] = useState<string | null>(null)
  const [loyaltyBalance, setLoyaltyBalance] = useState<LoyaltyBalance | null>(null)
  const [loyaltyQuote, setLoyaltyQuote] = useState<LoyaltyQuote | null>(null)
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false)
  const [loyaltyPointsToUse, setLoyaltyPointsToUse] = useState(0)
  const [loyaltyLoading, setLoyaltyLoading] = useState(false)
  const [loyaltyError, setLoyaltyError] = useState<string | null>(null)
  const lastAttemptFingerprintRef = useRef<string | null>(null)
  const lastAttemptHadUnknownFailureRef = useRef(false)
  const quoteRequestIdRef = useRef(0)
  const purchaseEventIdRef = useRef<string | null>(null)

  // Redirect if cart is empty
  useEffect(() => {
    if (cartState.itemCount === 0 && !authLoading) {
      purchaseEventIdRef.current = null
      clearCheckoutId()
      router.push("/products")
    }
  }, [cartState.itemCount, authLoading, router])

  useEffect(() => {
    if (cartState.itemCount > 0) {
      getOrCreateCheckoutId()
    }
  }, [cartState.itemCount])

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

  const promoDiscount = promoResult?.valid ? promoResult.discount_value ?? 0 : 0
  const subtotal = cartState.total
  const afterPromoDiscount = Math.max(0, subtotal - promoDiscount)
  const loyaltyDiscount = isAuthenticated && useLoyaltyPoints && loyaltyQuote ? loyaltyQuote.discount_value : 0
  const loyaltyPointsUsed = isAuthenticated && useLoyaltyPoints && loyaltyQuote ? loyaltyQuote.usable_points : 0
  const estimatedPointsEarned = isAuthenticated && loyaltyQuote ? loyaltyQuote.estimated_points_earned : 0
  const afterDiscount = Math.max(0, afterPromoDiscount - loyaltyDiscount)
  const baseAnalyticsContext = useMemo(
    () => getAnalyticsContext({ includeCheckoutId: cartState.itemCount > 0 }),
    [cartState.itemCount],
  )
  const metaEventContext = useMemo(
    () => getMetaEventContext(baseAnalyticsContext.event_id ?? null),
    [
      baseAnalyticsContext.event_id,
      baseAnalyticsContext.page_url,
      baseAnalyticsContext.fbp,
      baseAnalyticsContext.fbc,
      baseAnalyticsContext.fbclid,
    ],
  )

  const orderPayload = useMemo(
    () =>
      buildOrderPayload({
        items: cartState.items,
        packItems: cartState.packItems,
        shipping: shippingInfo,
        payment_method: "cod",
        promo_code: isAuthenticated ? promoCode : null,
        loyalty_points_to_use: isAuthenticated ? loyaltyPointsUsed : 0,
        user_id: isAuthenticated ? user?.id ?? null : null,
        meta: metaEventContext,
        analytics_context: baseAnalyticsContext,
      }),
    [
      cartState.items,
      cartState.packItems,
      shippingInfo,
      isAuthenticated,
      promoCode,
      loyaltyPointsUsed,
      user?.id,
      metaEventContext,
      baseAnalyticsContext,
    ],
  )

  const quoteSignature = useMemo(() => buildQuoteSignature(orderQuote), [orderQuote])

  // (Re)valider un code promo sauvegardé
  const revalidatePromo = async (code: string) => {
    if (!isAuthenticated || !code || orderPayload.items.length === 0) return
    setPromoLoading(true)
    setPromoError(null)
    try {
      const res = await api.applyPromo(code, orderPayload.items, subtotal)
      setPromoResult(res)
      setPromoCode(res.valid ? code : null)
      if (res.valid) {
        trackStoreEvent("coupon_applied", {
          metadata: {
            code,
            discount_value: res.discount_value ?? 0,
            source: "checkout",
          },
        })
      }
      if (!res.valid) {
        localStorage.removeItem(PROMO_STORAGE_KEY)
      }
    } catch {
      setPromoError("Unable to validate the promo code right now.")
    } finally {
      setPromoLoading(false)
    }
  }

  // Charger et valider le code promo stocké quand on arrive sur le checkout
  useEffect(() => {
    if (!isAuthenticated) {
      setPromoCode(null)
      setPromoResult(null)
      setPromoError(null)
      localStorage.removeItem(PROMO_STORAGE_KEY)
      return
    }
    const saved = localStorage.getItem(PROMO_STORAGE_KEY)
    if (saved) {
      setPromoCode(saved)
      revalidatePromo(saved)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  useEffect(() => {
    if (!isAuthenticated) {
      setLoyaltyBalance(null)
      setLoyaltyQuote(null)
      setUseLoyaltyPoints(false)
      setLoyaltyPointsToUse(0)
      setLoyaltyError(null)
      return
    }

    let isMounted = true

    async function fetchLoyaltyBalance() {
      setLoyaltyLoading(true)
      setLoyaltyError(null)
      try {
        const balance = await api.getMyLoyaltyBalance()
        if (isMounted) {
          setLoyaltyBalance(balance)
          setLoyaltyPointsToUse(balance.points_balance)
        }
      } catch (err) {
        if (isMounted) setLoyaltyError("Unable to load your loyalty points right now.")
      } finally {
        if (isMounted) setLoyaltyLoading(false)
      }
    }

    fetchLoyaltyBalance()

    return () => {
      isMounted = false
    }
  }, [isAuthenticated])

  // Si le panier change (quantités), on revalide le code
  useEffect(() => {
    if (isAuthenticated && promoCode) revalidatePromo(promoCode)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderPayload.items.map((i) => `${i.product_id}-${i.color}-${i.size}-${i.qty}`).join("|"), subtotal])

  const handleRemovePromo = () => {
    setPromoCode(null)
    setPromoResult(null)
    localStorage.removeItem(PROMO_STORAGE_KEY)
  }

  const handleInputChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo((prev) => ({ ...prev, [field]: value }))
  }

  const validateShippingInfo = useCallback((): boolean => {
    const required: Array<keyof ShippingInfo> = ["full_name", "phone", "address_line1", "postal_code", "city", "country"]
    if (isAuthenticated) {
      required.push("email")
    }
    return required.every((field) => shippingInfo[field as keyof ShippingInfo]?.toString().trim())
  }, [isAuthenticated, shippingInfo])

  const refreshCheckoutProducts = async () => {
    const uniqueProductIds = Array.from(new Set(cartState.items.map((item) => item.product.id)))
    if (uniqueProductIds.length === 0) return

    const freshProducts = (
      await Promise.all(uniqueProductIds.map((productId) => api.getProduct(productId).catch(() => null)))
    ).filter((product): product is NonNullable<typeof product> => Boolean(product))

    refreshCartProducts(freshProducts)
  }

  const getFriendlyCheckoutError = (err: unknown) => {
    if (err instanceof ApiError) {
      const detail = err.message || "Unable to create your order."
      const lowerDetail = detail.toLowerCase()

      if (err.status === 400) {
        return "Some checkout information is invalid. Please review your address and cart selections."
      }

      if (err.status === 404) {
        return "One of the products, variants, or promotions in your checkout is no longer available. We refreshed the latest data."
      }

      if (err.status === 409) {
        const conflictCode = getBackendConflictCode(err)
        const conflictMessage = getBackendConflictMessage(err)
        const conflictBody = getBackendConflictBody(err)
        const lineItem = typeof conflictBody?.item === "string" ? conflictBody.item : null

        if (isIdempotencyConflict(err)) {
          return conflictMessage
            ? `This checkout attempt is already in progress or no longer matches the previous payload. ${conflictMessage}`
            : "This checkout attempt is already in progress or no longer matches the previous payload. Please review before trying again."
        }

        if (isQuoteConflict(err)) {
          return conflictMessage
            ? `Your checkout quote is no longer valid. ${conflictMessage}`
            : "Your checkout quote is no longer valid. We refreshed the latest pricing and need a new confirmation."
        }

        if (isStockConflict(err)) {
          if (lineItem) {
            return `Availability changed for ${lineItem}. Please review the updated checkout before trying again.`
          }
          return conflictMessage
            ? `Stock changed while you were checking out. ${conflictMessage}`
            : "Stock changed while you were checking out. We refreshed your cart with the latest availability."
        }

        return conflictMessage
          ? `${conflictMessage}${conflictCode ? ` (${conflictCode})` : ""}`
          : "Your order could not be created because the checkout changed or another business rule blocked it. Please review and try again."
      }

      return detail
    }

    if (err instanceof Error) {
      if (err.message.includes("timeout") || err.message.toLowerCase().includes("network error")) {
        return "We could not confirm the order yet. Please retry with the same checkout; we will safely reuse this attempt."
      }
      return err.message
    }

    return "Unable to create your order right now."
  }

  const handlePlaceOrder = async () => {
    if (isProcessing) return

    if (isAuthenticated && !user?.is_active) {
      setShowEmailVerification(true)
      return
    }

    if (!validateShippingInfo()) {
      setError("Please fill in all required fields")
      return
    }

    if (!orderQuote || quoteLoading) {
      setError("Please wait while your final total is confirmed.")
      return
    }

    setIsProcessing(true)
    setCheckoutStatus("submitting")
    setError(null)
    const idempotencyKey = getOrCreateCheckoutIdempotencyKey(checkoutFingerprint)
    const metaEventId = purchaseEventIdRef.current ?? createEventId()
    purchaseEventIdRef.current = metaEventId
    const submitAnalyticsContext = getAnalyticsContext({ includeCheckoutId: true })
    const finalOrderPayload = buildOrderPayload({
      items: cartState.items,
      packItems: cartState.packItems,
      shipping: shippingInfo,
      payment_method: "cod",
      promo_code: isAuthenticated ? promoCode : null,
      loyalty_points_to_use: isAuthenticated ? loyaltyPointsUsed : 0,
      user_id: isAuthenticated ? user?.id ?? null : null,
      meta: getMetaEventContext(metaEventId),
      analytics_context: {
        ...submitAnalyticsContext,
        meta_event_id: metaEventId,
      },
      meta_event_id: metaEventId,
    })
    lastAttemptFingerprintRef.current = checkoutFingerprint
    lastAttemptHadUnknownFailureRef.current = false
    trackStoreEvent("shipping_info_submitted", {
      include_checkout_id: true,
      metadata: {
        city: shippingInfo.city,
        country: shippingInfo.country,
        has_address_line2: Boolean(shippingInfo.address_line2),
        is_authenticated: isAuthenticated,
      },
    })

    try {
      const order = await api.createOrder(finalOrderPayload, idempotencyKey)

      trackPurchasePixelOnce({
        orderId: order.id,
        metaEventId,
        value: order.total_amount ?? orderQuote.total_amount,
        currency: orderQuote.currency ?? "TND",
        content_ids: pixelContentIds,
        contents: pixelContents,
        num_items: cartState.itemCount,
      })
      setCreatedOrder(order)
      setSuccess(true)
      setCheckoutStatus("success")
      clearCheckoutIdempotencyKey()
      clearCheckoutId()
      lastAttemptFingerprintRef.current = null
      clearCart()
      localStorage.removeItem(PROMO_STORAGE_KEY)
      setUseLoyaltyPoints(false)
      setLoyaltyPointsToUse(0)
      router.replace(`/checkout/success?order_id=${encodeURIComponent(order.id)}`)
    } catch (err) {
      trackStoreEvent("checkout_validation_failed", {
        include_checkout_id: true,
        metadata: {
          value: orderQuote.total,
          error: err instanceof Error ? err.message : "unknown",
        },
      })
      if (err instanceof ApiError && (err.status === 404 || err.status === 409)) {
        await refreshCheckoutProducts()
        if (isQuoteConflict(err)) {
          clearCheckoutIdempotencyKey()
        }
        if (isStockConflict(err)) {
          clearCheckoutIdempotencyKey()
        }
      }
      if (!(err instanceof ApiError) || err.status >= 500) {
        lastAttemptHadUnknownFailureRef.current = true
      }
      setCheckoutStatus(err instanceof ApiError && err.status === 409 ? "conflict" : "error")
      setError(getFriendlyCheckoutError(err))
    } finally {
      setIsProcessing(false)
    }
  }

  const checkoutFingerprint = useMemo(
    () => buildCheckoutFingerprint(orderPayload, quoteSignature),
    [orderPayload, quoteSignature],
  )

  useEffect(() => {
    if (
      !isProcessing &&
      lastAttemptHadUnknownFailureRef.current &&
      lastAttemptFingerprintRef.current &&
      lastAttemptFingerprintRef.current !== checkoutFingerprint &&
      getStoredCheckoutIdempotencyKey()
    ) {
      clearCheckoutIdempotencyKey()
      purchaseEventIdRef.current = null
      lastAttemptHadUnknownFailureRef.current = false
      lastAttemptFingerprintRef.current = null
    }
  }, [checkoutFingerprint, isProcessing])

  const pixelContents = useMemo(
    () => [
      ...cartState.items.map((item) => ({
        id: getCartItemMetaContentId(item) ?? item.product.id,
        quantity: item.quantity,
        item_price: item.product.price,
      })),
      ...cartState.packItems.flatMap((item) =>
        item.selections.map((selection) => ({
          id: selection.product_id,
          quantity: (selection.qty ?? 1) * item.quantity,
          item_price: selection.unit_price,
        })),
      ),
    ],
    [cartState.items, cartState.packItems],
  )

  const pixelContentIds = useMemo(() => pixelContents.map((item) => String(item.id)), [pixelContents])

  useEffect(() => {
    if (cartState.itemCount === 0) return
    const checkoutId = getOrCreateCheckoutId()
    const analyticsEvent = trackStoreEvent("checkout_started", {
      include_checkout_id: true,
      currency: "TND",
      value: subtotal,
      items: [
        ...cartState.items.map((item) => ({
          product_id: item.product.id,
          variant_id: item.selectedVariant.meta_content_id ?? null,
          sku: item.product.sku ?? null,
          product_name: item.product.name,
          variant_name: `${item.selectedVariant.color} / ${item.selectedSize}`,
          item_type: "product",
          quantity: item.quantity,
          unit_price: item.product.price,
          line_total: item.product.price * item.quantity,
          currency: "TND",
        })),
        ...cartState.packItems.flatMap((item) =>
          item.selections.map((selection) => ({
            product_id: selection.product_id,
            item_type: "pack_component",
            pack_id: item.pack.id,
            quantity: (selection.qty ?? 1) * item.quantity,
            unit_price: selection.unit_price,
            line_total: selection.unit_price * (selection.qty ?? 1) * item.quantity,
            currency: "TND",
          })),
        ),
      ],
      deduplication_key: `checkout_started:${checkoutId}`,
      metadata: {
        content_ids: pixelContentIds,
        item_count: cartState.itemCount,
      },
    })

    if (!analyticsEvent.eventId) return

    trackMetaPixelEvent("InitiateCheckout", {
      content_ids: pixelContentIds,
      contents: pixelContents,
      currency: "TND",
      num_items: cartState.itemCount,
      value: subtotal,
    }, {
      eventID: analyticsEvent.eventId,
    })
  }, [cartState.itemCount, cartState.items, cartState.packItems, pixelContentIds, pixelContents, subtotal])

  useEffect(() => {
    if (!isAuthenticated || !loyaltyBalance?.settings?.is_active || cartState.itemCount === 0) {
      setLoyaltyQuote(null)
      return
    }

    const requestedPoints = useLoyaltyPoints ? Math.max(0, Math.floor(loyaltyPointsToUse)) : 0
    const timeout = setTimeout(async () => {
      setLoyaltyLoading(true)
      setLoyaltyError(null)
      try {
        const quote = await api.quoteLoyaltyRedemption({
          order_total: afterPromoDiscount,
          points_to_use: requestedPoints,
        })
        setLoyaltyQuote(quote)
      } catch (err) {
        setLoyaltyQuote(null)
        setLoyaltyError("Unable to calculate your loyalty discount right now.")
      } finally {
        setLoyaltyLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeout)
  }, [
    isAuthenticated,
    loyaltyBalance?.settings?.is_active,
    afterPromoDiscount,
    useLoyaltyPoints,
    loyaltyPointsToUse,
    cartState.itemCount,
  ])

  useEffect(() => {
    if (!validateShippingInfo() || cartState.itemCount === 0) {
      setOrderQuote(null)
      setQuoteError(null)
      setCheckoutStatus("idle")
      return
    }

    const requestId = ++quoteRequestIdRef.current
    const timeout = setTimeout(async () => {
      setCheckoutStatus("quoting")
      setQuoteLoading(true)
      setQuoteError(null)
      try {
        const quote = await api.quoteOrder(orderPayload)
        if (requestId === quoteRequestIdRef.current) {
          setOrderQuote(quote)
          setCheckoutStatus("ready")
        }
      } catch (err) {
        if (requestId === quoteRequestIdRef.current) {
          setOrderQuote(null)
          setQuoteError(err instanceof Error ? err.message : "Unable to validate your order total right now.")
          setCheckoutStatus("error")
        }
      } finally {
        if (requestId === quoteRequestIdRef.current) {
          setQuoteLoading(false)
        }
      }
    }, 400)

    return () => clearTimeout(timeout)
  }, [cartState.itemCount, orderPayload, validateShippingInfo])

  const shipping = orderQuote?.shipping_amount ?? 0
  const total = orderQuote?.total ?? afterDiscount
  const displaySubtotal = orderQuote?.subtotal ?? subtotal
  const displayPackDiscount = orderQuote?.pack_discount ?? 0
  const displayPromotionDiscount = orderQuote?.promotion_discount ?? promoDiscount
  const displayLoyaltyDiscount = orderQuote?.loyalty_discount ?? loyaltyDiscount
  const quoteWarnings = orderQuote?.warnings ?? []

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (cartState.itemCount === 0) return null // redirect déjà programmé

  if (success) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Order confirmed!</h1>
          <p className="text-gray-400 mb-4">
            Your order has been created successfully. Redirecting to your confirmation page...
          </p>
          {isAuthenticated && createdOrder && (
            <div className="mb-4 rounded-md border border-gold/25 bg-gold/10 p-3 text-sm text-gold">
              {createdOrder.loyalty_points_used ? (
                <p>{createdOrder.loyalty_points_used} loyalty points used on this order.</p>
              ) : null}
              {createdOrder.loyalty_points_earned ? (
                <p>You earned {createdOrder.loyalty_points_earned} loyalty points.</p>
              ) : null}
            </div>
          )}
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
            Continue shopping
          </Link>
          <h1 className="text-3xl font-playfair font-bold">Checkout</h1>
        </div>

        {!isAuthenticated && (
          <Alert className="mb-8 border-gold/40 bg-gold/10">
            <AlertDescription className="text-gold">
              You are checking out as a guest. Sign in if you want to use a promo code and track orders from your profile.
              Connected customers can also earn and redeem loyalty points.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Order summary</CardTitle>
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
                        {item.selectedVariant.color} • {item.selectedSize} • Qty: {item.quantity}
                      </p>
                      <p className="text-gold font-semibold">{(item.product.price * item.quantity).toFixed(2)} TND</p>
                    </div>
                  </div>
                ))}

                {cartState.packItems.map((item) => {
                  const imageUrl = item.pack.image_url || item.pack.products?.[0]?.image_url || "/placeholder.svg"
                  const packPrice = (item.pack.pack_price ?? item.selections.reduce((sum, selection) => sum + selection.unit_price * (selection.qty ?? 1), 0)) * item.quantity

                  return (
                    <div key={`${item.pack.id}-${item.selections.map((selection) => `${selection.product_id}-${selection.color}-${selection.size}`).join("|")}`} className="flex gap-4 rounded-lg border border-gold/20 bg-gold/5 p-3">
                      <div className="w-16 h-16 relative overflow-hidden rounded-lg bg-gray-800">
                        <Image
                          src={imageUrl}
                          alt={item.pack.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Pack</p>
                        <h3 className="font-semibold text-white">{item.pack.title}</h3>
                        <div className="mt-1 space-y-0.5">
                          {item.selections.map((selection) => (
                            <p key={`${selection.product_id}-${selection.color}-${selection.size}`} className="text-xs text-gray-400">
                              {selection.color} • {selection.size} • Qty: {(selection.qty ?? 1) * item.quantity}
                            </p>
                          ))}
                        </div>
                        <p className="mt-2 text-gold font-semibold">{packPrice.toFixed(2)} TND</p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Shipping Form */}
            <Card className="bg-gray-900 border-gray-800 mt-6">
              <CardHeader>
                <CardTitle className="text-white">Shipping information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name">Full name *</Label>
                    <Input
                      id="full_name"
                      value={shippingInfo.full_name}
                      onChange={(e) => handleInputChange("full_name", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email {isAuthenticated ? "*" : "(optional)"}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingInfo.email ?? ""}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder={isAuthenticated ? undefined : "Optional for guest checkout"}
                      required={isAuthenticated}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone *</Label>
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
                  <Label htmlFor="address_line1">Address *</Label>
                  <Input
                    id="address_line1"
                    value={shippingInfo.address_line1}
                    onChange={(e) => handleInputChange("address_line1", e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="address_line2">Address details</Label>
                  <Input
                    id="address_line2"
                    value={shippingInfo.address_line2 || ""}
                    onChange={(e) => handleInputChange("address_line2", e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Apartment, floor, etc."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="postal_code">Postal code *</Label>
                    <Input
                      id="postal_code"
                      value={shippingInfo.postal_code}
                      onChange={(e) => handleInputChange("postal_code", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={shippingInfo.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country *</Label>
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
                <CardTitle className="text-white">Order total</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">{displaySubtotal.toFixed(2)} TND</span>
                </div>

                {displayPackDiscount > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span>Pack discount</span>
                    <span>- {displayPackDiscount.toFixed(2)} TND</span>
                  </div>
                )}

                {/* Ligne remise si code valide */}
                {isAuthenticated && promoResult?.valid && (
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2 text-green-500">
                      <Ticket className="h-4 w-4" />
                      <span>Code {promoResult.code}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-green-500">- {displayPromotionDiscount.toFixed(2)} TND</span>
                      <button
                        className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
                        onClick={handleRemovePromo}
                        disabled={promoLoading}
                        title="Remove code"
                      >
                        <X className="h-3 w-3" /> Remove
                      </button>
                    </div>
                  </div>
                )}

                {/* Erreur promo éventuelle */}
                {isAuthenticated && promoError && (
                  <Alert className="border-red-600 bg-red-900/20">
                    <AlertDescription className="text-red-400">{promoError}</AlertDescription>
                  </Alert>
                )}

                {isAuthenticated && (
                  <div className="rounded-md border border-gold/25 bg-gold/5 p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-full bg-gold/15 p-2 text-gold">
                          <Coins className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">Loyalty points</p>
                          <p className="text-sm text-gray-400">
                            {loyaltyLoading && !loyaltyBalance
                              ? "Loading your balance..."
                              : loyaltyBalance
                                ? `${loyaltyBalance.points_balance} points available`
                                : "No balance available"}
                          </p>
                        </div>
                      </div>
                      {estimatedPointsEarned > 0 && (
                        <span className="shrink-0 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-semibold text-green-400">
                          +{estimatedPointsEarned} pts
                        </span>
                      )}
                    </div>

                    {loyaltyBalance?.settings?.is_active ? (
                      <>
                        <label className="flex cursor-pointer items-center gap-3 rounded-md border border-white/10 bg-black/20 p-3">
                          <Checkbox
                            checked={useLoyaltyPoints}
                            disabled={!loyaltyBalance.points_balance || loyaltyLoading}
                            onCheckedChange={(checked) => {
                              const nextChecked = checked === true
                              setUseLoyaltyPoints(nextChecked)
                              if (nextChecked && loyaltyPointsToUse <= 0) {
                                setLoyaltyPointsToUse(loyaltyBalance.points_balance)
                              }
                            }}
                          />
                          <span className="text-sm text-gray-200">
                            Use points as a discount
                          </span>
                        </label>

                        {useLoyaltyPoints && (
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <Input
                                type="number"
                                min={0}
                                max={loyaltyBalance.points_balance}
                                value={loyaltyPointsToUse}
                                onChange={(event) => {
                                  const value = Number(event.target.value)
                                  setLoyaltyPointsToUse(
                                    Number.isFinite(value)
                                      ? Math.max(0, Math.min(loyaltyBalance.points_balance, Math.floor(value)))
                                      : 0,
                                  )
                                }}
                                className="bg-black border-white/10 text-white"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                className="border-gold/50 bg-transparent text-gold hover:bg-gold hover:text-black"
                                onClick={() => setLoyaltyPointsToUse(loyaltyBalance.points_balance)}
                              >
                                Max
                              </Button>
                            </div>
                            {loyaltyQuote && (
                              <p className="text-xs text-gray-400">
                                {loyaltyQuote.usable_points} points apply {loyaltyQuote.discount_value.toFixed(2)} TND discount.
                              </p>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">Loyalty rewards are currently unavailable.</p>
                    )}

                    {loyaltyError && (
                      <Alert className="border-red-600 bg-red-900/20">
                        <AlertDescription className="text-red-400">{loyaltyError}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                {isAuthenticated && displayLoyaltyDiscount > 0 && (
                  <div className="flex justify-between text-gold">
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4" />
                      <span>{loyaltyPointsUsed} loyalty points</span>
                    </div>
                    <span>- {displayLoyaltyDiscount.toFixed(2)} TND</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-white">
                    {quoteLoading
                      ? "Validating..."
                      : orderQuote
                        ? shipping === 0
                          ? "Free"
                          : `${shipping.toFixed(2)} TND`
                        : "Pending validation"}
                  </span>
                </div>

                {orderQuote?.shipping_rate_name && (
                  <p className="text-xs text-gray-500 text-right">{orderQuote.shipping_rate_name}</p>
                )}

                {quoteError && (
                  <Alert className="border-red-600 bg-red-900/20">
                    <AlertDescription className="text-red-400">{quoteError}</AlertDescription>
                  </Alert>
                )}

                {quoteWarnings.length > 0 && (
                  <Alert className="border-yellow-600 bg-yellow-900/20">
                    <AlertDescription className="text-yellow-300">{quoteWarnings.join(" ")}</AlertDescription>
                  </Alert>
                )}

                <p className="text-xs text-gray-500">
                  Status: {checkoutStatus}
                </p>

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
                    <span>{orderQuote ? "Total validated by the backend quote." : "Your final total is being validated by the backend."}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Shield className="h-4 w-4" />
                    <span>Secure payment</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <CreditCard className="h-4 w-4" />
                    <span>Cash on delivery</span>
                  </div>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || promoLoading || quoteLoading || (useLoyaltyPoints && loyaltyLoading) || !orderQuote}
                  className="w-full bg-gold text-black hover:bg-gold/90 font-semibold py-3"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Confirm order • ${total.toFixed(2)} TND`
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By confirming your order, you accept our terms of sale.
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
