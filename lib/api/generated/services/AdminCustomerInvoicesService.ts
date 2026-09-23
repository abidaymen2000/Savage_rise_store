/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AllocationCreate } from '../models/AllocationCreate';
import type { CreditNoteCreate } from '../models/CreditNoteCreate';
import type { DeliveryResolution } from '../models/DeliveryResolution';
import type { InvoiceConfigurationResponse } from '../models/InvoiceConfigurationResponse';
import type { InvoiceConfigurationUpdate } from '../models/InvoiceConfigurationUpdate';
import type { InvoiceCreate } from '../models/InvoiceCreate';
import type { InvoiceFromOrder } from '../models/InvoiceFromOrder';
import type { InvoiceOut } from '../models/InvoiceOut';
import type { InvoicePage } from '../models/InvoicePage';
import type { InvoicePaymentCreate } from '../models/InvoicePaymentCreate';
import type { InvoicePaymentResult } from '../models/InvoicePaymentResult';
import type { InvoiceUpdate } from '../models/InvoiceUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminCustomerInvoicesService {
    /**
     * Configuration
     * @returns InvoiceConfigurationResponse Successful Response
     * @throws ApiError
     */
    public static configurationAdminFinanceInvoicesConfigurationGet(): CancelablePromise<InvoiceConfigurationResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/finance/invoices/configuration',
        });
    }
    /**
     * Configure
     * @returns InvoiceConfigurationResponse Successful Response
     * @throws ApiError
     */
    public static configureAdminFinanceInvoicesConfigurationPut({
        requestBody,
    }: {
        requestBody: InvoiceConfigurationUpdate,
    }): CancelablePromise<InvoiceConfigurationResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/finance/invoices/configuration',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create
     * @returns InvoiceOut Successful Response
     * @throws ApiError
     */
    public static createAdminFinanceInvoicesPost({
        idempotencyKey,
        requestBody,
    }: {
        idempotencyKey: string,
        requestBody: InvoiceCreate,
    }): CancelablePromise<InvoiceOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/finance/invoices',
            headers: {
                'Idempotency-Key': idempotencyKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Documents
     * @returns InvoicePage Successful Response
     * @throws ApiError
     */
    public static listDocumentsAdminFinanceInvoicesGet({
        page = 1,
        pageSize = 25,
        sortBy = 'created_at',
        descending = true,
        q,
        documentType,
        documentStatus,
        paymentStatus,
        overdue,
        customerId,
        source,
        currency,
        orderId,
        createdBy,
        paymentMethod,
        issueDateFrom,
        issueDateTo,
        dueDateFrom,
        dueDateTo,
        totalAmountFrom,
        totalAmountTo,
    }: {
        page?: number,
        pageSize?: number,
        sortBy?: 'created_at' | 'issue_date' | 'due_date' | 'total_amount' | 'number' | 'amount_due',
        descending?: boolean,
        q?: (string | null),
        documentType?: ('invoice' | 'credit_note' | 'debit_note' | null),
        documentStatus?: ('draft' | 'posted' | 'cancelled' | null),
        paymentStatus?: ('unpaid' | 'partially_paid' | 'paid' | 'partially_refunded' | 'refunded' | null),
        overdue?: (boolean | null),
        customerId?: (string | null),
        source?: ('manual' | 'order' | 'credit' | null),
        currency?: (string | null),
        orderId?: (string | null),
        createdBy?: (string | null),
        paymentMethod?: (string | null),
        issueDateFrom?: (string | null),
        issueDateTo?: (string | null),
        dueDateFrom?: (string | null),
        dueDateTo?: (string | null),
        totalAmountFrom?: ((number | string) | null),
        totalAmountTo?: ((number | string) | null),
    }): CancelablePromise<InvoicePage> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/finance/invoices',
            query: {
                'page': page,
                'page_size': pageSize,
                'sort_by': sortBy,
                'descending': descending,
                'q': q,
                'document_type': documentType,
                'document_status': documentStatus,
                'payment_status': paymentStatus,
                'overdue': overdue,
                'customer_id': customerId,
                'source': source,
                'currency': currency,
                'order_id': orderId,
                'created_by': createdBy,
                'payment_method': paymentMethod,
                'issue_date_from': issueDateFrom,
                'issue_date_to': issueDateTo,
                'due_date_from': dueDateFrom,
                'due_date_to': dueDateTo,
                'total_amount_from': totalAmountFrom,
                'total_amount_to': totalAmountTo,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Dashboard
     * @returns any Successful Response
     * @throws ApiError
     */
    public static dashboardAdminFinanceInvoicesDashboardGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/finance/invoices/dashboard',
        });
    }
    /**
     * Get
     * @returns InvoiceOut Successful Response
     * @throws ApiError
     */
    public static getAdminFinanceInvoicesInvoiceIdGet({
        invoiceId,
    }: {
        invoiceId: string,
    }): CancelablePromise<InvoiceOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/finance/invoices/{invoice_id}',
            path: {
                'invoice_id': invoiceId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update
     * @returns InvoiceOut Successful Response
     * @throws ApiError
     */
    public static updateAdminFinanceInvoicesInvoiceIdPatch({
        invoiceId,
        requestBody,
    }: {
        invoiceId: string,
        requestBody: InvoiceUpdate,
    }): CancelablePromise<InvoiceOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/finance/invoices/{invoice_id}',
            path: {
                'invoice_id': invoiceId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Preview
     * @returns InvoiceOut Successful Response
     * @throws ApiError
     */
    public static previewAdminFinanceInvoicesInvoiceIdPreviewPost({
        invoiceId,
    }: {
        invoiceId: string,
    }): CancelablePromise<InvoiceOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/finance/invoices/{invoice_id}/preview',
            path: {
                'invoice_id': invoiceId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Post
     * @returns InvoiceOut Successful Response
     * @throws ApiError
     */
    public static postAdminFinanceInvoicesInvoiceIdPostPost({
        invoiceId,
        idempotencyKey,
    }: {
        invoiceId: string,
        idempotencyKey: string,
    }): CancelablePromise<InvoiceOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/finance/invoices/{invoice_id}/post',
            path: {
                'invoice_id': invoiceId,
            },
            headers: {
                'Idempotency-Key': idempotencyKey,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Cancel
     * @returns InvoiceOut Successful Response
     * @throws ApiError
     */
    public static cancelAdminFinanceInvoicesInvoiceIdCancelPost({
        invoiceId,
        idempotencyKey,
    }: {
        invoiceId: string,
        idempotencyKey: string,
    }): CancelablePromise<InvoiceOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/finance/invoices/{invoice_id}/cancel',
            path: {
                'invoice_id': invoiceId,
            },
            headers: {
                'Idempotency-Key': idempotencyKey,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Send
     * @returns InvoiceOut Successful Response
     * @throws ApiError
     */
    public static sendAdminFinanceInvoicesInvoiceIdSendPost({
        invoiceId,
        idempotencyKey,
    }: {
        invoiceId: string,
        idempotencyKey: string,
    }): CancelablePromise<InvoiceOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/finance/invoices/{invoice_id}/send',
            path: {
                'invoice_id': invoiceId,
            },
            headers: {
                'Idempotency-Key': idempotencyKey,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Payment
     * @returns InvoicePaymentResult Successful Response
     * @throws ApiError
     */
    public static paymentAdminFinanceInvoicesInvoiceIdPaymentsPost({
        invoiceId,
        idempotencyKey,
        requestBody,
    }: {
        invoiceId: string,
        idempotencyKey: string,
        requestBody: InvoicePaymentCreate,
    }): CancelablePromise<InvoicePaymentResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/finance/invoices/{invoice_id}/payments',
            path: {
                'invoice_id': invoiceId,
            },
            headers: {
                'Idempotency-Key': idempotencyKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Payments
     * @returns any Successful Response
     * @throws ApiError
     */
    public static paymentsAdminFinanceInvoicesInvoiceIdPaymentsGet({
        invoiceId,
    }: {
        invoiceId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/finance/invoices/{invoice_id}/payments',
            path: {
                'invoice_id': invoiceId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Resolve Delivery
     * @returns InvoiceOut Successful Response
     * @throws ApiError
     */
    public static resolveDeliveryAdminFinanceInvoicesInvoiceIdDeliveryResolutionPost({
        invoiceId,
        idempotencyKey,
        requestBody,
    }: {
        invoiceId: string,
        idempotencyKey: string,
        requestBody: DeliveryResolution,
    }): CancelablePromise<InvoiceOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/finance/invoices/{invoice_id}/delivery-resolution',
            path: {
                'invoice_id': invoiceId,
            },
            headers: {
                'Idempotency-Key': idempotencyKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Allocation
     * @returns InvoiceOut Successful Response
     * @throws ApiError
     */
    public static allocationAdminFinanceInvoicesInvoiceIdAllocationsPost({
        invoiceId,
        idempotencyKey,
        requestBody,
    }: {
        invoiceId: string,
        idempotencyKey: string,
        requestBody: AllocationCreate,
    }): CancelablePromise<InvoiceOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/finance/invoices/{invoice_id}/allocations',
            path: {
                'invoice_id': invoiceId,
            },
            headers: {
                'Idempotency-Key': idempotencyKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Refund
     * @returns InvoicePaymentResult Successful Response
     * @throws ApiError
     */
    public static refundAdminFinanceInvoicesInvoiceIdRefundsPost({
        invoiceId,
        idempotencyKey,
        requestBody,
    }: {
        invoiceId: string,
        idempotencyKey: string,
        requestBody: InvoicePaymentCreate,
    }): CancelablePromise<InvoicePaymentResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/finance/invoices/{invoice_id}/refunds',
            path: {
                'invoice_id': invoiceId,
            },
            headers: {
                'Idempotency-Key': idempotencyKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Credit
     * @returns InvoiceOut Successful Response
     * @throws ApiError
     */
    public static creditAdminFinanceInvoicesInvoiceIdCreditNotesPost({
        invoiceId,
        idempotencyKey,
        requestBody,
    }: {
        invoiceId: string,
        idempotencyKey: string,
        requestBody: CreditNoteCreate,
    }): CancelablePromise<InvoiceOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/finance/invoices/{invoice_id}/credit-notes',
            path: {
                'invoice_id': invoiceId,
            },
            headers: {
                'Idempotency-Key': idempotencyKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Document
     * @returns any Successful Response
     * @throws ApiError
     */
    public static documentAdminFinanceInvoicesInvoiceIdDocumentGet({
        invoiceId,
    }: {
        invoiceId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/finance/invoices/{invoice_id}/document',
            path: {
                'invoice_id': invoiceId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Audit
     * @returns any Successful Response
     * @throws ApiError
     */
    public static auditAdminFinanceInvoicesInvoiceIdAuditGet({
        invoiceId,
        page = 1,
        pageSize = 50,
    }: {
        invoiceId: string,
        page?: number,
        pageSize?: number,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/finance/invoices/{invoice_id}/audit',
            path: {
                'invoice_id': invoiceId,
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
     * From Order
     * @returns InvoiceOut Successful Response
     * @throws ApiError
     */
    public static fromOrderAdminOrdersOrderIdInvoicesPost({
        orderId,
        idempotencyKey,
        requestBody,
    }: {
        orderId: string,
        idempotencyKey: string,
        requestBody: InvoiceFromOrder,
    }): CancelablePromise<InvoiceOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/orders/{order_id}/invoices',
            path: {
                'order_id': orderId,
            },
            headers: {
                'Idempotency-Key': idempotencyKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Invoiceable
     * @returns any Successful Response
     * @throws ApiError
     */
    public static invoiceableAdminOrdersOrderIdInvoiceableGet({
        orderId,
    }: {
        orderId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/orders/{order_id}/invoiceable',
            path: {
                'order_id': orderId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
