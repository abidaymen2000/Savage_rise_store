/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InvoicePolicy_Output } from './InvoicePolicy_Output';
export type InvoiceConfigurationView = {
    invoicing: InvoicePolicy_Output;
    base_currency: string;
    money_precision: number;
    tax_rounding_method: string;
    tax_rounding_level: string;
    default_accounts_receivable_account_id?: (string | null);
    default_sales_revenue_account_id?: (string | null);
    default_sales_journal_id?: (string | null);
};

