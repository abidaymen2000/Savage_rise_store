/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSReleaseItemOut } from './CMSReleaseItemOut';
import type { CMSReleaseStatus } from './CMSReleaseStatus';
export type CMSReleaseOut = {
    id: string;
    name: string;
    description?: (string | null);
    status: CMSReleaseStatus;
    version: number;
    items?: Array<CMSReleaseItemOut>;
    scheduled_at?: (string | null);
    timezone?: (string | null);
    created_at: string;
    created_by?: (string | null);
    updated_at: string;
    updated_by?: (string | null);
    published_at?: (string | null);
    archived_at?: (string | null);
};

