/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CMSRedirectOut = {
    id: string;
    source_path: string;
    target: string;
    status_code: number;
    is_active: boolean;
    reason?: (string | null);
    allow_external?: boolean;
    version?: number;
    created_at: string;
    created_by?: (string | null);
    updated_at: string;
    updated_by?: (string | null);
};

