/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GoodsReceiptCreate } from '../models/GoodsReceiptCreate';
import type { GoodsReceiptOut } from '../models/GoodsReceiptOut';
import type { LandedCostCreate } from '../models/LandedCostCreate';
import type { LandedCostOut } from '../models/LandedCostOut';
import type { LandedCostUpdate } from '../models/LandedCostUpdate';
import type { PaginatedResponse_GoodsReceiptOut_ } from '../models/PaginatedResponse_GoodsReceiptOut_';
import type { PaginatedResponse_LandedCostOut_ } from '../models/PaginatedResponse_LandedCostOut_';
import type { PaginatedResponse_PurchaseOrderOut_ } from '../models/PaginatedResponse_PurchaseOrderOut_';
import type { PurchaseOrderCreate } from '../models/PurchaseOrderCreate';
import type { PurchaseOrderOut } from '../models/PurchaseOrderOut';
import type { PurchaseOrderUpdate } from '../models/PurchaseOrderUpdate';
import type { VendorBillOut } from '../models/VendorBillOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminPurchasesService {
    /**
     * Api List Purchase Orders
     * @returns PaginatedResponse_PurchaseOrderOut_ Successful Response
     * @throws ApiError
     */
    public static apiListPurchaseOrdersAdminPurchasesOrdersGet({
        status,
        page = 1,
        pageSize = 20,
    }: {
        status?: (string | null),
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_PurchaseOrderOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/purchases/orders',
            query: {
                'status': status,
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Create Purchase Order
     * @returns PurchaseOrderOut Successful Response
     * @throws ApiError
     */
    public static apiCreatePurchaseOrderAdminPurchasesOrdersPost({
        requestBody,
    }: {
        requestBody: PurchaseOrderCreate,
    }): CancelablePromise<PurchaseOrderOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/purchases/orders',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Get Purchase Order
     * @returns PurchaseOrderOut Successful Response
     * @throws ApiError
     */
    public static apiGetPurchaseOrderAdminPurchasesOrdersPurchaseOrderIdGet({
        purchaseOrderId,
    }: {
        purchaseOrderId: string,
    }): CancelablePromise<PurchaseOrderOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/purchases/orders/{purchase_order_id}',
            path: {
                'purchase_order_id': purchaseOrderId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Update Purchase Order
     * @returns PurchaseOrderOut Successful Response
     * @throws ApiError
     */
    public static apiUpdatePurchaseOrderAdminPurchasesOrdersPurchaseOrderIdPatch({
        purchaseOrderId,
        requestBody,
    }: {
        purchaseOrderId: string,
        requestBody: PurchaseOrderUpdate,
    }): CancelablePromise<PurchaseOrderOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/purchases/orders/{purchase_order_id}',
            path: {
                'purchase_order_id': purchaseOrderId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Confirm Purchase Order
     * @returns PurchaseOrderOut Successful Response
     * @throws ApiError
     */
    public static apiConfirmPurchaseOrderAdminPurchasesOrdersPurchaseOrderIdConfirmPost({
        purchaseOrderId,
    }: {
        purchaseOrderId: string,
    }): CancelablePromise<PurchaseOrderOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/purchases/orders/{purchase_order_id}/confirm',
            path: {
                'purchase_order_id': purchaseOrderId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Cancel Purchase Order
     * @returns PurchaseOrderOut Successful Response
     * @throws ApiError
     */
    public static apiCancelPurchaseOrderAdminPurchasesOrdersPurchaseOrderIdCancelPost({
        purchaseOrderId,
    }: {
        purchaseOrderId: string,
    }): CancelablePromise<PurchaseOrderOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/purchases/orders/{purchase_order_id}/cancel',
            path: {
                'purchase_order_id': purchaseOrderId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Close Purchase Order
     * @returns PurchaseOrderOut Successful Response
     * @throws ApiError
     */
    public static apiClosePurchaseOrderAdminPurchasesOrdersPurchaseOrderIdClosePost({
        purchaseOrderId,
    }: {
        purchaseOrderId: string,
    }): CancelablePromise<PurchaseOrderOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/purchases/orders/{purchase_order_id}/close',
            path: {
                'purchase_order_id': purchaseOrderId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Create Vendor Bill From Purchase Order
     * @returns VendorBillOut Successful Response
     * @throws ApiError
     */
    public static apiCreateVendorBillFromPurchaseOrderAdminPurchasesOrdersPurchaseOrderIdCreateVendorBillPost({
        purchaseOrderId,
    }: {
        purchaseOrderId: string,
    }): CancelablePromise<VendorBillOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/purchases/orders/{purchase_order_id}/create-vendor-bill',
            path: {
                'purchase_order_id': purchaseOrderId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api List Goods Receipts
     * @returns PaginatedResponse_GoodsReceiptOut_ Successful Response
     * @throws ApiError
     */
    public static apiListGoodsReceiptsAdminPurchasesReceiptsGet({
        status,
        page = 1,
        pageSize = 20,
    }: {
        status?: (string | null),
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_GoodsReceiptOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/purchases/receipts',
            query: {
                'status': status,
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Create Goods Receipt
     * @returns GoodsReceiptOut Successful Response
     * @throws ApiError
     */
    public static apiCreateGoodsReceiptAdminPurchasesReceiptsPost({
        requestBody,
    }: {
        requestBody: GoodsReceiptCreate,
    }): CancelablePromise<GoodsReceiptOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/purchases/receipts',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Get Goods Receipt
     * @returns GoodsReceiptOut Successful Response
     * @throws ApiError
     */
    public static apiGetGoodsReceiptAdminPurchasesReceiptsReceiptIdGet({
        receiptId,
    }: {
        receiptId: string,
    }): CancelablePromise<GoodsReceiptOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/purchases/receipts/{receipt_id}',
            path: {
                'receipt_id': receiptId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Post Goods Receipt
     * @returns GoodsReceiptOut Successful Response
     * @throws ApiError
     */
    public static apiPostGoodsReceiptAdminPurchasesReceiptsReceiptIdPostPost({
        receiptId,
    }: {
        receiptId: string,
    }): CancelablePromise<GoodsReceiptOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/purchases/receipts/{receipt_id}/post',
            path: {
                'receipt_id': receiptId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Cancel Goods Receipt
     * @returns GoodsReceiptOut Successful Response
     * @throws ApiError
     */
    public static apiCancelGoodsReceiptAdminPurchasesReceiptsReceiptIdCancelPost({
        receiptId,
    }: {
        receiptId: string,
    }): CancelablePromise<GoodsReceiptOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/purchases/receipts/{receipt_id}/cancel',
            path: {
                'receipt_id': receiptId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api List Landed Costs
     * @returns PaginatedResponse_LandedCostOut_ Successful Response
     * @throws ApiError
     */
    public static apiListLandedCostsAdminPurchasesLandedCostsGet({
        status,
        page = 1,
        pageSize = 20,
    }: {
        status?: (string | null),
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_LandedCostOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/purchases/landed-costs',
            query: {
                'status': status,
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Create Landed Cost
     * @returns LandedCostOut Successful Response
     * @throws ApiError
     */
    public static apiCreateLandedCostAdminPurchasesLandedCostsPost({
        requestBody,
    }: {
        requestBody: LandedCostCreate,
    }): CancelablePromise<LandedCostOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/purchases/landed-costs',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Get Landed Cost
     * @returns LandedCostOut Successful Response
     * @throws ApiError
     */
    public static apiGetLandedCostAdminPurchasesLandedCostsLandedCostIdGet({
        landedCostId,
    }: {
        landedCostId: string,
    }): CancelablePromise<LandedCostOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/purchases/landed-costs/{landed_cost_id}',
            path: {
                'landed_cost_id': landedCostId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Update Landed Cost
     * @returns LandedCostOut Successful Response
     * @throws ApiError
     */
    public static apiUpdateLandedCostAdminPurchasesLandedCostsLandedCostIdPatch({
        landedCostId,
        requestBody,
    }: {
        landedCostId: string,
        requestBody: LandedCostUpdate,
    }): CancelablePromise<LandedCostOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/purchases/landed-costs/{landed_cost_id}',
            path: {
                'landed_cost_id': landedCostId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Compute Landed Cost
     * @returns LandedCostOut Successful Response
     * @throws ApiError
     */
    public static apiComputeLandedCostAdminPurchasesLandedCostsLandedCostIdComputePost({
        landedCostId,
    }: {
        landedCostId: string,
    }): CancelablePromise<LandedCostOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/purchases/landed-costs/{landed_cost_id}/compute',
            path: {
                'landed_cost_id': landedCostId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Apply Landed Cost
     * @returns LandedCostOut Successful Response
     * @throws ApiError
     */
    public static apiApplyLandedCostAdminPurchasesLandedCostsLandedCostIdApplyPost({
        landedCostId,
    }: {
        landedCostId: string,
    }): CancelablePromise<LandedCostOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/purchases/landed-costs/{landed_cost_id}/apply',
            path: {
                'landed_cost_id': landedCostId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Cancel Landed Cost
     * @returns LandedCostOut Successful Response
     * @throws ApiError
     */
    public static apiCancelLandedCostAdminPurchasesLandedCostsLandedCostIdCancelPost({
        landedCostId,
    }: {
        landedCostId: string,
    }): CancelablePromise<LandedCostOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/purchases/landed-costs/{landed_cost_id}/cancel',
            path: {
                'landed_cost_id': landedCostId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
