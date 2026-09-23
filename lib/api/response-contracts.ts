import { z } from "zod"
import { ApiError, reportApiFailure, type ApiOperation } from "./api-error"

const id = z.string().min(1)
const amount = z.union([z.number(), z.string().min(1)]).refine((value) => Number.isFinite(Number(value)) && Number(value) >= 0)
const media = z.object({ url: id }).passthrough()
const listItem = z.object({ id, slug: id, name: id, product_kind: id }).passthrough()

export const catalogPageContract = z.object({
  items: z.array(listItem), total: z.number().int().nonnegative(),
  page: z.number().int().positive(), page_size: z.number().int().positive(), pages: z.number().int().nonnegative(),
}).passthrough()

export const categoriesContract = z.array(z.object({ id, name: id, slug: id }).passthrough())

export const productDetailContract = listItem.extend({
  status: id,
  media: z.array(media).optional(),
  variants: z.array(z.object({
    id, title: z.string(), base_price: amount.nullable(), effective_price: amount.nullable().optional(),
    option_values: z.record(z.string()).optional(), media: z.array(media).optional(),
    inventory: z.object({
      track_inventory: z.boolean(), stock_available: z.number().nonnegative(), in_stock: z.boolean(),
    }).passthrough().nullable().optional(),
  }).passthrough()).optional(),
}).passthrough().refine((product) => product.product_kind === "bundle" ||
  (product.variants ?? []).every((variant) => (variant.effective_price ?? variant.base_price) != null))

export const quoteContract = z.object({
  subtotal: z.number().finite().nonnegative(), shipping_amount: z.number().finite().nonnegative(),
  total: z.number().finite().nonnegative().optional(), total_amount: z.number().finite().nonnegative().optional(),
}).passthrough().refine((value) => value.total !== undefined || value.total_amount !== undefined)

export function validateApiResponse<T>(value: T, schema: z.ZodTypeAny, operation: ApiOperation): T {
  if (!schema.safeParse(value).success) {
    const error = new ApiError(502, { code: "INVALID_API_RESPONSE" }, "La réponse du service est incomplète. Réessayez dans quelques instants.", operation)
    reportApiFailure(error)
    throw error
  }
  return value
}
