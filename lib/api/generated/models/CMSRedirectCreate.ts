/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CMSRedirectCreate = {
    source_path: string;
    target: string;
    status_code?: 301 | 302;
    is_active?: boolean;
    reason?: (string | null);
    allow_external?: boolean;
};

