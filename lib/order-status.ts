import type { FulfillmentStatus, Order, OrderStatus, PaymentStatus } from "@/types/api"

export function getCanonicalOrderStatus(order: Pick<Order, "status" | "order_status">): OrderStatus {
  return order.order_status ?? order.status
}

export function canCancelOrder(order: Pick<Order, "status" | "order_status">): boolean {
  return getCanonicalOrderStatus(order) === "pending"
}

export function getOrderStatusLabel(status: OrderStatus): string {
  switch (status) {
    case "pending":
      return "Pending"
    case "confirmed":
      return "Confirmed"
    case "preparing":
      return "Preparing"
    case "shipped":
      return "Shipped"
    case "delivered":
      return "Delivered"
    case "cancelled":
      return "Cancelled"
    case "return_requested":
      return "Return requested"
    case "return_in_transit":
      return "Return in transit"
    case "return_received":
      return "Return received"
    case "returned":
      return "Returned"
    default:
      return status
  }
}

export function getOrderStatusColor(status: OrderStatus): string {
  switch (status) {
    case "pending":
      return "bg-yellow-600"
    case "confirmed":
      return "bg-blue-600"
    case "preparing":
      return "bg-indigo-600"
    case "shipped":
      return "bg-purple-600"
    case "delivered":
      return "bg-green-600"
    case "cancelled":
      return "bg-red-600"
    case "return_requested":
      return "bg-orange-600"
    case "return_in_transit":
      return "bg-amber-600"
    case "return_received":
      return "bg-cyan-600"
    case "returned":
      return "bg-slate-600"
    default:
      return "bg-gray-600"
  }
}

export function getPaymentStatusLabel(status: PaymentStatus): string {
  switch (status) {
    case "unpaid":
      return "Unpaid"
    case "pending":
      return "Pending"
    case "paid":
      return "Paid"
    case "failed":
      return "Failed"
    case "refunded":
      return "Refunded"
    case "partially_refunded":
      return "Partially refunded"
    default:
      return status
  }
}

export function getFulfillmentStatusLabel(status: FulfillmentStatus): string {
  switch (status) {
    case "unfulfilled":
      return "Unfulfilled"
    case "reserved":
      return "Reserved"
    case "processing":
      return "Processing"
    case "fulfilled":
      return "Fulfilled"
    case "returning":
      return "Returning"
    case "returned":
      return "Returned"
    case "cancelled":
      return "Cancelled"
    default:
      return status
  }
}
