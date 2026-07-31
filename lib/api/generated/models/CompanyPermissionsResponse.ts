/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlatformPermissionItem } from './PlatformPermissionItem';
import type { PlatformPermissionModule } from './PlatformPermissionModule';
export type CompanyPermissionsResponse = {
    modules: Array<PlatformPermissionModule>;
    permissions: Array<PlatformPermissionItem>;
    company_id: string;
    enabled_modules?: Array<string>;
    enabled_permissions?: Array<string>;
};

