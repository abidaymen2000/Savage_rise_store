/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CodSettlementOut = {
    id: string;
    reference: string;
    order_ids: Array<string>;
    clearing_account_id: string;
    destination_account_id: string;
    amount_expected: string;
    amount_received: string;
    difference_amount: string;
    currency: string;
    occurred_at: string;
    carrier_reference?: (string | null);
    transfer_id?: (string | null);
    status?: string;
    created_by?: (string | null);
    created_at: string;
    notes?: (string | null);
};

