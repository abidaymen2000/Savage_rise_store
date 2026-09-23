/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LandedCostLineOut = {
    id: string;
    landed_cost_id: string;
    type: 'freight' | 'customs' | 'insurance' | 'brokerage' | 'handling' | 'storage' | 'inspection' | 'other';
    description: string;
    vendor_bill_id?: (string | null);
    vendor_bill_line_id?: (string | null);
    expense_id?: (string | null);
    amount: string;
    currency: string;
    amount_base: string;
    cost_category_id?: (string | null);
    metadata?: Record<string, any>;
    created_at: string;
    updated_at: string;
};

