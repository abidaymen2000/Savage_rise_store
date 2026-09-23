/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AccountingEntryLineOut = {
    id: string;
    entry_id: string;
    account_id: string;
    description?: (string | null);
    debit: string;
    credit: string;
    currency: string;
    amount_currency?: (string | null);
    exchange_rate?: (string | null);
    partner_type?: (string | null);
    partner_id?: (string | null);
    product_id?: (string | null);
    variant_id?: (string | null);
    cost_center_id?: (string | null);
    cost_category_id?: (string | null);
    source_line_id?: (string | null);
    metadata?: Record<string, any>;
    created_at: string;
};

