/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderSelection } from './OrderSelection';
import type { PartySnapshot } from './PartySnapshot';
export type InvoiceFromOrder = {
    issue_date: string;
    due_date?: (string | null);
    customer?: (PartySnapshot | null);
    selections?: Array<OrderSelection>;
};

