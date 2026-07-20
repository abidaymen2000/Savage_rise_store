/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StoreNavigationIssue } from './StoreNavigationIssue';
export type StoreNavigationValidationResult = {
    is_valid: boolean;
    errors?: Array<StoreNavigationIssue>;
    warnings?: Array<StoreNavigationIssue>;
    broken_targets?: Array<StoreNavigationIssue>;
    disabled_destinations?: Array<StoreNavigationIssue>;
    orphan_items?: Array<StoreNavigationIssue>;
    cycles?: Array<StoreNavigationIssue>;
    invalid_positions?: Array<StoreNavigationIssue>;
};

