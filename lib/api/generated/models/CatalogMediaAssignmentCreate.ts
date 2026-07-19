/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CatalogMediaAssignmentItemWrite } from './CatalogMediaAssignmentItemWrite';
import type { CatalogMediaTarget } from './CatalogMediaTarget';
export type CatalogMediaAssignmentCreate = {
    /**
     * @deprecated
     */
    asset_ids?: Array<string>;
    target: CatalogMediaTarget;
    replace_target_media?: boolean;
    items?: Array<CatalogMediaAssignmentItemWrite>;
};

