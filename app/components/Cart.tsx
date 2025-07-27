"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag, Plus, Minus, X, Truck } from "lucide-react"
import { useCart } from "@/contexts/CartContext"

export default function Cart() {
  const { state, updateQuantity, removeFromCart } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  return (
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
                {state.items.map((item) => (
                  <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`} className="flex gap-4">
                    <div className="w-20 h-20 relative overflow-hidden rounded-lg bg-gray-900">
                      <Image
                        src={item.product.images[0]?.url || "/placeholder.svg?height=80&width=80"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-sm line-clamp-2">{item.product.name}</h3>
                          {item.selectedColor && <p className="text-xs text-gray-400">Couleur: {item.selectedColor}</p>}
                          {item.selectedSize && <p className="text-xs text-gray-400">Taille: {item.selectedSize}</p>}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-gray-400 hover:text-white"
                          onClick={() => removeFromCart(item.product.id)}
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
                            onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="font-semibold text-gold">{(item.product.price * item.quantity).toFixed(2)} €</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="bg-gray-800" />

              {/* Cart Summary */}
              <div className="space-y-4 py-6">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Truck className="h-4 w-4" />
                  <span>Livraison gratuite dès 200€</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Sous-total</span>
                    <span>{state.total.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Livraison</span>
                    <span>{state.total >= 200 ? "Gratuite" : "15,00 €"}</span>
                  </div>
                  <Separator className="bg-gray-800" />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-gold">{(state.total + (state.total >= 200 ? 0 : 15)).toFixed(2)} €</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-gold text-black hover:bg-gold/90 font-semibold py-3"
                  onClick={() => setIsOpen(false)}
                >
                  Procéder au paiement
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
