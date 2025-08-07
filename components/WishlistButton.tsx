"use client"

import { useState, useEffect } from "react"
import { Heart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast" // Assuming you have useToast from shadcn/ui

interface WishlistButtonProps {
  productId: string
  initialIsInWishlist?: boolean
  className?: string
}

export default function WishlistButton({ productId, initialIsInWishlist = false, className }: WishlistButtonProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [isInWishlist, setIsInWishlist] = useState(initialIsInWishlist)
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  // Fetch initial wishlist status if not provided
  useEffect(() => {
    if (isAuthenticated && !authLoading && initialIsInWishlist === undefined) {
      const checkWishlist = async () => {
        try {
          const wishlist = await api.getWishlist()
          setIsInWishlist(wishlist.some(item => item.product_id === productId))
        } catch (error) {
          console.error("Failed to fetch wishlist status:", error)
        }
      }
      checkWishlist()
    }
  }, [productId, isAuthenticated, authLoading, initialIsInWishlist])

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour ajouter des produits à votre wishlist.",
        variant: "destructive",
      })
      return
    }

    setIsUpdating(true)
    try {
      if (isInWishlist) {
        await api.removeFromWishlist(productId)
        setIsInWishlist(false)
        toast({
          title: "Produit retiré",
          description: "Le produit a été retiré de votre wishlist.",
        })
      } else {
        await api.addToWishlist(productId)
        setIsInWishlist(true)
        toast({
          title: "Produit ajouté",
          description: "Le produit a été ajouté à votre wishlist.",
        })
      }
    } catch (error) {
      console.error("Failed to update wishlist:", error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la wishlist. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className={`border-white text-white hover:bg-white hover:text-black bg-transparent ${className}`}
      onClick={handleToggleWishlist}
      disabled={isUpdating || authLoading}
    >
      <Heart className={`h-5 w-5 ${isInWishlist ? "fill-current text-red-500" : ""}`} />
      <span className="sr-only">{isInWishlist ? "Retirer de la wishlist" : "Ajouter à la wishlist"}</span>
    </Button>
  )
}
