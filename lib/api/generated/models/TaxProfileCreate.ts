/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TaxProfileRule } from './TaxProfileRule';
export type TaxProfileCreate = {
    code: string;
    name: string;
    description?: (string | null);
    rules?: Array<TaxProfileRule>;
    status?: 'active' | 'inactive';
};

