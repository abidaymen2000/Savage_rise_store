/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AuditLogOut = {
    id: string;
    admin_id?: (string | null);
    admin_email?: (string | null);
    action: string;
    module: string;
    entity_type?: (string | null);
    entity_id?: (string | null);
    message?: (string | null);
    metadata?: Record<string, any>;
    created_at: string;
};

