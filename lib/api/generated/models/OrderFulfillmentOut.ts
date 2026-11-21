/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FulfillmentLocation } from './FulfillmentLocation';
import type { InventoryAllocationOut } from './InventoryAllocationOut';
export type OrderFulfillmentOut = {
    revision: number;
    editable: boolean;
    allocations: Array<InventoryAllocationOut>;
    locations: Array<FulfillmentLocation>;
    suggested_location_id?: (string | null);
};

