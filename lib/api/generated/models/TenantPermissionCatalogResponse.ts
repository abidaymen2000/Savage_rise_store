/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TenantPermissionCatalogItem } from './TenantPermissionCatalogItem';
import type { TenantPermissionCatalogModule } from './TenantPermissionCatalogModule';
export type TenantPermissionCatalogResponse = {
    company_id: string;
    enabled_permissions?: Array<string>;
    wildcards?: Array<TenantPermissionCatalogItem>;
    modules?: Array<TenantPermissionCatalogModule>;
    permissions?: Array<TenantPermissionCatalogItem>;
};

