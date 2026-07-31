/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InventoryFacetValueOut } from './InventoryFacetValueOut';
import type { InventoryOptionFacetOut } from './InventoryOptionFacetOut';
import type { InventoryProductFacetOut } from './InventoryProductFacetOut';
import type { InventoryRangesOut } from './InventoryRangesOut';
import type { InventorySummaryOut } from './InventorySummaryOut';
export type InventoryFacetsOut = {
    summary?: InventorySummaryOut;
    products?: Array<InventoryProductFacetOut>;
    product_statuses?: Array<InventoryFacetValueOut>;
    variant_statuses?: Array<InventoryFacetValueOut>;
    product_kinds?: Array<InventoryFacetValueOut>;
    stock_states?: Array<InventoryFacetValueOut>;
    options?: Array<InventoryOptionFacetOut>;
    ranges?: InventoryRangesOut;
    applied_filters?: Record<string, any>;
};

