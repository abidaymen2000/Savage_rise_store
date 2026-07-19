/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CostLineOut = {
    label: string;
    description?: (string | null);
    category: string;
    subcategory?: (string | null);
    amount: number;
    currency?: string;
    quantity?: (number | null);
    unit?: (string | null);
    unit_cost?: (number | null);
    cost_nature: 'direct' | 'indirect';
    allocation_required?: boolean;
    target_type?: ('product' | 'variant' | 'order' | 'campaign' | 'cost_center' | 'none' | null);
    target_id?: (string | null);
    attributes?: (Record<string, any> | null);
    supplier_id?: (string | null);
    invoice_ref?: (string | null);
    payment_status?: ('unpaid' | 'partially_paid' | 'paid' | null);
    occurred_at?: (string | null);
    id: string;
    cost_center_id: string;
    created_by?: (string | null);
    updated_by?: (string | null);
    created_at: string;
    updated_at: string;
    version?: number;
    is_archived?: boolean;
};

