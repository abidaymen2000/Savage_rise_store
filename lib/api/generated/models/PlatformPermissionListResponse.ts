/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlatformPermissionModule } from './PlatformPermissionModule';
import type { PlatformPermissionOut } from './PlatformPermissionOut';
export type PlatformPermissionListResponse = {
    items: Array<PlatformPermissionOut>;
    total: number;
    page: number;
    page_size: number;
    pages: number;
    modules?: Array<string>;
    permission_modules?: Array<PlatformPermissionModule>;
};

