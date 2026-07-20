import "./api-client"
import { ApiError } from "./api-error"
import { API_BASE_URL } from "./api-client"
import { authApi } from "./auth-api"
import { catalogApi } from "./catalog-api"
import { ordersApi } from "./orders-api"
import { shippingApi } from "./shipping-api"
import { promocodesApi } from "./promocodes-api"
import { profileApi } from "./profile-api"
import { wishlistApi } from "./wishlist-api"
import { reviewsApi } from "./reviews-api"
import { cmsApi } from "./cms-api"
import { storeConfigApi } from "./store-config-api"
import { analyticsApi } from "./analytics-api"
import { loyaltyApi } from "./loyalty-api"
import { storeNavigationApi } from "./store-navigation-api"
import { DefaultService, type HealthStatus } from "./generated"
import { withApiErrors } from "./api-error"

export { API_BASE_URL, ApiError }

export const api = {
  ...authApi,
  ...catalogApi,
  ...ordersApi,
  ...shippingApi,
  ...promocodesApi,
  ...profileApi,
  ...wishlistApi,
  ...reviewsApi,
  ...cmsApi,
  ...storeConfigApi,
  ...loyaltyApi,
  ...storeNavigationApi,

  async trackAnalyticsEvent(payload: Parameters<typeof analyticsApi.trackEvent>[0]): Promise<void> {
    await analyticsApi.trackEvent(payload)
  },

  async checkHealth(): Promise<HealthStatus> {
    return withApiErrors(DefaultService.checkHealth())
  },
}
