/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CMSRedirectUpdate = {
    source_path?: (string | null);
    target?: (string | null);
    status_code?: (301 | 302 | null);
    is_active?: (boolean | null);
    reason?: (string | null);
    allow_external?: (boolean | null);
    expected_version: number;
};

