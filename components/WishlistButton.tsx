"use client"

import { useState, useEffect } from "react"
import { Heart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast" // Assuming you have useToast from shadcn/ui
import { trackMetaPixelEvent } from "@/lib/meta-pixel"

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
        }
      }
      checkWishlist()
    }
  }, [productId, isAuthenticated, authLoading, initialIsInWishlist])

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add products to your wishlist.",
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
          title: "Product removed",
          description: "The product has been removed from your wishlist.",
        })
      } else {
        await api.addToWishlist(productId)
        setIsInWishlist(true)
        trackMetaPixelEvent("AddToWishlist", {
          content_ids: [productId],
          content_type: "product",
        })
        toast({
          title: "Product added",
          description: "The product has been added to your wishlist.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to update the wishlist. Please try again.",
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
      <span className="sr-only">{isInWishlist ? "Remove from wishlist" : "Add to wishlist"}</span>
    </Button>
  )
}
