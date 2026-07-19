/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MarketingPerformanceResponse } from './MarketingPerformanceResponse';
export type MarketingDashboardResponse = {
    active_campaigns?: number;
    active_collaborations?: number;
    pending_approvals?: number;
    overdue_deliverables?: number;
    overdue_loans?: number;
    total_partners?: number;
    total_cost?: number;
    collected_revenue?: number;
    performance?: MarketingPerformanceResponse;
};

