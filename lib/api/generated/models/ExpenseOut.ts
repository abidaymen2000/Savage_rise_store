/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ExpenseOut = {
    id: string;
    reference: string;
    label: string;
    description?: (string | null);
    category_id?: (string | null);
    amount: string;
    tax_amount?: string;
    tax_definition_ids?: Array<string>;
    tax_category_id?: (string | null);
    tax_profile_id?: (string | null);
    tax_exemption_reason?: (string | null);
    tax_lines?: Array<Record<string, any>>;
    recoverable_tax_amount?: string;
    nonrecoverable_tax_amount?: string;
    total_amount: string;
    amount_paid?: string;
    amount_due?: string;
    currency: string;
    amount_base: string;
    exchange_rate?: string;
    occurred_at: string;
    supplier_id?: (string | null);
    cost_center_id?: (string | null);
    status?: 'draft' | 'submitted' | 'approved' | 'rejected' | 'cancelled';
    payment_status?: 'unpaid' | 'partially_paid' | 'paid';
    notes?: (string | null);
    attachments?: Array<Record<string, any>>;
    created_by?: (string | null);
    approved_by?: (string | null);
    rejected_by?: (string | null);
    rejection_reason?: (string | null);
    created_at: string;
    updated_at: string;
    version?: number;
    is_archived?: boolean;
};

