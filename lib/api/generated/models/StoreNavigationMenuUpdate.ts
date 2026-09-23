/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NavigationMenuLocalization } from './NavigationMenuLocalization';
export type StoreNavigationMenuUpdate = {
    label?: (string | null);
    description?: (string | null);
    is_active?: (boolean | null);
    localizations?: (Record<string, NavigationMenuLocalization> | null);
    expected_version: number;
};

