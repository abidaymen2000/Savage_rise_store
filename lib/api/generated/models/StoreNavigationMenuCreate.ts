/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NavigationMenuLocalization } from './NavigationMenuLocalization';
export type StoreNavigationMenuCreate = {
    code: string;
    label: string;
    description?: (string | null);
    is_active?: boolean;
    localizations?: Record<string, NavigationMenuLocalization>;
};

