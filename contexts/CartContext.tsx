"use client"
import { useStudio } from "@/components/studio-runtime"
import { saveQuickPurchase } from "@/lib/quick-purchase"
import { useRouter } from "next/navigation"

import { api } from "@/lib/api"
import { ApiError } from "@/lib/api/api-error"
import { refreshCartSelection } from "@/lib/cart-availability"
import type React from "react"
import { createContext, useContext, useReducer, useEffect, useState, useRef } from "react"
import type { CartItem, CartPackItem, Pack, PackOrderComponent, Product, Variant } from "@/types/api"
import { getSelectableQuantityLimit, getVariantSize } from "@/lib/inventory"
import { getProductCartKey, matchesCartItem, resolveVariantItemId } from "@/lib/cart-identity"
import { buildMetaCartItemContent, buildMetaPackSelectionContent } from "@/lib/meta-content"
import { trackMetaPixelEvent } from "@/lib/meta-pixel"
import { trackStoreEvent } from "@/lib/store-analytics"
import type { AnalyticsItem } from "@/types/api"

interface CartState {
  items: CartItem[]
  packItems: CartPackItem[]
  total: number
  itemCount: number
}

type CartAction =
  | { type: "REFRESH_PRODUCTS"; payload: Product[] }
  | {
      type: "ADD_ITEM"
      payload: { product: Product; variant: Variant; size: string; quantity?: number }
    }
  | {
      type: "ADD_PACK"
      payload: { pack: Pack; selections: PackOrderComponent[]; quantity?: number }
    }
  | { type: "REMOVE_ITEM"; payload: { productId: string; color: string; size: string; variantItemId?: string | null } }
  | { type: "REMOVE_PACK"; payload: { packId: string; selectionKey: string } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; color: string; size: string; variantItemId?: string | null; quantity: number } }
  | { type: "UPDATE_PACK_QUANTITY"; payload: { packId: string; selectionKey: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartState }

const CartContext = createContext<{
  loaded: boolean
  state: CartState
  isCartOpen: boolean
  dispatch: React.Dispatch<CartAction>
  openCart: () => void
  closeCart: () => void
  buyNow: (product: Product, variant: Variant, size: string, quantity?: number, returnTo?: string) => void
  buyPackNow: (pack: Pack, selections: PackOrderComponent[], quantity?: number) => void
  addToCart: (product: Product, variant: Variant, size: string, quantity?: number) => void
  addPackToCart: (pack: Pack, selections: PackOrderComponent[], quantity?: number) => void
  removeFromCart: (productId: string, color: string, size: string, variantItemId?: string | null) => void
  removePackFromCart: (packId: string, selectionKey: string) => void
  updateQuantity: (productId: string, color: string, size: string, quantity: number, variantItemId?: string | null) => void
  updatePackQuantity: (packId: string, selectionKey: string, quantity: number) => void
  clearCart: () => void
  refreshCartProducts: (products: Product[]) => void
  getCartKey: (productId: string, color: string, size: string, variantItemId?: string | null) => string
  getPackCartKey: (packId: string, selections: PackOrderComponent[]) => string
} | null>(null)

function getPackSelectionKey(selections: PackOrderComponent[]) {
  return selections
    .map((item) => `${item.component_id ?? item.product_id}:${item.color}:${item.size}:${item.qty ?? 1}`)
    .sort()
    .join("|")
}

function getPackLineTotal(item: CartPackItem) {
  return (item.pack.pack_price ?? item.selections.reduce((sum, selection) => sum + selection.unit_price * (selection.qty ?? 1), 0)) * item.quantity
}

function buildProductAnalyticsItem(product: Product, variant: Variant, size: string, quantity: number): AnalyticsItem {
  return {
    product_id: product.id,
    variant_id: variant.meta_content_id ?? null,
    sku: product.sku ?? null,
    product_name: product.name,
    variant_name: `${variant.color} / ${size}`,
    item_type: "product",
    quantity,
    unit_price: product.price,
    line_total: product.price * quantity,
    currency: "TND",
  }
}

function buildPackAnalyticsItems(pack: Pack, selections: PackOrderComponent[], quantity: number): AnalyticsItem[] {
  return selections.map((selection) => ({
    product_id: selection.product_id,
    variant_id: null,
    sku: null,
    product_name: null,
    variant_name: `${selection.color} / ${selection.size}`,
    item_type: "pack_component",
    pack_id: pack.id,
    quantity: (selection.qty ?? 1) * quantity,
    unit_price: selection.unit_price,
    line_total: selection.unit_price * (selection.qty ?? 1) * quantity,
    currency: "TND",
  }))
}

function calculateCart(items: CartItem[], packItems: CartPackItem[]) {
  const productTotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const packTotal = packItems.reduce((sum, item) => sum + getPackLineTotal(item), 0)
  const productCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const packCount = packItems.reduce((sum, item) => sum + item.quantity, 0)

  return {
    items,
    packItems,
    total: productTotal + packTotal,
    itemCount: productCount + packCount,
  }
}

function getMaxCartQuantity(variant: Variant, size: string) {
  return getSelectableQuantityLimit(getVariantSize(variant, size))
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, variant, size, quantity = 1 } = action.payload
      const maxQuantity = getMaxCartQuantity(variant, size)
      if (maxQuantity <= 0) return state
      const variantItemId = resolveVariantItemId(variant, size)
      const cartKey = getProductCartKey(product.id, variant, size, variantItemId)

      const existingItemIndex = state.items.findIndex(
        (item) => getProductCartKey(item.product.id, item.selectedVariant, item.selectedSize, item.selectedVariantItemId) === cartKey,
      )

      let newItems: CartItem[]
      if (existingItemIndex > -1) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: Math.min(item.quantity + quantity, maxQuantity) }
            : item,
        )
      } else {
        newItems = [
          ...state.items,
          {
            product,
            selectedVariant: variant,
            selectedVariantItemId: variantItemId,
            selectedSize: size,
            quantity: Math.min(quantity, maxQuantity),
          },
        ]
      }

      return calculateCart(newItems, state.packItems)
    }

    case "ADD_PACK": {
      const { pack, selections, quantity = 1 } = action.payload
      const selectionKey = getPackSelectionKey(selections)

      const existingItemIndex = state.packItems.findIndex(
        (item) => item.pack.id === pack.id && getPackSelectionKey(item.selections) === selectionKey,
      )

      const newPackItems =
        existingItemIndex > -1
          ? state.packItems.map((item, index) =>
              index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item,
            )
          : [...state.packItems, { pack, selections, quantity }]

      return calculateCart(state.items, newPackItems)
    }

    case "REMOVE_ITEM": {
      const { productId, color, size, variantItemId } = action.payload

      const newItems = state.items.filter(
        (item) => !matchesCartItem(item, { productId, color, size, variantItemId }),
      )

      return calculateCart(newItems, state.packItems)
    }

    case "REMOVE_PACK": {
      const { packId, selectionKey } = action.payload
      const newPackItems = state.packItems.filter(
        (item) => item.pack.id !== packId || getPackSelectionKey(item.selections) !== selectionKey,
      )

      return calculateCart(state.items, newPackItems)
    }

    case "UPDATE_QUANTITY": {
      const { productId, color, size, variantItemId, quantity } = action.payload

      if (quantity <= 0) {
        return cartReducer(state, { type: "REMOVE_ITEM", payload: { productId, color, size, variantItemId } })
      }

      const newItems = state.items.map((item) =>
        matchesCartItem(item, { productId, color, size, variantItemId })
          ? { ...item, quantity: Math.min(quantity, getMaxCartQuantity(item.selectedVariant, item.selectedSize)) }
          : item,
      )

      return calculateCart(newItems, state.packItems)
    }

    case "UPDATE_PACK_QUANTITY": {
      const { packId, selectionKey, quantity } = action.payload
      if (quantity <= 0) {
        return cartReducer(state, { type: "REMOVE_PACK", payload: { packId, selectionKey } })
      }

      const newPackItems = state.packItems.map((item) =>
        item.pack.id === packId && getPackSelectionKey(item.selections) === selectionKey ? { ...item, quantity } : item,
      )

      return calculateCart(state.items, newPackItems)
    }

    case "CLEAR_CART":
      return { items: [], packItems: [], total: 0, itemCount: 0 }

    case "REFRESH_PRODUCTS": {
      const products = new Map(action.payload.map(product => [product.id, product]))
      return calculateCart(state.items.map(item => refreshCartSelection(item, products.get(item.product.id))), state.packItems)
    }

    case "LOAD_CART":
      return action.payload

    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const {preview: studioPreview} = useStudio()
  const router = useRouter()
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    packItems: [],
    total: 0,
    itemCount: 0,
  })
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    setLoaded(true)
    const savedCart = localStorage.getItem("savage-rise-cart")
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart)
        // Validate the cart data structure
        if (cartData && Array.isArray(cartData.items)) {
          // Ensure all items have the required structure
          const validItems = cartData.items.filter(
            (item: any) =>
              item.product && item.selectedVariant && item.selectedSize && typeof item.quantity === "number",
          )

          const validPackItems = Array.isArray(cartData.packItems)
            ? cartData.packItems.filter(
                (item: any) =>
                  item.pack && Array.isArray(item.selections) && typeof item.quantity === "number",
              )
            : []

          if (validItems.length > 0 || validPackItems.length > 0) {
            dispatch({
              type: "LOAD_CART",
              payload: calculateCart(validItems, validPackItems),
            })
          }
        }
      } catch (error) {
        // Clear invalid cart data
        localStorage.removeItem("savage-rise-cart")
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      if (!loaded) return
    localStorage.setItem("savage-rise-cart", JSON.stringify(state))
    } catch (error) {
    }
  }, [state, loaded])

  const cartItemsRef = useRef(state.items)
  cartItemsRef.current = state.items
  const productKey = [...new Set(state.items.map(item => item.product.id))].sort().join(",")
  useEffect(() => {
    if (!productKey) return
    let active = true
    let inFlight = false
    const refresh = async () => {
      if (inFlight) return
      inFlight = true
      try {
        const unique = [...new Map(cartItemsRef.current.map(item => [item.product.id, item.product])).values()]
        const products = await Promise.all(unique.map(async product => {
          try { return await api.getProduct(product.slug || product.id) }
          catch (error) { return { ...product, in_stock: undefined, availability_status: error instanceof ApiError && error.status === 404 ? "unavailable" as const : "unknown" as const } }
        }))
        if (active) dispatch({ type: "REFRESH_PRODUCTS", payload: products })
      } finally { inFlight = false }
    }
    void refresh()
    const timer = setInterval(refresh, 30000)
    window.addEventListener("online", refresh)
    window.addEventListener("focus", refresh)
    return () => { active = false; clearInterval(timer); window.removeEventListener("online", refresh); window.removeEventListener("focus", refresh) }
  }, [productKey, isCartOpen])

  const openCart = () => {
    setIsCartOpen(true)
  }

  const closeCart = () => {
    setIsCartOpen(false)
  }

  const addToCart = (product: Product, variant: Variant, size: string, quantity = 1) => {
    if (studioPreview) return
    // Validate inputs
    if (!product || product.in_stock === false || !variant || !size) {
      return
    }

    const items = [buildProductAnalyticsItem(product, variant, size, quantity)]
    const pixelContent = buildMetaCartItemContent({
      product,
      selectedVariant: variant,
      quantity,
    })

    const analyticsEvent = trackStoreEvent("add_to_cart", {
      product_id: product.id,
      variant_id: variant.meta_content_id ?? null,
      currency: "TND",
      value: product.price * quantity,
      items,
      metadata: {
        product_name: product.name,
        color: variant.color,
        size,
        quantity,
        unit_price: product.price,
      },
    })

    if (pixelContent) {
      trackMetaPixelEvent("AddToCart", {
        content_ids: [pixelContent.id],
        content_name: product.name,
        content_type: "product",
        contents: [pixelContent],
        currency: "TND",
        value: product.price * quantity,
      }, {
        eventID: analyticsEvent.eventId ?? undefined,
      })
    }
    dispatch({ type: "ADD_ITEM", payload: { product, variant, size, quantity } })
    openCart()
  }

  const addPackToCart = (pack: Pack, selections: PackOrderComponent[], quantity = 1) => {
    if (studioPreview) return
    if (!pack || pack.in_stock === false || selections.length < 2) {
      return
    }

    const value =
      (pack.pack_price ?? selections.reduce((sum, selection) => sum + selection.unit_price * (selection.qty ?? 1), 0)) *
      quantity
    const items = buildPackAnalyticsItems(pack, selections, quantity)

    const analyticsEvent = trackStoreEvent("add_to_cart", {
      currency: "TND",
      value,
      items,
      metadata: {
        item_type: "pack",
        pack_id: pack.id,
        pack_title: pack.title,
        quantity,
      },
    })
    const pixelContents = selections
      .map((selection) => buildMetaPackSelectionContent(selection, quantity))
      .filter((content): content is NonNullable<typeof content> => Boolean(content))

    if (pixelContents.length === selections.length) {
      trackMetaPixelEvent("AddToCart", {
        content_ids: pixelContents.map((content) => content.id),
        content_name: pack.title,
        content_type: "product",
        contents: pixelContents,
        currency: "TND",
        value,
      }, {
        eventID: analyticsEvent.eventId ?? undefined,
      })
    }
    dispatch({ type: "ADD_PACK", payload: { pack, selections, quantity } })
    openCart()
  }

  const removeFromCart = (productId: string, color: string, size: string, variantItemId?: string | null) => {
    const item = state.items.find(
      (cartItem) =>
        matchesCartItem(cartItem, { productId, color, size, variantItemId }),
    )
    trackStoreEvent("remove_from_cart", {
      product_id: productId,
      metadata: {
        item_type: "product",
        product_name: item?.product.name,
        color,
        size,
        quantity: item?.quantity,
        unit_price: item?.product.price,
      },
    })
    dispatch({ type: "REMOVE_ITEM", payload: { productId, color, size, variantItemId } })
  }

  const removePackFromCart = (packId: string, selectionKey: string) => {
    const item = state.packItems.find(
      (cartItem) => cartItem.pack.id === packId && getPackSelectionKey(cartItem.selections) === selectionKey,
    )
    trackStoreEvent("remove_from_cart", {
      metadata: {
        item_type: "pack",
        pack_id: packId,
        pack_title: item?.pack.title,
        quantity: item?.quantity,
        items: item?.selections,
      },
    })
    dispatch({ type: "REMOVE_PACK", payload: { packId, selectionKey } })
  }

  const updateQuantity = (productId: string, color: string, size: string, quantity: number, variantItemId?: string | null) => {
    const item = state.items.find(
      (cartItem) =>
        matchesCartItem(cartItem, { productId, color, size, variantItemId }),
    )
    trackStoreEvent("cart_quantity_changed", {
      product_id: productId,
      event_category: "cart",
      action_target: "product_quantity",
      metadata: {
        item_type: "product",
        product_name: item?.product.name,
        color,
        size,
        previous_quantity: item?.quantity,
        next_quantity: quantity,
        unit_price: item?.product.price,
      },
    })
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, color, size, variantItemId, quantity } })
  }

  const updatePackQuantity = (packId: string, selectionKey: string, quantity: number) => {
    const item = state.packItems.find(
      (cartItem) => cartItem.pack.id === packId && getPackSelectionKey(cartItem.selections) === selectionKey,
    )
    trackStoreEvent("cart_quantity_changed", {
      event_category: "cart",
      action_target: "pack_quantity",
      metadata: {
        item_type: "pack",
        pack_id: packId,
        pack_title: item?.pack.title,
        previous_quantity: item?.quantity,
        next_quantity: quantity,
        items: item?.selections,
      },
    })
    dispatch({ type: "UPDATE_PACK_QUANTITY", payload: { packId, selectionKey, quantity } })
  }

  const clearCart = () => {
    trackStoreEvent("cart_cleared", {
      event_category: "cart",
      action_target: "cart",
      metadata: {
        product_item_count: state.items.length,
        pack_item_count: state.packItems.length,
        item_count: state.itemCount,
        cart_total: state.total,
      },
    })
    dispatch({ type: "CLEAR_CART" })
  }

  const refreshCartProducts = (products: Product[]) => dispatch({ type: "REFRESH_PRODUCTS", payload: products })

  const launchPurchase = (purchase: CartState, returnTo: string) => {
    const intent = saveQuickPurchase(sessionStorage, "savage-rise-quick-purchase", purchase, returnTo)
    router.push("/checkout" + "?buy=" + intent.id)
  }
  const buyNow = (product: Product, variant: Variant, size: string, quantity = 1, returnTo?: string) => {
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > getMaxCartQuantity(variant, size)) throw new Error("This quantity is unavailable.")
    const purchase = cartReducer({items: [], packItems: [], total: 0, itemCount: 0}, {type: "ADD_ITEM", payload: {product, variant, size, quantity}})
    if (!purchase.itemCount) throw new Error("This option is unavailable.")
    const query = new URLSearchParams({variant: resolveVariantItemId(variant, size) || variant.id || "", qty: String(quantity)})
    launchPurchase(purchase, (returnTo || window.location.pathname) + "?" + query)
  }
  const buyPackNow = (pack: Pack, selections: PackOrderComponent[], quantity = 1) => {
    if (!Number.isInteger(quantity) || quantity < 1 || !pack.in_stock || !selections.length) throw new Error("This pack is unavailable.")
    const query = new URLSearchParams({selection: JSON.stringify(selections.map(item => ({component_id: item.component_id, color: item.color, size: item.size}))), qty: String(quantity)})
    launchPurchase(calculateCart([], [{pack, selections, quantity}]), window.location.pathname + "?" + query)
  }

  const getCartKey = (productId: string, color: string, size: string, variantItemId?: string | null) => {
    if (variantItemId) return `${productId}-${variantItemId}`
    return `${productId}-${color}-${size}`
  }

  const getPackCartKey = (packId: string, selections: PackOrderComponent[]) => {
    return `${packId}-${getPackSelectionKey(selections)}`
  }

  return (
    <CartContext.Provider
      value={{
        loaded,
        state,
        isCartOpen,
        dispatch,
        openCart,
        closeCart,
        buyNow,
        buyPackNow,
        addToCart,
        addPackToCart,
        removeFromCart,
        removePackFromCart,
        updateQuantity,
        updatePackQuantity,
        clearCart,
        refreshCartProducts,
        getCartKey,
        getPackCartKey,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
