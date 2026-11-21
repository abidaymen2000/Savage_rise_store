/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PosTransferLine } from './PosTransferLine';
export type PosTransferCreate = {
    source: string;
    destination: string;
    destination_shop_id?: (string | null);
    receipt_mode?: 'in_transit' | 'immediate';
    reason: string;
    lines: Array<PosTransferLine>;
};

