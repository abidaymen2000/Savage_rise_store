/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DashboardPerformancePoint } from './DashboardPerformancePoint';
import type { DashboardPerformanceTotals } from './DashboardPerformanceTotals';
export type DashboardPerformanceResponse = {
    date_from: string;
    date_to: string;
    interval?: 'day' | 'week' | 'month';
    currency: string;
    totals: DashboardPerformanceTotals;
    series: Array<DashboardPerformancePoint>;
};

