/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CostLineCreate = {
    label: string;
    description?: (string | null);
    category: string;
    category_id?: (string | null);
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
    source_document_type?: (string | null);
    source_document_id?: (string | null);
    source_line_id?: (string | null);
    occurred_at?: (string | null);
};

