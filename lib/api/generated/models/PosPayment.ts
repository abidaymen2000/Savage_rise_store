/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PosPayment = {
    method: 'cash' | 'card';
    amount: (number | string);
    tendered?: ((number | string) | null);
    reference?: string;
};

