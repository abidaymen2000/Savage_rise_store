/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TaxProfileRule = {
    source_tax_id?: (string | null);
    replacement_tax_id?: (string | null);
    action: 'replace' | 'remove' | 'exempt';
    exemption_reason?: (string | null);
};

