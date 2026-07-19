/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CostLinkedEntities } from './CostLinkedEntities';
export type CostCenterUpdate = {
    name?: (string | null);
    description?: (string | null);
    type?: ('production_batch' | 'marketing_campaign' | 'purchase_batch' | 'project' | 'operation' | 'event' | 'other' | null);
    status?: ('draft' | 'active' | 'computed' | 'closed' | 'archived' | null);
    currency?: (string | null);
    start_date?: (string | null);
    end_date?: (string | null);
    linked_entities?: (CostLinkedEntities | null);
    attributes?: (Record<string, any> | null);
    metadata?: (Record<string, any> | null);
    notes?: (string | null);
    expected_version?: (number | null);
};

