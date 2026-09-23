/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ErpAccountCreate = {
    email: string;
    /**
     * @deprecated
     */
    password?: (string | null);
    role?: string;
    permissions?: Array<string>;
    is_active?: boolean;
    full_name?: (string | null);
};

