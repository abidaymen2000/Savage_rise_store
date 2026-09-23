/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TaxDefinitionOut = {
    id: string;
    code: string;
    name: string;
    description?: (string | null);
    tax_type: 'vat' | 'gst' | 'sales_tax' | 'excise' | 'custom' | 'other';
    rate: string;
    price_inclusion: 'exclusive' | 'inclusive';
    scope: 'sale' | 'purchase' | 'both';
    recoverability?: 'recoverable' | 'non_recoverable' | 'partial';
    recoverable_percent?: (string | null);
    calculation_method?: 'percentage' | 'fixed_amount' | 'compound_percentage';
    sequence?: number;
    tax_account_id?: (string | null);
    tax_refund_account_id?: (string | null);
    country_code?: (string | null);
    region_code?: (string | null);
    valid_from?: (string | null);
    valid_to?: (string | null);
    status?: 'active' | 'inactive';
    is_archived?: boolean;
    created_by?: (string | null);
    updated_by?: (string | null);
    created_at: string;
    updated_at: string;
    version?: number;
};

