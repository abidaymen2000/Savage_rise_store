import { ShippingRatesService, type ShippingQuoteRequest, type ShippingQuoteResponse } from "./api-client"
import { withApiErrors } from "./api-error"

import { OpenAPI } from "./api-client"
import { request } from "./generated/core/request"
import type { ShippingPolicy } from "@/lib/checkout-flow"

export const shippingApi = {
  getShippingPolicy: (country: string): Promise<ShippingPolicy> => withApiErrors(request(OpenAPI, {method: "GET", url: "/shipping-rates/policy", query: {country}})),
  async getShippingQuote(data: ShippingQuoteRequest): Promise<ShippingQuoteResponse> {
    return withApiErrors(ShippingRatesService.quoteShippingRateShippingRatesQuotePost({ requestBody: data }))
  },
}

