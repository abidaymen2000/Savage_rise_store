/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSScheduledAction } from './CMSScheduledAction';
import type { CMSScheduledResourceType } from './CMSScheduledResourceType';
export type CMSScheduledActionCreate = {
    resource_type: CMSScheduledResourceType;
    resource_id: string;
    action: CMSScheduledAction;
    execute_at: string;
    timezone?: string;
    expected_version?: (number | null);
    revision?: (number | null);
    locale?: (string | null);
};

