/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ErpAccountPublic = {
    id: string;
    email: string;
    role: 'platform_admin' | 'company_admin';
    company_id?: (string | null);
    permissions?: Array<string>;
    is_active?: boolean;
    full_name?: (string | null);
};

