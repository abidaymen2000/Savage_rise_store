/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type BundleComponent = {
    component_id: string;
    product_id: string;
    quantity?: number;
    selection_mode: 'fixed_variant' | 'customer_select_variant' | 'any_available_variant';
    fixed_variant_id?: (string | null);
    allowed_variant_ids?: Array<string>;
    allowed_option_values?: Record<string, Array<string>>;
    is_required?: boolean;
    position?: number;
};

