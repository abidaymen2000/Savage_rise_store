import { ShippingRatesService, type ShippingQuoteRequest, type ShippingQuoteResponse } from "./api-client"
import { withApiErrors } from "./api-error"

export const shippingApi = {
  async getShippingQuote(data: ShippingQuoteRequest): Promise<ShippingQuoteResponse> {
    return withApiErrors(ShippingRatesService.quoteShippingRateShippingRatesQuotePost({ requestBody: data }))
  },
}

