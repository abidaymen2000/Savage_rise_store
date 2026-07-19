import { WishlistService, type WishlistOut } from "./generated"
import { withApiErrors } from "./api-error"
import type { WishlistCreate, WishlistItem } from "@/types/api"

export const wishlistApi = {
  async getWishlist(skip = 0, limit = 20): Promise<WishlistItem[]> {
    return (await withApiErrors(WishlistService.getWishlistProfileWishlistGet({ skip, limit }))) as WishlistOut[] as WishlistItem[]
  },

  async addToWishlist(productId: string): Promise<WishlistItem> {
    const requestBody: WishlistCreate = { product_id: productId }
    return (await withApiErrors(WishlistService.addWishProfileWishlistPost({ requestBody }))) as WishlistOut as WishlistItem
  },

  async removeFromWishlist(productId: string): Promise<void> {
    await withApiErrors(WishlistService.removeWishProfileWishlistProductIdDelete({ productId }))
  },
}

