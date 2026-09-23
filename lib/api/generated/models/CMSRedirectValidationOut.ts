/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CMSRedirectValidationOut = {
    valid: boolean;
    cycle?: boolean;
    chain?: Array<string>;
    target_missing?: boolean;
    conflict?: boolean;
    code?: (string | null);
    message?: (string | null);
};

