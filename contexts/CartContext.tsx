"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import type { CartItem, Product, Variant } from "@/types/api"

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

type CartAction =
  | {
      type: "ADD_ITEM"
      payload: { product: Product; variant: Variant; size: string; quantity?: number }
    }
  | { type: "REMOVE_ITEM"; payload: { productId: string; color: string; size: string } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; color: string; size: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartState }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
  addToCart: (product: Product, variant: Variant, size: string, quantity?: number) => void
  removeFromCart: (productId: string, color: string, size: string) => void
  updateQuantity: (productId: string, color: string, size: string, quantity: number) => void
  clearCart: () => void
  getCartKey: (productId: string, color: string, size: string) => string
} | null>(null)

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

      const total = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return { items: newItems, total, itemCount }
    }

    case "REMOVE_ITEM": {
      const { productId, color, size } = action.payload
      const cartKey = `${productId}-${color}-${size}`

      const newItems = state.items.filter(
        (item) => `${item.product.id}-${item.selectedVariant.color}-${item.selectedSize}` !== cartKey,
      )

      const total = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return { items: newItems, total, itemCount }
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

      const total = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return { items: newItems, total, itemCount }
    }

    case "CLEAR_CART":
      return { items: [], total: 0, itemCount: 0 }

    case "LOAD_CART":
      return action.payload

    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
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

          if (validItems.length > 0) {
            const total = validItems.reduce(
              (sum: number, item: CartItem) => sum + item.product.price * item.quantity,
              0,
            )
            const itemCount = validItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)

            dispatch({
              type: "LOAD_CART",
              payload: {
                items: validItems,
                total,
                itemCount,
              },
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

  const removeFromCart = (productId: string, color: string, size: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { productId, color, size } })
  }

  const updateQuantity = (productId: string, color: string, size: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, color, size, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const getCartKey = (productId: string, color: string, size: string) => {
    return `${productId}-${color}-${size}`
  }

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartKey,
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
