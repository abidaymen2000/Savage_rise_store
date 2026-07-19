/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnalyticsEventRead } from './AnalyticsEventRead';
import type { AnalyticsFunnelResponse } from './AnalyticsFunnelResponse';
import type { AnalyticsOverviewResponse } from './AnalyticsOverviewResponse';
import type { ProductAnalyticsResponse } from './ProductAnalyticsResponse';
import type { TrafficBreakdownResponse } from './TrafficBreakdownResponse';
import type { TrafficButtonsResponse } from './TrafficButtonsResponse';
import type { TrafficPagesResponse } from './TrafficPagesResponse';
import type { TrafficTimeSeriesResponse } from './TrafficTimeSeriesResponse';
export type TrafficDashboardResponse = {
    overview: AnalyticsOverviewResponse;
    funnel: AnalyticsFunnelResponse;
    time_series: Array<TrafficTimeSeriesResponse>;
    breakdown: TrafficBreakdownResponse;
    pages: TrafficPagesResponse;
    buttons: TrafficButtonsResponse;
    products: ProductAnalyticsResponse;
    recent_events: Array<AnalyticsEventRead>;
};

