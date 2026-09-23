/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccountingEntryLineCreate } from './AccountingEntryLineCreate';
export type AccountingEntryUpdate = {
    reference?: (string | null);
    journal_id?: (string | null);
    entry_date?: (string | null);
    posting_date?: (string | null);
    description?: (string | null);
    source_document_type?: (string | null);
    source_document_id?: (string | null);
    source_event_id?: (string | null);
    entry_type?: ('manual' | 'business_generated' | 'opening' | 'period_adjustment' | 'year_end_closing' | 'year_end_reversal' | null);
    metadata?: (Record<string, any> | null);
    currency?: (string | null);
    exchange_rate?: (number | string | null);
    lines?: (Array<AccountingEntryLineCreate> | null);
    expected_version?: (number | null);
};

