/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSScheduledAction } from './CMSScheduledAction';
import type { CMSScheduledActionStatus } from './CMSScheduledActionStatus';
import type { CMSScheduledResourceType } from './CMSScheduledResourceType';
export type CMSScheduledActionOut = {
    id: string;
    company_id?: (string | null);
    database_name: string;
    resource_type: CMSScheduledResourceType;
    resource_id: string;
    action: CMSScheduledAction;
    execute_at: string;
    timezone: string;
    expected_version?: (number | null);
    revision?: (number | null);
    locale?: (string | null);
    status: CMSScheduledActionStatus;
    attempts?: number;
    created_at: string;
    created_by?: (string | null);
    updated_at: string;
    executed_at?: (string | null);
    error?: (string | null);
};

