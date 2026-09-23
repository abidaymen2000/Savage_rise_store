/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StoreNavigationPublicItem } from './StoreNavigationPublicItem';
export type StoreNavigationPublicMenu = {
    code: string;
    label: string;
    locale?: (string | null);
    direction?: (string | null);
    fallback_locale_used?: (string | null);
    translation_status?: (string | null);
    version: number;
    items?: Array<StoreNavigationPublicItem>;
    updated_at?: (string | null);
};

