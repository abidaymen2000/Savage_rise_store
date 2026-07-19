import { ReviewsService, type ReviewOut, type ReviewStats as GeneratedReviewStats } from "./generated"
import { withApiErrors } from "./api-error"
import type { Review, ReviewCreate, ReviewStats, ReviewUpdate } from "@/types/api"

export const reviewsApi = {
  async getProductReviews(productId: string, rating?: number, sortBest = false, skip = 0, limit = 10): Promise<Review[]> {
    return (await withApiErrors(ReviewsService.getReviewsProductsProductIdReviewsGet({
      productId,
      rating,
      sortBest,
      skip,
      limit,
    }))) as ReviewOut[] as Review[]
  },

  async getReviewStats(productId: string): Promise<ReviewStats> {
    return (await withApiErrors(ReviewsService.reviewStatsProductsProductIdReviewsStatsGet({ productId }))) as GeneratedReviewStats as ReviewStats
  },

  async addReview(productId: string, rating: number, comment: string, title?: string): Promise<Review> {
    const requestBody = { rating, comment: comment ?? null, title: title ?? null }
    return (await withApiErrors(ReviewsService.addReviewProductsProductIdReviewsPost({ productId, requestBody }))) as ReviewOut as Review
  },

  async updateReview(productId: string, reviewId: string, data: ReviewUpdate): Promise<Review> {
    return (await withApiErrors(ReviewsService.editReviewProductsProductIdReviewsReviewIdPut({
      productId,
      reviewId,
      requestBody: data,
    }))) as ReviewOut as Review
  },

  async deleteReview(productId: string, reviewId: string): Promise<void> {
    await withApiErrors(ReviewsService.removeReviewProductsProductIdReviewsReviewIdDelete({ productId, reviewId }))
  },
}
