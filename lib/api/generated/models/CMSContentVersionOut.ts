/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSHistoryAction } from './CMSHistoryAction';
import type { CMSHistoryResourceType } from './CMSHistoryResourceType';
export type CMSContentVersionOut = {
    id: string;
    resource_type: CMSHistoryResourceType;
    resource_id: string;
    revision: number;
    resource_version: number;
    snapshot: Record<string, any>;
    action: CMSHistoryAction;
    changed_fields?: Array<string>;
    component_changes?: Record<string, Array<string>>;
    created_at: string;
    created_by?: (string | null);
};

