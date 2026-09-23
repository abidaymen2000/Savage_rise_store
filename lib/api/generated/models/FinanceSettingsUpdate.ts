/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InvoicePolicy_Input } from './InvoicePolicy_Input';
export type FinanceSettingsUpdate = {
    invoicing?: (InvoicePolicy_Input | null);
    base_currency?: (string | null);
    timezone?: (string | null);
    fiscal_year_start_month?: (number | null);
    money_precision?: (number | null);
    default_sales_account_id?: (string | null);
    cod_clearing_account_id?: (string | null);
    refund_account_id?: (string | null);
    budget_warning_threshold_percent?: (number | string | null);
    default_sales_revenue_account_id?: (string | null);
    default_accounts_receivable_account_id?: (string | null);
    default_accounts_payable_account_id?: (string | null);
    default_cogs_account_id?: (string | null);
    default_inventory_account_id?: (string | null);
    inventory_accounting_enabled?: (boolean | null);
    inventory_account_id?: (string | null);
    grni_account_id?: (string | null);
    ginr_account_id?: (string | null);
    cogs_account_id?: (string | null);
    landed_cost_clearing_account_id?: (string | null);
    inventory_opening_equity_account_id?: (string | null);
    purchase_price_variance_account_id?: (string | null);
    inventory_adjustment_gain_account_id?: (string | null);
    inventory_adjustment_loss_account_id?: (string | null);
    inventory_returns_account_id?: (string | null);
    inventory_valuation_method?: (string | null);
    quantity_precision?: (number | null);
    unit_cost_precision?: (number | null);
    tax_engine_enabled?: (boolean | null);
    tax_rounding_method?: (string | null);
    tax_rounding_level?: (string | null);
    shipping_tax_category_id?: (string | null);
    retained_earnings_account_id?: (string | null);
    default_expense_account_id?: (string | null);
    default_refund_account_id?: (string | null);
    default_sales_journal_id?: (string | null);
    default_purchase_journal_id?: (string | null);
    default_bank_journal_id?: (string | null);
    default_cash_journal_id?: (string | null);
    default_general_journal_id?: (string | null);
    expected_version?: (number | null);
};

