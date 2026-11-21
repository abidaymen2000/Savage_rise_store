/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PosReturnLine } from './PosReturnLine';
export type PosReturnCreate = {
    session_id: string;
    reason: string;
    lines: Array<PosReturnLine>;
    method: 'cash' | 'card';
    external_reference?: string;
    expected_refunded?: ((number | string) | null);
};

