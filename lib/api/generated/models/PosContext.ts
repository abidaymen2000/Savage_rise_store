/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PosRecord } from './PosRecord';
export type PosContext = {
    company_id: string;
    company_name: string;
    user_id: string;
    user_name: string;
    enabled: boolean;
    permissions: Array<string>;
    shops: Array<PosRecord>;
    registers: Array<PosRecord>;
    account_type?: 'erp' | 'pos';
};

