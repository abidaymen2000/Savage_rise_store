/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSLocaleDirection } from './CMSLocaleDirection';
export type CMSLocaleState = {
    locale: string;
    direction?: CMSLocaleDirection;
    status: string;
    latest_revision?: (number | null);
    published_revision?: (number | null);
    has_unpublished_changes?: boolean;
    fallback_locale?: (string | null);
};

