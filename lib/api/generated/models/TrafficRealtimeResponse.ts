/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnalyticsEventRead } from './AnalyticsEventRead';
import type { AnalyticsFunnelResponse } from './AnalyticsFunnelResponse';
import type { AnalyticsOverviewResponse } from './AnalyticsOverviewResponse';
import type { TrafficBreakdownResponse } from './TrafficBreakdownResponse';
import type { TrafficTimeSeriesResponse } from './TrafficTimeSeriesResponse';
export type TrafficRealtimeResponse = {
    window_minutes: number;
    overview: AnalyticsOverviewResponse;
    funnel: AnalyticsFunnelResponse;
    time_series: Array<TrafficTimeSeriesResponse>;
    breakdown: TrafficBreakdownResponse;
    recent_events: Array<AnalyticsEventRead>;
};

