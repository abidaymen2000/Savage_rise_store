/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TaxProfileRule } from './TaxProfileRule';
export type TaxProfileOut = {
    id: string;
    code: string;
    name: string;
    description?: (string | null);
    rules?: Array<TaxProfileRule>;
    status?: 'active' | 'inactive';
    is_archived?: boolean;
    created_by?: (string | null);
    updated_by?: (string | null);
    created_at: string;
    updated_at: string;
    version?: number;
};

