/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TaxProfileRule } from './TaxProfileRule';
export type TaxProfileUpdate = {
    code?: (string | null);
    name?: (string | null);
    description?: (string | null);
    rules?: (Array<TaxProfileRule> | null);
    status?: ('active' | 'inactive' | null);
    is_archived?: (boolean | null);
    expected_version?: (number | null);
};

