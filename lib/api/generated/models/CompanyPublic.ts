/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CompanyPublic = {
    id: string;
    name: string;
    slug: string;
    database_name: string;
    domain?: (string | null);
    status: 'active' | 'suspended' | 'archived';
    erp_modules?: Array<string>;
    enabled_permissions?: Array<string>;
    created_at?: (string | null);
    updated_at?: (string | null);
};

