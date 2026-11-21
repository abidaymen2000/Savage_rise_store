/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * A document-only percentage; never creates an accounting tax definition.
 */
export type InvoiceInlineTax = {
    name: string;
    rate: (number | string);
    kind?: 'vat' | 'custom';
};

