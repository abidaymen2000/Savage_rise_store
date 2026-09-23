/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type InvoiceProvisioningStatus = {
    state?: 'provisioning' | 'configuration_required' | 'ready' | 'provisioning_failed' | 'disabled';
    company_id: string;
    database_name: string;
    version?: number;
    required_fields?: Array<string>;
    last_error?: (Record<string, string> | null);
};

