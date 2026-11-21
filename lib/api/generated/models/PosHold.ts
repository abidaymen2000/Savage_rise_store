/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PosLine } from './PosLine';
export type PosHold = {
    session_id: string;
    customer_id?: (string | null);
    lines: Array<PosLine>;
    label: string;
};

