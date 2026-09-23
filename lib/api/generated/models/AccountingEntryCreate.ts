/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccountingEntryLineCreate } from './AccountingEntryLineCreate';
export type AccountingEntryCreate = {
    reference?: (string | null);
    journal_id: string;
    entry_date: string;
    posting_date?: (string | null);
    description?: (string | null);
    source_document_type?: (string | null);
    source_document_id?: (string | null);
    source_event_id?: (string | null);
    entry_type?: 'manual' | 'business_generated' | 'opening' | 'period_adjustment' | 'year_end_closing' | 'year_end_reversal';
    metadata?: Record<string, any>;
    currency?: (string | null);
    exchange_rate?: (number | string);
    lines: Array<AccountingEntryLineCreate>;
};

