/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSOpenGraphSEO } from './CMSOpenGraphSEO';
import type { CMSTwitterSEO } from './CMSTwitterSEO';
export type CMSSEOConfig = {
    title?: (string | null);
    description?: (string | null);
    canonical_url?: (string | null);
    no_index?: boolean;
    no_follow?: boolean;
    open_graph?: CMSOpenGraphSEO;
    twitter?: CMSTwitterSEO;
};

