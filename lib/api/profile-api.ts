import { ProfileService, type OrderOut, type ReviewOut, type UserOut, type UserUpdate } from "./generated"
import { withApiErrors } from "./api-error"
import type { Order, PasswordChange, Review, User } from "@/types/api"

export const profileApi = {
  async getProfile(): Promise<User> {
    return (await withApiErrors(ProfileService.readProfileProfileMeGet())) as UserOut as User
  },

  async updateProfile(data: UserUpdate): Promise<User> {
    return (await withApiErrors(ProfileService.updateProfileProfileMePatch({ requestBody: data }))) as UserOut as User
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const requestBody: PasswordChange = { current_password: currentPassword, new_password: newPassword }
    await withApiErrors(ProfileService.changePasswordProfileChangePasswordPost({ requestBody }))
  },

  async getMyOrders(): Promise<Order[]> {
    return (await withApiErrors(ProfileService.listMyOrdersProfileOrdersGet())) as OrderOut[] as Order[]
  },

  async getMyOrder(orderId: string): Promise<Order> {
    return (await withApiErrors(ProfileService.profileGetOneOrderProfileOrdersOrderIdGet({ orderId }))) as OrderOut as Order
  },

  async getMyReviews(skip = 0, limit = 20): Promise<Review[]> {
    return (await withApiErrors(ProfileService.getMyReviewsProfileReviewsGet({ skip, limit }))) as ReviewOut[] as Review[]
  },
}

