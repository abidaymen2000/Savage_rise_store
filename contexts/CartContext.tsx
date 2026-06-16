"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import type { CartItem, CartPackItem, Pack, PackOrderComponent, Product, Variant } from "@/types/api"

interface CartState {
  items: CartItem[]
  packItems: CartPackItem[]
  total: number
  itemCount: number
}

type CartAction =
  | {
      type: "ADD_ITEM"
      payload: { product: Product; variant: Variant; size: string; quantity?: number }
    }
  | {
      type: "ADD_PACK"
      payload: { pack: Pack; selections: PackOrderComponent[]; quantity?: number }
    }
  | { type: "REMOVE_ITEM"; payload: { productId: string; color: string; size: string } }
  | { type: "REMOVE_PACK"; payload: { packId: string; selectionKey: string } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; color: string; size: string; quantity: number } }
  | { type: "UPDATE_PACK_QUANTITY"; payload: { packId: string; selectionKey: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartState }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
  addToCart: (product: Product, variant: Variant, size: string, quantity?: number) => void
  addPackToCart: (pack: Pack, selections: PackOrderComponent[], quantity?: number) => void
  removeFromCart: (productId: string, color: string, size: string) => void
  removePackFromCart: (packId: string, selectionKey: string) => void
  updateQuantity: (productId: string, color: string, size: string, quantity: number) => void
  updatePackQuantity: (packId: string, selectionKey: string, quantity: number) => void
  clearCart: () => void
  getCartKey: (productId: string, color: string, size: string) => string
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

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, variant, size, quantity = 1 } = action.payload
      const cartKey = `${product.id}-${variant.color}-${size}`

      const existingItemIndex = state.items.findIndex(
        (item) => `${item.product.id}-${item.selectedVariant.color}-${item.selectedSize}` === cartKey,
      )

      let newItems: CartItem[]
      if (existingItemIndex > -1) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item,
        )
      } else {
        newItems = [
          ...state.items,
          {
            product,
            selectedVariant: variant,
            selectedSize: size,
            quantity,
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
      const { productId, color, size } = action.payload
      const cartKey = `${productId}-${color}-${size}`

      const newItems = state.items.filter(
        (item) => `${item.product.id}-${item.selectedVariant.color}-${item.selectedSize}` !== cartKey,
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
      const { productId, color, size, quantity } = action.payload
      const cartKey = `${productId}-${color}-${size}`

      if (quantity <= 0) {
        return cartReducer(state, { type: "REMOVE_ITEM", payload: { productId, color, size } })
      }

      const newItems = state.items.map((item) =>
        `${item.product.id}-${item.selectedVariant.color}-${item.selectedSize}` === cartKey
          ? { ...item, quantity }
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

    case "LOAD_CART":
      return action.payload

    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    packItems: [],
    total: 0,
    itemCount: 0,
  })

  // Load cart from localStorage on mount
  useEffect(() => {
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
        console.error("Error loading cart from localStorage:", error)
        // Clear invalid cart data
        localStorage.removeItem("savage-rise-cart")
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("savage-rise-cart", JSON.stringify(state))
    } catch (error) {
      console.error("Error saving cart to localStorage:", error)
    }
  }, [state])

  const addToCart = (product: Product, variant: Variant, size: string, quantity = 1) => {
    // Validate inputs
    if (!product || !variant || !size) {
      console.error("Invalid cart item data:", { product, variant, size })
      return
    }

    dispatch({ type: "ADD_ITEM", payload: { product, variant, size, quantity } })
  }

  const addPackToCart = (pack: Pack, selections: PackOrderComponent[], quantity = 1) => {
    if (!pack || selections.length < 2) {
      console.error("Invalid pack cart item data:", { pack, selections })
      return
    }

    dispatch({ type: "ADD_PACK", payload: { pack, selections, quantity } })
  }

  const removeFromCart = (productId: string, color: string, size: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { productId, color, size } })
  }

  const removePackFromCart = (packId: string, selectionKey: string) => {
    dispatch({ type: "REMOVE_PACK", payload: { packId, selectionKey } })
  }

  const updateQuantity = (productId: string, color: string, size: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, color, size, quantity } })
  }

  const updatePackQuantity = (packId: string, selectionKey: string, quantity: number) => {
    dispatch({ type: "UPDATE_PACK_QUANTITY", payload: { packId, selectionKey, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const getCartKey = (productId: string, color: string, size: string) => {
    return `${productId}-${color}-${size}`
  }

  const getPackCartKey = (packId: string, selections: PackOrderComponent[]) => {
    return `${packId}-${getPackSelectionKey(selections)}`
  }

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        addToCart,
        addPackToCart,
        removeFromCart,
        removePackFromCart,
        updateQuantity,
        updatePackQuantity,
        clearCart,
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
