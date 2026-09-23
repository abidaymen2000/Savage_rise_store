/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InvoicePolicy_Input } from './InvoicePolicy_Input';
export type InvoiceConfigurationUpdate = {
    invoicing?: (InvoicePolicy_Input | null);
    base_currency?: (string | null);
    money_precision?: (number | null);
    default_accounts_receivable_account_id?: (string | null);
    default_sales_revenue_account_id?: (string | null);
    default_sales_journal_id?: (string | null);
    tax_rounding_method?: (string | null);
    tax_rounding_level?: (string | null);
};

