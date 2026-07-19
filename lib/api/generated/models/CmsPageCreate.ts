/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CmsPageCreate = {
    key: string;
    label: string;
    section: string;
    path: string;
    icon?: (string | null);
    order?: number;
    is_active?: boolean;
    requires_permission?: boolean;
    surface?: 'erp' | 'cms';
    show_in_nav?: boolean;
};

