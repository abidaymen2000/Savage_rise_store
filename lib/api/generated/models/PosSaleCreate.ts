/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PosLine } from './PosLine';
import type { PosPayment } from './PosPayment';
export type PosSaleCreate = {
    session_id: string;
    customer_id?: (string | null);
    lines: Array<PosLine>;
    expected_total: (number | string);
    payments: Array<PosPayment>;
};

