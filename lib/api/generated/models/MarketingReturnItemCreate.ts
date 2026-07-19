/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type MarketingReturnItemCreate = {
    line_id: string;
    quantity: number;
    condition: 'resellable' | 'needs_inspection' | 'damaged' | 'lost';
    disposition: 'restock' | 'quality_control' | 'damaged' | 'lost';
    notes?: (string | null);
};

