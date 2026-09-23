/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSContentEntryLocalization } from './CMSContentEntryLocalization';
import type { CMSContentEntryStatus } from './CMSContentEntryStatus';
export type CMSContentEntryOut = {
    id: string;
    content_type: string;
    key: string;
    slug?: (string | null);
    status: CMSContentEntryStatus;
    fields?: Record<string, (string | number | boolean | Record<string, (string | number | boolean | Record<string, (string | number | boolean | null)> | null)> | null)>;
    localizations?: Record<string, CMSContentEntryLocalization>;
    version: number;
    latest_revision?: (number | null);
    published_revision?: (number | null);
    published_locales?: Record<string, number>;
    published_at?: (string | null);
    published_by?: (string | null);
    created_by?: (string | null);
    updated_by?: (string | null);
    created_at: string;
    updated_at: string;
    archived_at?: (string | null);
    resolved_references?: Record<string, (string | number | boolean | Record<string, (string | number | boolean | Record<string, (string | number | boolean | null)> | null)> | null)>;
};

