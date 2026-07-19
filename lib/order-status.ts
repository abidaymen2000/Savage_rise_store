import type { FulfillmentStatus, OrderStatus, PaymentStatus } from "@/types/api"

const orderLabels: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  preparing: "En préparation",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
  refused: "Refusée",
  return_requested: "Retour demandé",
  return_in_transit: "Retour en transit",
  return_received: "Retour reçu",
  returned: "Retournée",
}

const paymentLabels: Record<string, string> = {
  unpaid: "Non payé",
  pending: "En attente",
  paid: "Payé",
  collected: "Collecté",
  failed: "Échoué",
  refunded: "Remboursé",
  partially_refunded: "Partiellement remboursé",
  cancelled: "Annulé",
}

const fulfillmentLabels: Record<string, string> = {
  unfulfilled: "Non préparée",
  reserved: "Réservée",
  processing: "En traitement",
  fulfilled: "Traitée",
  returning: "Retour",
  returned: "Retournée",
  cancelled: "Annulée",
}

function statusValue(status: OrderStatus | string | { order_status?: string | null; status?: string | null } | null | undefined) {
  return typeof status === "object" && status ? status.order_status ?? status.status ?? null : status
}

export function getOrderStatusLabel(status: OrderStatus | string | { order_status?: string | null; status?: string | null } | null | undefined) {
  const value = statusValue(status)
  return orderLabels[value ?? ""] ?? value ?? "Inconnu"
}

export function getPaymentStatusLabel(status: PaymentStatus | string | null | undefined) {
  return paymentLabels[status ?? ""] ?? status ?? "Inconnu"
}

export function getFulfillmentStatusLabel(status: FulfillmentStatus | string | null | undefined) {
  return fulfillmentLabels[status ?? ""] ?? status ?? "Inconnu"
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
