/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnalyticsEventDefinition } from '../models/AnalyticsEventDefinition';
import type { AnalyticsEventPageResponse } from '../models/AnalyticsEventPageResponse';
import type { AnalyticsEventRead } from '../models/AnalyticsEventRead';
import type { AnalyticsFunnelResponse } from '../models/AnalyticsFunnelResponse';
import type { AnalyticsOverviewResponse } from '../models/AnalyticsOverviewResponse';
import type { ProductAnalyticsResponse } from '../models/ProductAnalyticsResponse';
import type { TrafficAllDataResponse } from '../models/TrafficAllDataResponse';
import type { TrafficBreakdownResponse } from '../models/TrafficBreakdownResponse';
import type { TrafficButtonsResponse } from '../models/TrafficButtonsResponse';
import type { TrafficDashboardResponse } from '../models/TrafficDashboardResponse';
import type { TrafficPagesResponse } from '../models/TrafficPagesResponse';
import type { TrafficRealtimeResponse } from '../models/TrafficRealtimeResponse';
import type { TrafficSourceAnalyticsResponse } from '../models/TrafficSourceAnalyticsResponse';
import type { TrafficTimeSeriesResponse } from '../models/TrafficTimeSeriesResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AnalyticsService {
    /**
     * Recevoir un evenement analytics public
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createAnalyticsEventAnalyticsEventsPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/analytics/events',
        });
    }
    /**
     * Analytics Event Catalog
     * @returns AnalyticsEventDefinition Successful Response
     * @throws ApiError
     */
    public static analyticsEventCatalogAnalyticsEventsCatalogGet(): CancelablePromise<Array<AnalyticsEventDefinition>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/analytics/events/catalog',
        });
    }
    /**
     * Admin Analytics Event Catalog
     * @returns AnalyticsEventDefinition Successful Response
     * @throws ApiError
     */
    public static adminAnalyticsEventCatalogAdminAnalyticsEventsCatalogGet(): CancelablePromise<Array<AnalyticsEventDefinition>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/analytics/events/catalog',
        });
    }
    /**
     * Admin Analytics Overview
     * @returns AnalyticsOverviewResponse Successful Response
     * @throws ApiError
     */
    public static adminAnalyticsOverviewAdminAnalyticsOverviewGet({
        dateFrom,
        dateTo,
        eventName,
        productId,
        source,
        utmCampaign,
        eventCategory,
        deviceType,
    }: {
        dateFrom?: (string | null),
        dateTo?: (string | null),
        eventName?: (string | null),
        productId?: (string | null),
        source?: (string | null),
        utmCampaign?: (string | null),
        eventCategory?: (string | null),
        deviceType?: (string | null),
    }): CancelablePromise<AnalyticsOverviewResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/analytics/overview',
            query: {
                'date_from': dateFrom,
                'date_to': dateTo,
                'event_name': eventName,
                'product_id': productId,
                'source': source,
                'utm_campaign': utmCampaign,
                'event_category': eventCategory,
                'device_type': deviceType,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Analytics Funnel
     * @returns AnalyticsFunnelResponse Successful Response
     * @throws ApiError
     */
    public static adminAnalyticsFunnelAdminAnalyticsFunnelGet({
        dateFrom,
        dateTo,
        eventName,
        productId,
        source,
        utmCampaign,
        eventCategory,
        deviceType,
    }: {
        dateFrom?: (string | null),
        dateTo?: (string | null),
        eventName?: (string | null),
        productId?: (string | null),
        source?: (string | null),
        utmCampaign?: (string | null),
        eventCategory?: (string | null),
        deviceType?: (string | null),
    }): CancelablePromise<AnalyticsFunnelResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/analytics/funnel',
            query: {
                'date_from': dateFrom,
                'date_to': dateTo,
                'event_name': eventName,
                'product_id': productId,
                'source': source,
                'utm_campaign': utmCampaign,
                'event_category': eventCategory,
                'device_type': deviceType,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Analytics Products
     * @returns ProductAnalyticsResponse Successful Response
     * @throws ApiError
     */
    public static adminAnalyticsProductsAdminAnalyticsProductsGet({
        dateFrom,
        dateTo,
        eventName,
        productId,
        source,
        utmCampaign,
        eventCategory,
        deviceType,
    }: {
        dateFrom?: (string | null),
        dateTo?: (string | null),
        eventName?: (string | null),
        productId?: (string | null),
        source?: (string | null),
        utmCampaign?: (string | null),
        eventCategory?: (string | null),
        deviceType?: (string | null),
    }): CancelablePromise<ProductAnalyticsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/analytics/products',
            query: {
                'date_from': dateFrom,
                'date_to': dateTo,
                'event_name': eventName,
                'product_id': productId,
                'source': source,
                'utm_campaign': utmCampaign,
                'event_category': eventCategory,
                'device_type': deviceType,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Analytics Traffic Sources
     * @returns TrafficSourceAnalyticsResponse Successful Response
     * @throws ApiError
     */
    public static adminAnalyticsTrafficSourcesAdminAnalyticsTrafficSourcesGet({
        dateFrom,
        dateTo,
        eventName,
        productId,
        source,
        utmCampaign,
        eventCategory,
        deviceType,
    }: {
        dateFrom?: (string | null),
        dateTo?: (string | null),
        eventName?: (string | null),
        productId?: (string | null),
        source?: (string | null),
        utmCampaign?: (string | null),
        eventCategory?: (string | null),
        deviceType?: (string | null),
    }): CancelablePromise<TrafficSourceAnalyticsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/analytics/traffic-sources',
            query: {
                'date_from': dateFrom,
                'date_to': dateTo,
                'event_name': eventName,
                'product_id': productId,
                'source': source,
                'utm_campaign': utmCampaign,
                'event_category': eventCategory,
                'device_type': deviceType,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Analytics Recent Events
     * @returns AnalyticsEventRead Successful Response
     * @throws ApiError
     */
    public static adminAnalyticsRecentEventsAdminAnalyticsRecentEventsGet({
        limit = 50,
        dateFrom,
        dateTo,
        eventName,
        productId,
        source,
        utmCampaign,
        eventCategory,
        deviceType,
    }: {
        limit?: number,
        dateFrom?: (string | null),
        dateTo?: (string | null),
        eventName?: (string | null),
        productId?: (string | null),
        source?: (string | null),
        utmCampaign?: (string | null),
        eventCategory?: (string | null),
        deviceType?: (string | null),
    }): CancelablePromise<Array<AnalyticsEventRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/analytics/recent-events',
            query: {
                'limit': limit,
                'date_from': dateFrom,
                'date_to': dateTo,
                'event_name': eventName,
                'product_id': productId,
                'source': source,
                'utm_campaign': utmCampaign,
                'event_category': eventCategory,
                'device_type': deviceType,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Traffic Dashboard
     * @returns TrafficDashboardResponse Successful Response
     * @throws ApiError
     */
    public static adminTrafficDashboardAdminTrafficDashboardGet({
        interval = 'day',
        dateFrom,
        dateTo,
        eventName,
        productId,
        source,
        utmCampaign,
        eventCategory,
        deviceType,
    }: {
        interval?: string,
        dateFrom?: (string | null),
        dateTo?: (string | null),
        eventName?: (string | null),
        productId?: (string | null),
        source?: (string | null),
        utmCampaign?: (string | null),
        eventCategory?: (string | null),
        deviceType?: (string | null),
    }): CancelablePromise<TrafficDashboardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/traffic/dashboard',
            query: {
                'interval': interval,
                'date_from': dateFrom,
                'date_to': dateTo,
                'event_name': eventName,
                'product_id': productId,
                'source': source,
                'utm_campaign': utmCampaign,
                'event_category': eventCategory,
                'device_type': deviceType,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Traffic All Data
     * @returns TrafficAllDataResponse Successful Response
     * @throws ApiError
     */
    public static adminTrafficAllDataAdminTrafficAllDataGet({
        interval = 'day',
        page = 1,
        pageSize = 100,
        dateFrom,
        dateTo,
        eventName,
        productId,
        source,
        utmCampaign,
        eventCategory,
        deviceType,
    }: {
        interval?: string,
        page?: number,
        pageSize?: number,
        dateFrom?: (string | null),
        dateTo?: (string | null),
        eventName?: (string | null),
        productId?: (string | null),
        source?: (string | null),
        utmCampaign?: (string | null),
        eventCategory?: (string | null),
        deviceType?: (string | null),
    }): CancelablePromise<TrafficAllDataResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/traffic/all-data',
            query: {
                'interval': interval,
                'page': page,
                'page_size': pageSize,
                'date_from': dateFrom,
                'date_to': dateTo,
                'event_name': eventName,
                'product_id': productId,
                'source': source,
                'utm_campaign': utmCampaign,
                'event_category': eventCategory,
                'device_type': deviceType,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Traffic Realtime
     * @returns TrafficRealtimeResponse Successful Response
     * @throws ApiError
     */
    public static adminTrafficRealtimeAdminTrafficRealtimeGet({
        windowMinutes = 1,
        dateFrom,
        dateTo,
        eventName,
        productId,
        source,
        utmCampaign,
        eventCategory,
        deviceType,
    }: {
        windowMinutes?: number,
        dateFrom?: (string | null),
        dateTo?: (string | null),
        eventName?: (string | null),
        productId?: (string | null),
        source?: (string | null),
        utmCampaign?: (string | null),
        eventCategory?: (string | null),
        deviceType?: (string | null),
    }): CancelablePromise<TrafficRealtimeResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/traffic/realtime',
            query: {
                'window_minutes': windowMinutes,
                'date_from': dateFrom,
                'date_to': dateTo,
                'event_name': eventName,
                'product_id': productId,
                'source': source,
                'utm_campaign': utmCampaign,
                'event_category': eventCategory,
                'device_type': deviceType,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Traffic Overview
     * @returns AnalyticsOverviewResponse Successful Response
     * @throws ApiError
     */
    public static adminTrafficOverviewAdminTrafficOverviewGet({
        dateFrom,
        dateTo,
        eventName,
        productId,
        source,
        utmCampaign,
        eventCategory,
        deviceType,
    }: {
        dateFrom?: (string | null),
        dateTo?: (string | null),
        eventName?: (string | null),
        productId?: (string | null),
        source?: (string | null),
        utmCampaign?: (string | null),
        eventCategory?: (string | null),
        deviceType?: (string | null),
    }): CancelablePromise<AnalyticsOverviewResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/traffic/overview',
            query: {
                'date_from': dateFrom,
                'date_to': dateTo,
                'event_name': eventName,
                'product_id': productId,
                'source': source,
                'utm_campaign': utmCampaign,
                'event_category': eventCategory,
                'device_type': deviceType,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Traffic Time Series
     * @returns TrafficTimeSeriesResponse Successful Response
     * @throws ApiError
     */
    public static adminTrafficTimeSeriesAdminTrafficTimeseriesGet({
        metric = 'visitors',
        interval = 'day',
        dateFrom,
        dateTo,
        eventName,
        productId,
        source,
        utmCampaign,
        eventCategory,
        deviceType,
    }: {
        metric?: string,
        interval?: string,
        dateFrom?: (string | null),
        dateTo?: (string | null),
        eventName?: (string | null),
        productId?: (string | null),
        source?: (string | null),
        utmCampaign?: (string | null),
        eventCategory?: (string | null),
        deviceType?: (string | null),
    }): CancelablePromise<TrafficTimeSeriesResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/traffic/timeseries',
            query: {
                'metric': metric,
                'interval': interval,
                'date_from': dateFrom,
                'date_to': dateTo,
                'event_name': eventName,
                'product_id': productId,
                'source': source,
                'utm_campaign': utmCampaign,
                'event_category': eventCategory,
                'device_type': deviceType,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Traffic Breakdown
     * @returns TrafficBreakdownResponse Successful Response
     * @throws ApiError
     */
    public static adminTrafficBreakdownAdminTrafficBreakdownGet({
        dateFrom,
        dateTo,
        eventName,
        productId,
        source,
        utmCampaign,
        eventCategory,
        deviceType,
    }: {
        dateFrom?: (string | null),
        dateTo?: (string | null),
        eventName?: (string | null),
        productId?: (string | null),
        source?: (string | null),
        utmCampaign?: (string | null),
        eventCategory?: (string | null),
        deviceType?: (string | null),
    }): CancelablePromise<TrafficBreakdownResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/traffic/breakdown',
            query: {
                'date_from': dateFrom,
                'date_to': dateTo,
                'event_name': eventName,
                'product_id': productId,
                'source': source,
                'utm_campaign': utmCampaign,
                'event_category': eventCategory,
                'device_type': deviceType,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Traffic Sources
     * @returns TrafficSourceAnalyticsResponse Successful Response
     * @throws ApiError
     */
    public static adminTrafficSourcesAdminTrafficSourcesGet({
        dateFrom,
        dateTo,
        eventName,
        productId,
        source,
        utmCampaign,
        eventCategory,
        deviceType,
    }: {
        dateFrom?: (string | null),
        dateTo?: (string | null),
        eventName?: (string | null),
        productId?: (string | null),
        source?: (string | null),
        utmCampaign?: (string | null),
        eventCategory?: (string | null),
        deviceType?: (string | null),
    }): CancelablePromise<TrafficSourceAnalyticsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/traffic/sources',
            query: {
                'date_from': dateFrom,
                'date_to': dateTo,
                'event_name': eventName,
                'product_id': productId,
                'source': source,
                'utm_campaign': utmCampaign,
                'event_category': eventCategory,
                'device_type': deviceType,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Traffic Pages
     * @returns TrafficPagesResponse Successful Response
     * @throws ApiError
     */
    public static adminTrafficPagesAdminTrafficPagesGet({
        limit = 20,
        dateFrom,
        dateTo,
        eventName,
        productId,
        source,
        utmCampaign,
        eventCategory,
        deviceType,
    }: {
        limit?: number,
        dateFrom?: (string | null),
        dateTo?: (string | null),
        eventName?: (string | null),
        productId?: (string | null),
        source?: (string | null),
        utmCampaign?: (string | null),
        eventCategory?: (string | null),
        deviceType?: (string | null),
    }): CancelablePromise<TrafficPagesResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/traffic/pages',
            query: {
                'limit': limit,
                'date_from': dateFrom,
                'date_to': dateTo,
                'event_name': eventName,
                'product_id': productId,
                'source': source,
                'utm_campaign': utmCampaign,
                'event_category': eventCategory,
                'device_type': deviceType,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Traffic Buttons
     * @returns TrafficButtonsResponse Successful Response
     * @throws ApiError
     */
    public static adminTrafficButtonsAdminTrafficButtonsGet({
        limit = 20,
        dateFrom,
        dateTo,
        eventName,
        productId,
        source,
        utmCampaign,
        eventCategory,
        deviceType,
    }: {
        limit?: number,
        dateFrom?: (string | null),
        dateTo?: (string | null),
        eventName?: (string | null),
        productId?: (string | null),
        source?: (string | null),
        utmCampaign?: (string | null),
        eventCategory?: (string | null),
        deviceType?: (string | null),
    }): CancelablePromise<TrafficButtonsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/traffic/buttons',
            query: {
                'limit': limit,
                'date_from': dateFrom,
                'date_to': dateTo,
                'event_name': eventName,
                'product_id': productId,
                'source': source,
                'utm_campaign': utmCampaign,
                'event_category': eventCategory,
                'device_type': deviceType,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Traffic Products
     * @returns ProductAnalyticsResponse Successful Response
     * @throws ApiError
     */
    public static adminTrafficProductsAdminTrafficProductsGet({
        dateFrom,
        dateTo,
        eventName,
        productId,
        source,
        utmCampaign,
        eventCategory,
        deviceType,
    }: {
        dateFrom?: (string | null),
        dateTo?: (string | null),
        eventName?: (string | null),
        productId?: (string | null),
        source?: (string | null),
        utmCampaign?: (string | null),
        eventCategory?: (string | null),
        deviceType?: (string | null),
    }): CancelablePromise<ProductAnalyticsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/traffic/products',
            query: {
                'date_from': dateFrom,
                'date_to': dateTo,
                'event_name': eventName,
                'product_id': productId,
                'source': source,
                'utm_campaign': utmCampaign,
                'event_category': eventCategory,
                'device_type': deviceType,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Traffic Funnel
     * @returns AnalyticsFunnelResponse Successful Response
     * @throws ApiError
     */
    public static adminTrafficFunnelAdminTrafficFunnelGet({
        dateFrom,
        dateTo,
        eventName,
        productId,
        source,
        utmCampaign,
        eventCategory,
        deviceType,
    }: {
        dateFrom?: (string | null),
        dateTo?: (string | null),
        eventName?: (string | null),
        productId?: (string | null),
        source?: (string | null),
        utmCampaign?: (string | null),
        eventCategory?: (string | null),
        deviceType?: (string | null),
    }): CancelablePromise<AnalyticsFunnelResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/traffic/funnel',
            query: {
                'date_from': dateFrom,
                'date_to': dateTo,
                'event_name': eventName,
                'product_id': productId,
                'source': source,
                'utm_campaign': utmCampaign,
                'event_category': eventCategory,
                'device_type': deviceType,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Traffic Recent Events
     * @returns AnalyticsEventRead Successful Response
     * @throws ApiError
     */
    public static adminTrafficRecentEventsAdminTrafficRecentEventsGet({
        limit = 50,
        dateFrom,
        dateTo,
        eventName,
        productId,
        source,
        utmCampaign,
        eventCategory,
        deviceType,
    }: {
        limit?: number,
        dateFrom?: (string | null),
        dateTo?: (string | null),
        eventName?: (string | null),
        productId?: (string | null),
        source?: (string | null),
        utmCampaign?: (string | null),
        eventCategory?: (string | null),
        deviceType?: (string | null),
    }): CancelablePromise<Array<AnalyticsEventRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/traffic/recent-events',
            query: {
                'limit': limit,
                'date_from': dateFrom,
                'date_to': dateTo,
                'event_name': eventName,
                'product_id': productId,
                'source': source,
                'utm_campaign': utmCampaign,
                'event_category': eventCategory,
                'device_type': deviceType,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Traffic Events
     * @returns AnalyticsEventPageResponse Successful Response
     * @throws ApiError
     */
    public static adminTrafficEventsAdminTrafficEventsGet({
        page = 1,
        pageSize = 50,
        dateFrom,
        dateTo,
        eventName,
        productId,
        source,
        utmCampaign,
        eventCategory,
        deviceType,
    }: {
        page?: number,
        pageSize?: number,
        dateFrom?: (string | null),
        dateTo?: (string | null),
        eventName?: (string | null),
        productId?: (string | null),
        source?: (string | null),
        utmCampaign?: (string | null),
        eventCategory?: (string | null),
        deviceType?: (string | null),
    }): CancelablePromise<AnalyticsEventPageResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/traffic/events',
            query: {
                'page': page,
                'page_size': pageSize,
                'date_from': dateFrom,
                'date_to': dateTo,
                'event_name': eventName,
                'product_id': productId,
                'source': source,
                'utm_campaign': utmCampaign,
                'event_category': eventCategory,
                'device_type': deviceType,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
