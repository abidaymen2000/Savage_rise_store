/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PromoOut = {
    code: string;
    description?: (string | null);
    discount_type: 'percent' | 'fixed';
    amount: number;
    max_uses?: (number | null);
    per_user_limit?: (number | null);
    starts_at?: (string | null);
    ends_at?: (string | null);
    minimum_order_total?: (number | null);
    applicable_product_ids?: (Array<string> | null);
    applicable_category_ids?: (Array<string> | null);
    stackable?: boolean;
    is_active?: boolean;
    id: string;
    uses_count: number;
    user_uses: Record<string, number>;
    created_at: string;
    updated_at: string;
};

