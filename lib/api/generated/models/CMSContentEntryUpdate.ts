/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSContentEntryLocalization } from './CMSContentEntryLocalization';
import type { CMSContentEntryStatus } from './CMSContentEntryStatus';
export type CMSContentEntryUpdate = {
    expected_version: number;
    key?: (string | null);
    slug?: (string | null);
    fields?: (Record<string, (string | number | boolean | Record<string, (string | number | boolean | Record<string, (string | number | boolean | null)> | null)> | null)> | null);
    localizations?: (Record<string, CMSContentEntryLocalization> | null);
    status?: (CMSContentEntryStatus | null);
};

