/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CodSettlementCreate = {
    reference?: (string | null);
    order_ids: Array<string>;
    clearing_account_id: string;
    destination_account_id: string;
    amount_expected: (number | string);
    amount_received: (number | string);
    currency?: (string | null);
    occurred_at?: (string | null);
    carrier_reference?: (string | null);
    notes?: (string | null);
};

