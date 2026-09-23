/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttributeDataType } from './AttributeDataType';
import type { AttributeScope } from './AttributeScope';
export type AttributeUpdate = {
    name?: (string | null);
    description?: (string | null);
    input_type?: (string | null);
    data_type?: (AttributeDataType | null);
    scope?: (AttributeScope | null);
    is_required?: (boolean | null);
    is_variant_axis?: (boolean | null);
    is_filterable?: (boolean | null);
    is_searchable?: (boolean | null);
    is_comparable?: (boolean | null);
    is_visible_storefront?: (boolean | null);
    is_active?: (boolean | null);
    unit_code?: (string | null);
    validation_rules?: (Record<string, any> | null);
    position?: (number | null);
    expected_version?: (number | null);
};

