/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttributionInput } from './AttributionInput';
import type { MetaEventContextIn } from './MetaEventContextIn';
import type { OrderItemCreate_Input } from './OrderItemCreate_Input';
import type { ShippingInfo } from './ShippingInfo';
export type OrderCreate = {
    user_id?: (string | null);
    items?: Array<OrderItemCreate_Input>;
    shipping: ShippingInfo;
    payment_method?: 'cod' | 'stripe' | 'paypal';
    promo_code?: (string | null);
    loyalty_points_to_use?: number;
    meta?: (MetaEventContextIn | null);
    anonymous_id?: (string | null);
    session_id?: (string | null);
    page_view_id?: (string | null);
    checkout_id?: (string | null);
    meta_event_id?: (string | null);
    referrer?: (string | null);
    landing_page?: (string | null);
    utm_source?: (string | null);
    utm_medium?: (string | null);
    utm_campaign?: (string | null);
    utm_content?: (string | null);
    utm_term?: (string | null);
    fbclid?: (string | null);
    fbp?: (string | null);
    fbc?: (string | null);
    first_touch_attribution?: (AttributionInput | null);
    last_touch_attribution?: (AttributionInput | null);
    session_attribution?: (AttributionInput | null);
};

