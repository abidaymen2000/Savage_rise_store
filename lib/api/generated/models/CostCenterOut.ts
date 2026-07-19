/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CostLinkedEntities } from './CostLinkedEntities';
export type CostCenterOut = {
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
    id: string;
    total_direct_cost?: number;
    total_indirect_cost?: number;
    total_allocated_cost?: number;
    total_unallocated_cost?: number;
    created_by?: (string | null);
    updated_by?: (string | null);
    created_at: string;
    updated_at: string;
    version?: number;
    is_archived?: boolean;
};

