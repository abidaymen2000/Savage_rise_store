/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AdminPublic = {
    id: string;
    email: string;
    full_name?: (string | null);
    is_active?: boolean;
    is_superadmin: boolean;
    permissions?: Array<string>;
    capabilities?: Record<string, boolean>;
    available_permissions?: Array<Record<string, any>>;
    nav_items?: Array<Record<string, any>>;
};

