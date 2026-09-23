/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccountingEntryLineOut } from './AccountingEntryLineOut';
export type AccountingEntryOut = {
    id: string;
    reference: string;
    journal_id: string;
    entry_date: string;
    posting_date?: (string | null);
    description?: (string | null);
    status?: 'draft' | 'posted' | 'reversed';
    source_document_type?: (string | null);
    source_document_id?: (string | null);
    source_event_id?: (string | null);
    entry_type?: 'manual' | 'business_generated' | 'opening' | 'period_adjustment' | 'year_end_closing' | 'year_end_reversal';
    metadata?: Record<string, any>;
    currency: string;
    exchange_rate?: string;
    base_currency: string;
    total_debit: string;
    total_credit: string;
    reversal_of_entry_id?: (string | null);
    reversed_by_entry_id?: (string | null);
    created_by?: (string | null);
    posted_by?: (string | null);
    created_at: string;
    updated_at: string;
    posted_at?: (string | null);
    reversed_at?: (string | null);
    version?: number;
    lines?: Array<AccountingEntryLineOut>;
};

