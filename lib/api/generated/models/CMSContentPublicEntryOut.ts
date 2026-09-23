/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CMSContentPublicEntryOut = {
    id: string;
    content_type: string;
    key: string;
    slug?: (string | null);
    fields?: Record<string, (string | number | boolean | Record<string, (string | number | boolean | Record<string, (string | number | boolean | null)> | null)> | null)>;
    locale?: (string | null);
    fallback_locale_used?: (string | null);
    translation_status?: ('source' | 'translated' | 'fallback' | null);
    resolved_references?: Record<string, (string | number | boolean | Record<string, (string | number | boolean | Record<string, (string | number | boolean | null)> | null)> | null)>;
    published_at?: (string | null);
    updated_at: string;
};

