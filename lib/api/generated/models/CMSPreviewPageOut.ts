/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSHistoryResourceType } from './CMSHistoryResourceType';
import type { CMSTheme } from './CMSTheme';
export type CMSPreviewPageOut = {
    resource_type?: CMSHistoryResourceType;
    resource_id: string;
    revision?: (number | null);
    locale?: (string | null);
    page: Record<string, any>;
    theme: CMSTheme;
};

