/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttributionSummaryOut } from './AttributionSummaryOut';
import type { InventoryAllocationOut } from './InventoryAllocationOut';
import type { MarketingAttributionOut } from './MarketingAttributionOut';
import type { OrderItemCreate_Output } from './OrderItemCreate_Output';
import type { OrderNoteOut } from './OrderNoteOut';
import type { OrderQuoteLineOut } from './OrderQuoteLineOut';
import type { ShippingInfo } from './ShippingInfo';
export type OrderOut = {
    id: string;
    user_id?: (string | null);
    user_email?: (string | null);
    is_guest?: boolean;
    shipping: ShippingInfo;
    items?: Array<OrderItemCreate_Output>;
    item_snapshots?: Array<OrderQuoteLineOut>;
    inventory_allocations?: Array<InventoryAllocationOut>;
    payment_method?: 'cod' | 'stripe' | 'paypal';
    payment_status: 'unpaid' | 'pending' | 'paid' | 'collected' | 'cancelled' | 'failed' | 'refunded' | 'partially_refunded';
    is_paid?: boolean;
    payment_state?: string;
    fulfillment_status: 'unfulfilled' | 'reserved' | 'processing' | 'fulfilled' | 'returning' | 'returned' | 'cancelled';
    subtotal?: (number | null);
    discount_value?: (number | null);
    bundle_discount_value?: number;
    promo_code?: (string | null);
    loyalty_points_to_use?: number;
    loyalty_points_used?: number;
    loyalty_discount_value?: number;
    loyalty_eligible_amount?: number;
    loyalty_points_earned?: number;
    loyalty_points_awarded?: boolean;
    shipping_amount?: (number | null);
    shipping_rate_id?: (string | null);
    shipping_rate_name?: (string | null);
    total_amount: number;
    refunded_amount?: number;
    notes?: Array<OrderNoteOut>;
    marketing_attribution?: (MarketingAttributionOut | null);
    analytics_session_id?: (string | null);
    analytics_checkout_id?: (string | null);
    order_attribution_id?: (string | null);
    meta_event_id?: (string | null);
    attribution_summary?: (AttributionSummaryOut | null);
    assigned_admin_id?: (string | null);
    status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled' | 'refused' | 'return_requested' | 'return_in_transit' | 'return_received' | 'returned';
    order_status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled' | 'refused' | 'return_requested' | 'return_in_transit' | 'return_received' | 'returned';
    idempotency_key?: (string | null);
    paid_at?: (string | null);
    collected_at?: (string | null);
    cancelled_at?: (string | null);
    cancelled_by?: (string | null);
    cancellation_reason?: (string | null);
    created_at: string;
    updated_at: string;
};

