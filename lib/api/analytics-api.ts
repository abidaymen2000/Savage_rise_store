import { OpenAPI } from "./generated"
import { request } from "./generated/core/request"
import { withApiErrors } from "./api-error"
import type { StoreAnalyticsEventPayload } from "@/types/api"

export const analyticsApi = {
  async trackEvent(payload: StoreAnalyticsEventPayload): Promise<void> {
    await withApiErrors(request(OpenAPI, {
      method: "POST",
      url: "/analytics/events",
      body: payload,
      mediaType: "application/json",
    }))
  },
}

