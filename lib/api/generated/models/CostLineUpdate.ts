/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CostLineUpdate = {
    label?: (string | null);
    description?: (string | null);
    category?: (string | null);
    subcategory?: (string | null);
    amount?: (number | null);
    currency?: (string | null);
    quantity?: (number | null);
    unit?: (string | null);
    unit_cost?: (number | null);
    cost_nature?: ('direct' | 'indirect' | null);
    allocation_required?: (boolean | null);
    target_type?: ('product' | 'variant' | 'order' | 'campaign' | 'cost_center' | 'none' | null);
    target_id?: (string | null);
    attributes?: (Record<string, any> | null);
    supplier_id?: (string | null);
    invoice_ref?: (string | null);
    payment_status?: ('unpaid' | 'partially_paid' | 'paid' | null);
    occurred_at?: (string | null);
    expected_version?: (number | null);
};

