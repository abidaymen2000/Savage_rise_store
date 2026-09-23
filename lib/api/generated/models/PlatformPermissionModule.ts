/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlatformPermissionItem } from './PlatformPermissionItem';
export type PlatformPermissionModule = {
    key: string;
    label: string;
    description?: (string | null);
    section?: (string | null);
    icon?: (string | null);
    surface?: (string | null);
    order?: number;
    permissions: Array<PlatformPermissionItem>;
};

