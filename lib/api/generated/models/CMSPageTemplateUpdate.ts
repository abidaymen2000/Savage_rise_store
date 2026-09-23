/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSLocalizationPayload_Input } from './CMSLocalizationPayload_Input';
import type { CMSPageTemplateStatus } from './CMSPageTemplateStatus';
import type { CMSPageTemplateTarget } from './CMSPageTemplateTarget';
export type CMSPageTemplateUpdate = {
    expected_version: number;
    key?: (string | null);
    name?: (string | null);
    description?: (string | null);
    target?: (CMSPageTemplateTarget | null);
    status?: (CMSPageTemplateStatus | null);
    components?: null;
    localizations?: (Record<string, CMSLocalizationPayload_Input> | null);
};

