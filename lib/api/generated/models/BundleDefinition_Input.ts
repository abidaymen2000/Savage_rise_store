/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BundleComponent } from './BundleComponent';
import type { BundleInventoryPolicy } from './BundleInventoryPolicy';
import type { BundlePricingPolicy_Input } from './BundlePricingPolicy_Input';
import type { BundleSelectionConstraint } from './BundleSelectionConstraint';
export type BundleDefinition_Input = {
    version?: number;
    components?: Array<BundleComponent>;
    selection_constraints?: Array<BundleSelectionConstraint>;
    pricing_policy?: BundlePricingPolicy_Input;
    inventory_policy?: BundleInventoryPolicy;
};

