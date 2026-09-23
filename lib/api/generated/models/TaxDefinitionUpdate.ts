/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TaxDefinitionUpdate = {
    code?: (string | null);
    name?: (string | null);
    description?: (string | null);
    tax_type?: ('vat' | 'gst' | 'sales_tax' | 'excise' | 'custom' | 'other' | null);
    rate?: (number | string | null);
    price_inclusion?: ('exclusive' | 'inclusive' | null);
    scope?: ('sale' | 'purchase' | 'both' | null);
    recoverability?: ('recoverable' | 'non_recoverable' | 'partial' | null);
    recoverable_percent?: (number | string | null);
    calculation_method?: ('percentage' | 'fixed_amount' | 'compound_percentage' | null);
    sequence?: (number | null);
    tax_account_id?: (string | null);
    tax_refund_account_id?: (string | null);
    country_code?: (string | null);
    region_code?: (string | null);
    valid_from?: (string | null);
    valid_to?: (string | null);
    status?: ('active' | 'inactive' | null);
    is_archived?: (boolean | null);
    expected_version?: (number | null);
};

