/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FulfillmentStockLine } from './FulfillmentStockLine';
export type FulfillmentLocation = {
    location_id: string;
    name: string;
    city?: string;
    priority: number;
    can_fulfill: boolean;
    lines: Array<FulfillmentStockLine>;
};

