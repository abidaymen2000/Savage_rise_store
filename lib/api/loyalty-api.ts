import { LoyaltyService, type LoyaltyBalanceOut, type LoyaltyQuoteIn, type LoyaltyQuoteOut } from "./generated"
import { withApiErrors } from "./api-error"
import type { LoyaltyBalance, LoyaltyQuote, LoyaltyQuoteRequest } from "@/types/api"

export const loyaltyApi = {
  async getMyLoyaltyBalance(limit = 5): Promise<LoyaltyBalance> {
    return (await withApiErrors(LoyaltyService.getMyLoyaltyBalanceLoyaltyMeGet({ limit }))) as LoyaltyBalanceOut as LoyaltyBalance
  },

  async quoteLoyaltyRedemption(data: LoyaltyQuoteRequest): Promise<LoyaltyQuote> {
    return (await withApiErrors(LoyaltyService.quoteLoyaltyRedemptionLoyaltyQuotePost({ requestBody: data as LoyaltyQuoteIn }))) as LoyaltyQuoteOut as LoyaltyQuote
  },
}

