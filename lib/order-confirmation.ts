const storeStorageKey = (key: string) => `yovo:${typeof location === "undefined" ? "neutral" : location.hostname}:${key}`;
import type { Order } from "@/types/api";
export type OrderConfirmation = Pick<
  Order,
  "id" | "total_amount" | "payment_method" | "is_guest" | "shipping" | "currency"
>;
const receipts = new Map<
  string,
  { expires: number; order: OrderConfirmation }
>();
export function rememberOrderConfirmation(order: OrderConfirmation) {
  // A short-lived receipt for this tab, never a credential for reading orders.
  const receipt = {
    expires: Date.now() + 30 * 60 * 1000,
    order: {
      id: order.id,
      currency: order.currency,
      total_amount: order.total_amount,
      payment_method: order.payment_method,
      is_guest: order.is_guest,
      shipping: order.shipping,
    },
  };
  const key = storeStorageKey("order-confirmation");
  receipts.set(key, receipt);
  try {
    sessionStorage.setItem(key, JSON.stringify(receipt));
  } catch {
    /* The confirmed order remains successful when browser storage is unavailable. */
  }
}
export function readOrderConfirmation(
  orderId: string,
): OrderConfirmation | null {
  try {
    const key = storeStorageKey("order-confirmation");
    const value =
      receipts.get(key) || JSON.parse(sessionStorage.getItem(key) || "null");
    return value?.expires > Date.now() && value?.order?.id === orderId
      ? value.order
      : null;
  } catch {
    return null;
  }
}
