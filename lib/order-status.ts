import type { FulfillmentStatus, OrderStatus, PaymentStatus } from "@/types/api"

const orderLabels: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refused: "Declined",
  return_requested: "Return Requested",
  return_in_transit: "Return in Transit",
  return_received: "Return Received",
  returned: "Returned",
}

const paymentLabels: Record<string, string> = {
  unpaid: "Unpaid",
  pending: "Pending",
  paid: "Paid",
  collected: "Collected",
  failed: "Failed",
  refunded: "Refunded",
  partially_refunded: "Partially Refunded",
  cancelled: "Cancelled",
}

const fulfillmentLabels: Record<string, string> = {
  unfulfilled: "Unfulfilled",
  reserved: "Reserved",
  processing: "Processing",
  fulfilled: "Fulfilled",
  returning: "Returning",
  returned: "Returned",
  cancelled: "Cancelled",
}

function statusValue(status: OrderStatus | string | { order_status?: string | null; status?: string | null } | null | undefined) {
  return typeof status === "object" && status ? status.order_status ?? status.status ?? null : status
}

export function getOrderStatusLabel(status: OrderStatus | string | { order_status?: string | null; status?: string | null } | null | undefined) {
  const value = statusValue(status)
  return orderLabels[value ?? ""] ?? value ?? "Unknown"
}

export function getPaymentStatusLabel(status: PaymentStatus | string | null | undefined) {
  return paymentLabels[status ?? ""] ?? status ?? "Unknown"
}

export function getFulfillmentStatusLabel(status: FulfillmentStatus | string | null | undefined) {
  return fulfillmentLabels[status ?? ""] ?? status ?? "Unknown"
}

export function getOrderStatusClass(status: OrderStatus | string | { order_status?: string | null; status?: string | null } | null | undefined) {
  const value = statusValue(status)
  if (value === "delivered") return "bg-green-500/10 text-green-600 border-green-500/30"
  if (value === "cancelled" || value === "refused") return "bg-red-500/10 text-red-600 border-red-500/30"
  if (value === "shipped" || value === "confirmed") return "bg-blue-500/10 text-blue-600 border-blue-500/30"
  return "bg-muted text-muted-foreground border-border"
}

export function getOrderStatusColor(status: OrderStatus | string | { order_status?: string | null; status?: string | null } | null | undefined) {
  return getOrderStatusClass(status)
}

export function getCanonicalOrderStatus(status: OrderStatus | string | { order_status?: string | null; status?: string | null } | null | undefined) {
  return (statusValue(status) ?? "pending") as OrderStatus
}

export function canCancelOrder(status: OrderStatus | string | { order_status?: string | null; status?: string | null } | null | undefined) {
  const value = statusValue(status)
  return value === "pending" || value === "confirmed"
}

export function getPaymentStatusClass(status: PaymentStatus | string | null | undefined) {
  if (status === "paid" || status === "collected") return "bg-green-500/10 text-green-600 border-green-500/30"
  if (status === "failed" || status === "cancelled") return "bg-red-500/10 text-red-600 border-red-500/30"
  return "bg-muted text-muted-foreground border-border"
}

export function getFulfillmentStatusClass(status: FulfillmentStatus | string | null | undefined) {
  if (status === "fulfilled") return "bg-green-500/10 text-green-600 border-green-500/30"
  if (status === "cancelled") return "bg-red-500/10 text-red-600 border-red-500/30"
  return "bg-muted text-muted-foreground border-border"
}
