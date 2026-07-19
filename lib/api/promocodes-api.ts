import { PromoCodesService, type ApplyResponse } from "./generated"
import { withApiErrors } from "./api-error"
import type { OrderItemCreate } from "@/types/api"

export const promocodesApi = {
  async applyPromo(code: string, items: OrderItemCreate[], orderTotal: number): Promise<ApplyResponse> {
    return withApiErrors(PromoCodesService.applyCodePromocodesApplyPost({
      requestBody: {
        code: code.trim().toUpperCase(),
        order_total: orderTotal,
        product_ids: items.map((item) => item.product_id),
        category_ids: [],
      },
    }))
  },
}

