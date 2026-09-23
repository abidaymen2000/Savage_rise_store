/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryStatus } from './CategoryStatus';
export type CategoryUpdate = {
    name?: (string | null);
    description?: (string | null);
    attribute_set_id?: (string | null);
    image?: (Record<string, any> | null);
    icon?: (Record<string, any> | null);
    seo?: (Record<string, any> | null);
    status?: (CategoryStatus | null);
    expected_version?: (number | null);
};

