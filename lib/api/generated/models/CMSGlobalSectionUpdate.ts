/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSGlobalSectionStatus } from './CMSGlobalSectionStatus';
import type { CMSLocalizationPayload_Input } from './CMSLocalizationPayload_Input';
export type CMSGlobalSectionUpdate = {
    expected_version: number;
    key?: (string | null);
    name?: (string | null);
    description?: (string | null);
    status?: (CMSGlobalSectionStatus | null);
    components?: null;
    localizations?: (Record<string, CMSLocalizationPayload_Input> | null);
};

