import type { ProductListItem, ProductStorefrontDetail, ProductVariantListSummary, ProductVariantRead } from "@/lib/api/generated"
import { CatalogIntegrityError } from "@/lib/catalog-read"

// Additive Core listing contract. Older Core deployments use the complete
// detail path until these fields are available; no categories/SKUs are guessed.
type CardVariant = ProductVariantListSummary & Pick<ProductVariantRead, "sku" | "position" | "status" | "track_inventory">
type CardItem = Omit<ProductListItem, "variant_summary"> & { category_ids?: string[]; description?: string | null; variant_summary?: CardVariant[] | null }

export function catalogCardDetail(source: ProductListItem): ProductStorefrontDetail | null {
  const item = source as CardItem
  const rows = item.variant_summary
  if (item.product_kind !== "physical" || rows == null || item.category_ids === undefined) return null
  if (!Array.isArray(rows) || rows.some(row => !row || typeof row !== "object")) throw new CatalogIntegrityError("invalid_card_summary")
  // A product without variants may keep its authoritative price in attributes,
  // which the listing does not expose. Keep the established detail validation.
  if (rows.length === 0 && item.variant_count === 0) return null
  if (rows.some(row =>
    !Object.hasOwn(row, "sku") || row.position === undefined || row.status === undefined || row.track_inventory === undefined)) return null

  const money = (value: unknown) => (typeof value === "number" || typeof value === "string" && value.trim() !== "") && Number.isFinite(Number(value))
  if (!Array.isArray(item.category_ids) || item.category_ids.some(id => typeof id !== "string" || !id) ||
      !Array.isArray(rows) || rows.length !== item.variant_count || new Set(rows.map(row => row.id)).size !== rows.length ||
      !money(rows[0]?.base_price ?? item.min_price) || rows.some(row => !row.id || !money(row.base_price) ||
        typeof row.in_stock !== "boolean" || typeof row.track_inventory !== "boolean" || !Number.isFinite(row.position) ||
        (row.sku !== null && typeof row.sku !== "string") || !row.availability_status)) {
    throw new CatalogIntegrityError("invalid_card_summary")
  }
  const variants = rows.map(row => ({
    id: row.id, version: item.version, product_id: item.id, option_signature: "",
    title: row.title, sku: row.sku, position: row.position, status: row.status,
    option_values: row.option_values, option_value_labels: row.option_value_labels,
    base_price: String(row.base_price), effective_price: row.effective_price == null ? null : String(row.effective_price),
    compare_at_price: row.compare_at_price == null ? null : String(row.compare_at_price), currency: row.currency || item.default_currency,
    track_inventory: row.track_inventory,
    inventory: { track_inventory: row.track_inventory!, in_stock: row.in_stock, availability_status: row.availability_status, low_stock: row.low_stock },
    media: row.primary_image ? [row.primary_image] : [],
  }))
  return {
    id: item.id, version: item.version, slug: item.slug, name: item.name, description: item.description,
    product_kind: item.product_kind, status: item.status, default_currency: item.default_currency,
    primary_category_id: item.primary_category_id, category_ids: item.category_ids, option_axes: item.option_axes,
    in_stock: item.in_stock, availability_status: item.availability_status, low_stock: item.low_stock, forced_sold_out: item.forced_sold_out,
    attribute_values: { price: item.min_price }, media: item.primary_image ? [item.primary_image] : [], variants,
  } as ProductStorefrontDetail
}
