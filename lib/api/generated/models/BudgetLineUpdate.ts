/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type BudgetLineUpdate = {
    metric?: ('revenue' | 'expense' | 'cogs' | 'gross_margin' | 'cash_in' | 'cash_out' | 'units_sold' | null);
    period_start?: (string | null);
    period_end?: (string | null);
    amount?: (number | string | null);
    currency?: (string | null);
    exchange_rate?: (number | string | null);
    cost_center_id?: (string | null);
    cost_category_id?: (string | null);
    financial_account_id?: (string | null);
    product_id?: (string | null);
    variant_id?: (string | null);
    category_id?: (string | null);
    notes?: (string | null);
    metadata?: (Record<string, any> | null);
    expected_version?: (number | null);
};

