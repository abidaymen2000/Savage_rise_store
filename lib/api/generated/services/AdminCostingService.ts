/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ComputeCostCenterResponse } from '../models/ComputeCostCenterResponse';
import type { CostAllocationCreate } from '../models/CostAllocationCreate';
import type { CostAllocationOut } from '../models/CostAllocationOut';
import type { CostAllocationUpdate } from '../models/CostAllocationUpdate';
import type { CostCategoryCreate } from '../models/CostCategoryCreate';
import type { CostCategoryOut } from '../models/CostCategoryOut';
import type { CostCategoryUpdate } from '../models/CostCategoryUpdate';
import type { CostCenterCreate } from '../models/CostCenterCreate';
import type { CostCenterOut } from '../models/CostCenterOut';
import type { CostCenterSummaryOut } from '../models/CostCenterSummaryOut';
import type { CostCenterUpdate } from '../models/CostCenterUpdate';
import type { CostLineCreate } from '../models/CostLineCreate';
import type { CostLineOut } from '../models/CostLineOut';
import type { CostLineUpdate } from '../models/CostLineUpdate';
import type { PaginatedResponse_CostAllocationOut_ } from '../models/PaginatedResponse_CostAllocationOut_';
import type { PaginatedResponse_CostCenterOut_ } from '../models/PaginatedResponse_CostCenterOut_';
import type { PaginatedResponse_CostLineOut_ } from '../models/PaginatedResponse_CostLineOut_';
import type { ProductCostSnapshotOut } from '../models/ProductCostSnapshotOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminCostingService {
    /**
     * Api List Cost Centers
     * @returns PaginatedResponse_CostCenterOut_ Successful Response
     * @throws ApiError
     */
    public static apiListCostCentersAdminCostCentersGet({
        q,
        status,
        type,
        page = 1,
        pageSize = 20,
    }: {
        q?: (string | null),
        status?: (string | null),
        type?: (string | null),
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_CostCenterOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cost-centers',
            query: {
                'q': q,
                'status': status,
                'type': type,
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Create Cost Center
     * @returns CostCenterOut Successful Response
     * @throws ApiError
     */
    public static apiCreateCostCenterAdminCostCentersPost({
        requestBody,
    }: {
        requestBody: CostCenterCreate,
    }): CancelablePromise<CostCenterOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/cost-centers',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Get Cost Center
     * @returns CostCenterOut Successful Response
     * @throws ApiError
     */
    public static apiGetCostCenterAdminCostCentersCostCenterIdGet({
        costCenterId,
    }: {
        costCenterId: string,
    }): CancelablePromise<CostCenterOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cost-centers/{cost_center_id}',
            path: {
                'cost_center_id': costCenterId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Update Cost Center
     * @returns CostCenterOut Successful Response
     * @throws ApiError
     */
    public static apiUpdateCostCenterAdminCostCentersCostCenterIdPatch({
        costCenterId,
        requestBody,
    }: {
        costCenterId: string,
        requestBody: CostCenterUpdate,
    }): CancelablePromise<CostCenterOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/cost-centers/{cost_center_id}',
            path: {
                'cost_center_id': costCenterId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Delete Cost Center
     * @returns CostCenterOut Successful Response
     * @throws ApiError
     */
    public static apiDeleteCostCenterAdminCostCentersCostCenterIdDelete({
        costCenterId,
    }: {
        costCenterId: string,
    }): CancelablePromise<CostCenterOut> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/cost-centers/{cost_center_id}',
            path: {
                'cost_center_id': costCenterId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Cost Center Summary
     * @returns CostCenterSummaryOut Successful Response
     * @throws ApiError
     */
    public static apiCostCenterSummaryAdminCostCentersCostCenterIdSummaryGet({
        costCenterId,
    }: {
        costCenterId: string,
    }): CancelablePromise<CostCenterSummaryOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cost-centers/{cost_center_id}/summary',
            path: {
                'cost_center_id': costCenterId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api List Cost Lines
     * @returns PaginatedResponse_CostLineOut_ Successful Response
     * @throws ApiError
     */
    public static apiListCostLinesAdminCostCentersCostCenterIdLinesGet({
        costCenterId,
        page = 1,
        pageSize = 20,
    }: {
        costCenterId: string,
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_CostLineOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cost-centers/{cost_center_id}/lines',
            path: {
                'cost_center_id': costCenterId,
            },
            query: {
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Create Cost Line
     * @returns CostLineOut Successful Response
     * @throws ApiError
     */
    public static apiCreateCostLineAdminCostCentersCostCenterIdLinesPost({
        costCenterId,
        requestBody,
    }: {
        costCenterId: string,
        requestBody: CostLineCreate,
    }): CancelablePromise<CostLineOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/cost-centers/{cost_center_id}/lines',
            path: {
                'cost_center_id': costCenterId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Get Cost Line
     * @returns CostLineOut Successful Response
     * @throws ApiError
     */
    public static apiGetCostLineAdminCostLinesLineIdGet({
        lineId,
    }: {
        lineId: string,
    }): CancelablePromise<CostLineOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cost-lines/{line_id}',
            path: {
                'line_id': lineId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Update Cost Line
     * @returns CostLineOut Successful Response
     * @throws ApiError
     */
    public static apiUpdateCostLineAdminCostLinesLineIdPatch({
        lineId,
        requestBody,
    }: {
        lineId: string,
        requestBody: CostLineUpdate,
    }): CancelablePromise<CostLineOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/cost-lines/{line_id}',
            path: {
                'line_id': lineId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Delete Cost Line
     * @returns CostLineOut Successful Response
     * @throws ApiError
     */
    public static apiDeleteCostLineAdminCostLinesLineIdDelete({
        lineId,
    }: {
        lineId: string,
    }): CancelablePromise<CostLineOut> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/cost-lines/{line_id}',
            path: {
                'line_id': lineId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api List Cost Allocations
     * @returns PaginatedResponse_CostAllocationOut_ Successful Response
     * @throws ApiError
     */
    public static apiListCostAllocationsAdminCostCentersCostCenterIdAllocationsGet({
        costCenterId,
        page = 1,
        pageSize = 20,
    }: {
        costCenterId: string,
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_CostAllocationOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cost-centers/{cost_center_id}/allocations',
            path: {
                'cost_center_id': costCenterId,
            },
            query: {
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Create Cost Allocation
     * @returns CostAllocationOut Successful Response
     * @throws ApiError
     */
    public static apiCreateCostAllocationAdminCostCentersCostCenterIdAllocationsPost({
        costCenterId,
        requestBody,
    }: {
        costCenterId: string,
        requestBody: CostAllocationCreate,
    }): CancelablePromise<CostAllocationOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/cost-centers/{cost_center_id}/allocations',
            path: {
                'cost_center_id': costCenterId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Update Cost Allocation
     * @returns CostAllocationOut Successful Response
     * @throws ApiError
     */
    public static apiUpdateCostAllocationAdminCostAllocationsAllocationIdPatch({
        allocationId,
        requestBody,
    }: {
        allocationId: string,
        requestBody: CostAllocationUpdate,
    }): CancelablePromise<CostAllocationOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/cost-allocations/{allocation_id}',
            path: {
                'allocation_id': allocationId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Delete Cost Allocation
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiDeleteCostAllocationAdminCostAllocationsAllocationIdDelete({
        allocationId,
    }: {
        allocationId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/cost-allocations/{allocation_id}',
            path: {
                'allocation_id': allocationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Compute Cost Center
     * @returns ComputeCostCenterResponse Successful Response
     * @throws ApiError
     */
    public static apiComputeCostCenterAdminCostCentersCostCenterIdComputePost({
        costCenterId,
    }: {
        costCenterId: string,
    }): CancelablePromise<ComputeCostCenterResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/cost-centers/{cost_center_id}/compute',
            path: {
                'cost_center_id': costCenterId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Cost Center Product Costs
     * @returns ProductCostSnapshotOut Successful Response
     * @throws ApiError
     */
    public static apiCostCenterProductCostsAdminCostCentersCostCenterIdProductCostsGet({
        costCenterId,
    }: {
        costCenterId: string,
    }): CancelablePromise<Array<ProductCostSnapshotOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cost-centers/{cost_center_id}/product-costs',
            path: {
                'cost_center_id': costCenterId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api List Cost Categories
     * @returns CostCategoryOut Successful Response
     * @throws ApiError
     */
    public static apiListCostCategoriesAdminCostCategoriesGet(): CancelablePromise<Array<CostCategoryOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cost-categories',
        });
    }
    /**
     * Api Create Cost Category
     * @returns CostCategoryOut Successful Response
     * @throws ApiError
     */
    public static apiCreateCostCategoryAdminCostCategoriesPost({
        requestBody,
    }: {
        requestBody: CostCategoryCreate,
    }): CancelablePromise<CostCategoryOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/cost-categories',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Update Cost Category
     * @returns CostCategoryOut Successful Response
     * @throws ApiError
     */
    public static apiUpdateCostCategoryAdminCostCategoriesCategoryIdPatch({
        categoryId,
        requestBody,
    }: {
        categoryId: string,
        requestBody: CostCategoryUpdate,
    }): CancelablePromise<CostCategoryOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/cost-categories/{category_id}',
            path: {
                'category_id': categoryId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Delete Cost Category
     * @returns CostCategoryOut Successful Response
     * @throws ApiError
     */
    public static apiDeleteCostCategoryAdminCostCategoriesCategoryIdDelete({
        categoryId,
    }: {
        categoryId: string,
    }): CancelablePromise<CostCategoryOut> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/cost-categories/{category_id}',
            path: {
                'category_id': categoryId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
