/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSReleaseItemResourceType } from './CMSReleaseItemResourceType';
export type CMSReleaseItemCreate = {
    resource_type: CMSReleaseItemResourceType;
    resource_id: string;
    revision: number;
    locale?: (string | null);
    dependencies?: Array<Record<string, any>>;
};

