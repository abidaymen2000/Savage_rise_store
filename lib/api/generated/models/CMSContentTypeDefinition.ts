/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSContentFieldDefinition } from './CMSContentFieldDefinition';
import type { CMSContentTypeCapability } from './CMSContentTypeCapability';
import type { CMSContentTypeStatus } from './CMSContentTypeStatus';
export type CMSContentTypeDefinition = {
    key: string;
    name: string;
    description: string;
    status?: CMSContentTypeStatus;
    fields?: Array<CMSContentFieldDefinition>;
    capabilities?: CMSContentTypeCapability;
    route_pattern?: (string | null);
    created_at: string;
    updated_at: string;
};

