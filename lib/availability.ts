export type AvailabilityStatus = "available" | "out_of_stock" | "forced_sold_out" | "inactive" | "invalid_variant" | "unavailable" | "unknown"
export interface Availability {
  in_stock?: boolean
  forced_sold_out?: boolean
  availability_status?: AvailabilityStatus | null
  low_stock?: boolean
  status?: string | null
  track_inventory?: boolean | null
  stock_available?: number
  stock?: number
  stock_on_hand?: number
  stock_reserved?: number
}

/** Undefined is intentionally different from zero: public stock is private. */
export function knownStock(value: Availability | null | undefined): number | undefined {
  if (!value || value.track_inventory === false) return undefined
  for (const stock of [value.stock_available, value.stock]) {
    if (typeof stock === "number" && Number.isFinite(stock)) return Math.max(0, stock)
  }
  if (typeof value.stock_on_hand === "number" && typeof value.stock_reserved === "number" && Number.isFinite(value.stock_on_hand) && Number.isFinite(value.stock_reserved)) {
    return Math.max(0, value.stock_on_hand - value.stock_reserved)
  }
  return undefined
}

export function availabilityStatus(value: Availability | null | undefined): AvailabilityStatus {
  if (!value) return "unknown"
  if (value.status && !["active", "in_stock", "available"].includes(value.status)) return "inactive"
  if (value.forced_sold_out) return "forced_sold_out"
  if (value.availability_status) return value.availability_status
  // Compatibility with deployed Core: its boolean is authoritative even when
  // private quantities are absent. Missing signals never become a stock claim.
  if (value.in_stock === false) return "out_of_stock"
  if (value.in_stock === true) return "available"
  const stock = knownStock(value)
  if (stock !== undefined) return stock > 0 ? "available" : "out_of_stock"
  return "unknown"
}

export function isSoldOut(state: AvailabilityStatus): boolean {
  return state === "out_of_stock" || state === "forced_sold_out"
}

export function hasLowStock(value: Availability | null | undefined): boolean {
  if (availabilityStatus(value) !== "available") return false
  if (typeof value?.low_stock === "boolean") return value.low_stock
  const stock = knownStock(value)
  return stock !== undefined && stock > 0 && stock <= 5
}

export function availabilityLabel(state: AvailabilityStatus): string {
  if (isSoldOut(state)) return "SOLD OUT"
  if (state === "unknown") return "Check Availability"
  if (state === "invalid_variant") return "Option Unavailable"
  return state === "available" ? "In Stock" : "Unavailable"
}
