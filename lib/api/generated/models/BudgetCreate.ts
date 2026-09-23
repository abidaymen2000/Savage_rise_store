/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BudgetLineCreate } from './BudgetLineCreate';
export type BudgetCreate = {
    reference?: (string | null);
    name: string;
    description?: (string | null);
    date_from: string;
    date_to: string;
    base_currency?: (string | null);
    notes?: (string | null);
    lines?: Array<BudgetLineCreate>;
};

