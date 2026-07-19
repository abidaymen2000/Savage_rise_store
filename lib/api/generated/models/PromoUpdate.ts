/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PromoUpdate = {
    description?: (string | null);
    discount_type?: ('percent' | 'fixed' | null);
    amount?: (number | null);
    max_uses?: (number | null);
    per_user_limit?: (number | null);
    starts_at?: (string | null);
    ends_at?: (string | null);
    minimum_order_total?: (number | null);
    applicable_product_ids?: (Array<string> | null);
    applicable_category_ids?: (Array<string> | null);
    stackable?: (boolean | null);
    is_active?: (boolean | null);
};

