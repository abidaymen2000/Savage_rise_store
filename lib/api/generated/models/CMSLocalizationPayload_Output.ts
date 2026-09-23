/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSComponentLocalization } from './CMSComponentLocalization';
import type { CMSSEOConfig } from './CMSSEOConfig';
export type CMSLocalizationPayload_Output = {
    slug?: (string | null);
    title?: (string | null);
    subtitle?: (string | null);
    name?: (string | null);
    description?: (string | null);
    seo?: (CMSSEOConfig | null);
    components?: Array<CMSComponentLocalization>;
};

