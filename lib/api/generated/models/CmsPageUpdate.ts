/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CmsPageUpdate = {
    /**
     * Nouvelle cle permission unique. Refusee si la cle actuelle est utilisee.
     */
    key?: (string | null);
    label?: (string | null);
    section?: (string | null);
    path?: (string | null);
    icon?: (string | null);
    order?: (number | null);
    is_active?: (boolean | null);
    requires_permission?: (boolean | null);
    surface?: ('erp' | 'cms' | null);
    show_in_nav?: (boolean | null);
    classification?: (string | null);
    feature?: (string | null);
    action?: (string | null);
};

