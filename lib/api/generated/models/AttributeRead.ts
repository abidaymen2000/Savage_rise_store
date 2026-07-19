/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttributeDataType } from './AttributeDataType';
import type { AttributeScope } from './AttributeScope';
export type AttributeRead = {
    id: string;
    version: number;
    created_at?: (string | null);
    updated_at?: (string | null);
    code: string;
    name: string;
    description?: (string | null);
    data_type: AttributeDataType;
    scope: AttributeScope;
    is_required?: boolean;
    is_variant_axis?: boolean;
    is_filterable?: boolean;
    is_searchable?: boolean;
    is_comparable?: boolean;
    is_visible_storefront?: boolean;
    unit_code?: (string | null);
    validation_rules?: Record<string, any>;
    position?: number;
    is_active: boolean;
};

