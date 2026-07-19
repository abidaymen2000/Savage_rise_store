/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CostLinkedEntities } from './CostLinkedEntities';
export type CostCenterCreate = {
    name: string;
    description?: (string | null);
    type: 'production_batch' | 'marketing_campaign' | 'purchase_batch' | 'project' | 'operation' | 'event' | 'other';
    status?: 'draft' | 'active' | 'computed' | 'closed' | 'archived';
    currency?: string;
    start_date?: (string | null);
    end_date?: (string | null);
    linked_entities?: (CostLinkedEntities | null);
    attributes?: (Record<string, any> | null);
    metadata?: (Record<string, any> | null);
    notes?: (string | null);
};

