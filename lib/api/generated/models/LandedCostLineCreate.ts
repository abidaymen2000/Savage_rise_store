/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LandedCostLineCreate = {
    type?: 'freight' | 'customs' | 'insurance' | 'brokerage' | 'handling' | 'storage' | 'inspection' | 'other';
    description: string;
    vendor_bill_id?: (string | null);
    vendor_bill_line_id?: (string | null);
    expense_id?: (string | null);
    amount: (number | string);
    currency?: (string | null);
    cost_category_id?: (string | null);
    metadata?: Record<string, any>;
};

