"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Star, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api"
import type { Review, ReviewStats } from "@/types/api"
import { useToast } from "@/components/ui/use-toast"

interface ProductReviewSectionProps {
  productId: string
}

export default function ProductReviewSection({ productId }: ProductReviewSectionProps) {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { toast } = useToast()

  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null)
  const [loadingReviews, setLoadingReviews] = useState(true)
  const [reviewError, setReviewError] = useState<string | null>(null)

  const [userRating, setUserRating] = useState(0)
  const [userComment, setUserComment] = useState("")
  const [userReviewTitle, setUserReviewTitle] = useState("")
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [hasSubmittedReview, setHasSubmittedReview] = useState(false) // To prevent multiple submissions

  useEffect(() => {
    fetchReviewsAndStats()
  }, [productId, hasSubmittedReview]) // Re-fetch after a new review is submitted

  const fetchReviewsAndStats = async () => {
    setLoadingReviews(true)
    setReviewError(null)
    try {
      const [fetchedReviews, fetchedStats] = await Promise.all([
        api.getProductReviews(productId),
        api.getReviewStats(productId),
      ])
      setReviews(fetchedReviews)
      setReviewStats(fetchedStats)
    } catch (err) {
      console.error("Error fetching reviews:", err)
      setReviewError("Impossible de charger les avis.")
    } finally {
      setLoadingReviews(false)
    }
  }

  const handleStarClick = (rating: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour laisser un avis.",
        variant: "destructive",
      })
      return
    }
    setUserRating(rating)
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated || !userRating || isSubmittingReview) return

    setIsSubmittingReview(true)
    setReviewError(null)

    try {
      await api.addReview(productId, userRating, userComment, userReviewTitle)
      toast({
        title: "Avis soumis",
        description: "Merci pour votre avis !",
      })
      setUserRating(0)
      setUserComment("")
      setUserReviewTitle("")
      setHasSubmittedReview(true) // Trigger re-fetch of reviews
    } catch (err) {
      console.error("Error submitting review:", err)
      setReviewError("Impossible de soumettre votre avis. Veuillez réessayer.")
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const renderStars = (rating: number, maxStars = 5, clickable = false) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: maxStars }, (_, i) => i + 1).map((starValue) => (
          <Star
            key={starValue}
            className={`h-5 w-5 ${
              starValue <= rating ? "text-gold fill-gold" : "text-gray-500"
            } ${clickable ? "cursor-pointer" : ""}`}
            onClick={clickable ? () => handleStarClick(starValue) : undefined}
          />
        ))}
      </div>
    )
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Star className="h-5 w-5 text-gold" />
          Avis des clients
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {reviewStats && reviewStats.count > 0 && (
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl font-bold text-gold">
              {reviewStats.average_rating?.toFixed(1) || "N/A"}
            </div>
            <div className="flex flex-col">
              {renderStars(reviewStats.average_rating || 0)}
              <p className="text-gray-400 text-sm">Basé sur {reviewStats.count} avis</p>
            </div>
          </div>
        )}

        <Separator className="bg-gray-700" />

        {/* Review Submission Form */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Laisser un avis</h3>
          {!isAuthenticated && !authLoading ? (
            <Alert className="border-blue-600 bg-blue-900/20">
              <AlertDescription className="text-blue-400">
                Veuillez vous connecter pour laisser un avis sur ce produit.
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <Label htmlFor="rating">Votre note *</Label>
                {renderStars(userRating, 5, true)}
              </div>

              {userRating > 0 && (
                <>
                  <div>
                    <Label htmlFor="review-title">Titre (facultatif)</Label>
                    <Textarea
                      id="review-title"
                      placeholder="Un titre pour votre avis..."
                      value={userReviewTitle}
                      onChange={(e) => setUserReviewTitle(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                      rows={1}
                    />
                  </div>
                  <div>
                    <Label htmlFor="review-comment">Commentaire (facultatif)</Label>
                    <Textarea
                      id="review-comment"
                      placeholder="Partagez votre expérience avec ce produit..."
                      value={userComment}
                      onChange={(e) => setUserComment(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                      rows={4}
                    />
                  </div>
                  {reviewError && (
                    <Alert className="border-red-600 bg-red-900/20">
                      <AlertDescription className="text-red-400">{reviewError}</AlertDescription>
                    </Alert>
                  )}
                  <Button
                    type="submit"
                    disabled={isSubmittingReview || userRating === 0}
                    className="w-full bg-gold text-black hover:bg-gold/90 font-semibold"
                  >
                    {isSubmittingReview ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Soumission...
                      </>
                    ) : (
                      "Soumettre l'avis"
                    )}
                  </Button>
                </>
              )}
            </form>
          )}
        </div>

        <Separator className="bg-gray-700" />

        {/* Existing Reviews */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Tous les avis ({reviews.length})</h3>
          {loadingReviews ? (
            <div className="text-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-gold mx-auto" />
              <p className="text-gray-400 mt-2">Chargement des avis...</p>
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-gray-400">Soyez le premier à laisser un avis pour ce produit !</p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-800 pb-4 last:border-b-0">
                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-400">
                      {new Date(review.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  {review.title && <h4 className="font-semibold text-white text-lg mb-1">{review.title}</h4>}
                  {review.comment && <p className="text-gray-300 text-sm">{review.comment}</p>}
                  <p className="text-xs text-gray-500 mt-2">Par: {review.user_id.slice(0, 8)}...</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
