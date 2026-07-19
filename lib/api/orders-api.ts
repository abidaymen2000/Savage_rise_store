import { OrdersService, ProfileService, type OrderCreate, type OrderOut, type OrderQuoteOut } from "./generated"
import { withApiErrors } from "./api-error"
import type { Order, OrderActionReasonIn, OrderCreatePayload, OrderQuoteOut as StoreOrderQuoteOut } from "@/types/api"

function normalizeQuote(quote: OrderQuoteOut): StoreOrderQuoteOut {
  return {
    ...quote,
    pack_discount: quote.bundle_discount_value ?? 0,
    promotion_discount: quote.discount_value ?? 0,
    loyalty_discount: quote.loyalty_discount_value ?? 0,
    shipping_amount: quote.shipping_amount ?? 0,
    subtotal: quote.subtotal ?? 0,
    total: quote.total_amount,
    total_amount: quote.total_amount,
    warnings: quote.warnings ?? [],
  } as StoreOrderQuoteOut
}

function normalizeOrderPayload(payload: OrderCreatePayload): OrderCreate {
  const source = payload as OrderCreatePayload & {
    pack_items?: Array<{
      pack_id: string
      qty: number
      items?: Array<{ component_id?: string | null; variant_id?: string | null; variant_item_id?: string | null }>
    }>
  }
  return {
    ...source,
    items: [
      ...(source.items ?? []).map((item: any) => ({
        product_id: item.product_id,
        variant_id: item.variant_id ?? item.variant_item_id ?? null,
        sku: item.sku ?? null,
        qty: item.qty,
      })),
      ...(source.pack_items ?? []).map((pack) => ({
        product_id: pack.pack_id,
        variant_id: null,
        sku: null,
        qty: pack.qty,
        bundle_selection: {
          components: (pack.items ?? [])
            .map((item) => ({
              component_id: item.component_id ?? "",
              variant_id: item.variant_id ?? item.variant_item_id ?? "",
            }))
            .filter((item) => item.component_id && item.variant_id),
        },
      })),
    ],
    pack_items: undefined,
  } as OrderCreate
}

export const ordersApi = {
  async quoteOrder(payload: OrderCreatePayload): Promise<StoreOrderQuoteOut> {
    return normalizeQuote(await withApiErrors(OrdersService.apiQuoteOrderOrdersQuotePost({ requestBody: normalizeOrderPayload(payload) })))
  },

  async createOrder(payload: OrderCreatePayload, idempotencyKey: string): Promise<Order> {
    return (await withApiErrors(OrdersService.apiCreateOrderOrdersPost({
      idempotencyKey,
      requestBody: normalizeOrderPayload(payload),
    }))) as OrderOut as Order
  },

  async cancelOrder(orderId: string, payload?: OrderActionReasonIn | null): Promise<Order> {
    return (await withApiErrors(OrdersService.apiCancelOrderOrdersOrderIdCancelPatch({
      orderId,
      requestBody: payload ?? undefined,
    }))) as OrderOut as Order
  },

  async getOrder(orderId: string): Promise<Order> {
    return (await withApiErrors(ProfileService.profileGetOneOrderProfileOrdersOrderIdGet({ orderId }))) as OrderOut as Order
  },
}
