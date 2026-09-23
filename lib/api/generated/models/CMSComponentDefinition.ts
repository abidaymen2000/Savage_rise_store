/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSComponentCapability } from './CMSComponentCapability';
import type { CMSComponentCategory } from './CMSComponentCategory';
import type { CMSComponentFieldDefinition } from './CMSComponentFieldDefinition';
import type { CMSComponentStatus } from './CMSComponentStatus';
export type CMSComponentDefinition = {
    key: string;
    name: string;
    category: CMSComponentCategory;
    description: string;
    version?: number;
    status?: CMSComponentStatus;
    allowed_page_types?: (Array<string> | null);
    schema?: Record<string, any>;
    fields?: Array<CMSComponentFieldDefinition>;
    default_props?: Record<string, any>;
    variants?: Array<Record<string, string>>;
    capabilities?: CMSComponentCapability;
    created_at: string;
    updated_at: string;
};

