/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSHistoryResourceType } from './CMSHistoryResourceType';
export type CMSRestoreRevisionOut = {
    resource_type: CMSHistoryResourceType;
    resource_id: string;
    restored_revision: number;
    new_revision: number;
    resource_version: number;
    resource: Record<string, any>;
};

