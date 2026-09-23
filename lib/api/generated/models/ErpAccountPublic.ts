/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ErpAccountPublic = {
    id: string;
    email: string;
    role: 'platform_admin' | 'company_admin' | 'employee';
    company_id?: (string | null);
    permissions?: Array<string>;
    is_active?: boolean;
    is_verified?: boolean;
    invitation_delivery_status?: (string | null);
    invitation_sent_at?: (string | null);
    full_name?: (string | null);
};

