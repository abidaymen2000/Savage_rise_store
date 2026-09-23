/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSOpenGraphSEO } from './CMSOpenGraphSEO';
import type { CMSTwitterSEO } from './CMSTwitterSEO';
export type CMSSEOResolved = {
    title: string;
    description?: (string | null);
    canonical_url: string;
    robots: string;
    no_index?: boolean;
    no_follow?: boolean;
    open_graph?: CMSOpenGraphSEO;
    twitter?: CMSTwitterSEO;
    alternates?: Array<Record<string, string>>;
    structured_data?: Array<Record<string, any>>;
};

