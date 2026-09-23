/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InstallmentCreate } from './InstallmentCreate';
export type PaymentTerms = {
    kind?: 'immediate' | 'net_days' | 'fixed' | 'installments';
    days?: number;
    label?: (string | null);
    installments?: Array<InstallmentCreate>;
};

