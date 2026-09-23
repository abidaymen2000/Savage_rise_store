/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BudgetCreate } from '../models/BudgetCreate';
import type { BudgetLineCreate } from '../models/BudgetLineCreate';
import type { BudgetLineOut } from '../models/BudgetLineOut';
import type { BudgetLineUpdate } from '../models/BudgetLineUpdate';
import type { BudgetOut } from '../models/BudgetOut';
import type { BudgetUpdate } from '../models/BudgetUpdate';
import type { CodSettlementCreate } from '../models/CodSettlementCreate';
import type { CodSettlementOut } from '../models/CodSettlementOut';
import type { ExpenseCreate } from '../models/ExpenseCreate';
import type { ExpenseOut } from '../models/ExpenseOut';
import type { ExpenseRejectIn } from '../models/ExpenseRejectIn';
import type { ExpenseUpdate } from '../models/ExpenseUpdate';
import type { FinanceSettingsOut } from '../models/FinanceSettingsOut';
import type { FinanceSettingsUpdate } from '../models/FinanceSettingsUpdate';
import type { FinancialAccountCreate } from '../models/FinancialAccountCreate';
import type { FinancialAccountOut } from '../models/FinancialAccountOut';
import type { FinancialAccountUpdate } from '../models/FinancialAccountUpdate';
import type { FinancialTransactionOut } from '../models/FinancialTransactionOut';
import type { FinancialTransferCreate } from '../models/FinancialTransferCreate';
import type { FinancialTransferOut } from '../models/FinancialTransferOut';
import type { ForecastCreate } from '../models/ForecastCreate';
import type { ForecastLineCreate } from '../models/ForecastLineCreate';
import type { ForecastLineOut } from '../models/ForecastLineOut';
import type { ForecastLineUpdate } from '../models/ForecastLineUpdate';
import type { ForecastOut } from '../models/ForecastOut';
import type { ForecastUpdate } from '../models/ForecastUpdate';
import type { PaginatedResponse_BudgetLineOut_ } from '../models/PaginatedResponse_BudgetLineOut_';
import type { PaginatedResponse_BudgetOut_ } from '../models/PaginatedResponse_BudgetOut_';
import type { PaginatedResponse_ExpenseOut_ } from '../models/PaginatedResponse_ExpenseOut_';
import type { PaginatedResponse_FinancialAccountOut_ } from '../models/PaginatedResponse_FinancialAccountOut_';
import type { PaginatedResponse_FinancialTransactionOut_ } from '../models/PaginatedResponse_FinancialTransactionOut_';
import type { PaginatedResponse_FinancialTransferOut_ } from '../models/PaginatedResponse_FinancialTransferOut_';
import type { PaginatedResponse_ForecastLineOut_ } from '../models/PaginatedResponse_ForecastLineOut_';
import type { PaginatedResponse_ForecastOut_ } from '../models/PaginatedResponse_ForecastOut_';
import type { PaginatedResponse_PaymentOut_ } from '../models/PaginatedResponse_PaymentOut_';
import type { PaginatedResponse_VendorBillOut_ } from '../models/PaginatedResponse_VendorBillOut_';
import type { PaymentCreate } from '../models/PaymentCreate';
import type { PaymentOut } from '../models/PaymentOut';
import type { SalesFinanceEventCreate } from '../models/SalesFinanceEventCreate';
import type { VendorBillCreate } from '../models/VendorBillCreate';
import type { VendorBillOut } from '../models/VendorBillOut';
import type { VendorBillUpdate } from '../models/VendorBillUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminFinanceService {
    /**
     * Api Get Finance Settings
     * @returns FinanceSettingsOut Successful Response
     * @throws ApiError
     */
    public static apiGetFinanceSettingsAdminFinanceSettingsGet(): CancelablePromise<FinanceSettingsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/finance/settings',
        });
    }
    /**
     * Api Update Finance Settings
     * @returns FinanceSettingsOut Successful Response
     * @throws ApiError
     */
    public static apiUpdateFinanceSettingsAdminFinanceSettingsPut({
        requestBody,
    }: {
        requestBody: FinanceSettingsUpdate,
    }): CancelablePromise<FinanceSettingsOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/finance/settings',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api List Financial Accounts
     * @returns PaginatedResponse_FinancialAccountOut_ Successful Response
     * @throws ApiError
     */
    public static apiListFinancialAccountsAdminFinanceAccountsGet({
        page = 1,
        pageSize = 20,
    }: {
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_FinancialAccountOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/finance/accounts',
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
     * Api Create Financial Account
     * @returns FinancialAccountOut Successful Response
     * @throws ApiError
     */
    public static apiCreateFinancialAccountAdminFinanceAccountsPost({
        requestBody,
    }: {
        requestBody: FinancialAccountCreate,
    }): CancelablePromise<FinancialAccountOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/finance/accounts',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Get Financial Account
     * @returns FinancialAccountOut Successful Response
     * @throws ApiError
     */
    public static apiGetFinancialAccountAdminFinanceAccountsAccountIdGet({
        accountId,
    }: {
        accountId: string,
    }): CancelablePromise<FinancialAccountOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/finance/accounts/{account_id}',
            path: {
                'account_id': accountId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Update Financial Account
     * @returns FinancialAccountOut Successful Response
     * @throws ApiError
     */
    public static apiUpdateFinancialAccountAdminFinanceAccountsAccountIdPatch({
        accountId,
        requestBody,
    }: {
        accountId: string,
        requestBody: FinancialAccountUpdate,
    }): CancelablePromise<FinancialAccountOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/finance/accounts/{account_id}',
            path: {
                'account_id': accountId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Archive Financial Account
     * @returns FinancialAccountOut Successful Response
     * @throws ApiError
     */
    public static apiArchiveFinancialAccountAdminFinanceAccountsAccountIdDelete({
        accountId,
    }: {
        accountId: string,
    }): CancelablePromise<FinancialAccountOut> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/finance/accounts/{account_id}',
            path: {
                'account_id': accountId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api List Financial Transactions
     * @returns PaginatedResponse_FinancialTransactionOut_ Successful Response
     * @throws ApiError
     */
    public static apiListFinancialTransactionsAdminFinanceTransactionsGet({
        financialAccountId,
        page = 1,
        pageSize = 20,
    }: {
        financialAccountId?: (string | null),
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_FinancialTransactionOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/finance/transactions',
            query: {
                'financial_account_id': financialAccountId,
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Get Financial Transaction
     * @returns FinancialTransactionOut Successful Response
     * @throws ApiError
     */
    public static apiGetFinancialTransactionAdminFinanceTransactionsTransactionIdGet({
        transactionId,
    }: {
        transactionId: string,
    }): CancelablePromise<FinancialTransactionOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/finance/transactions/{transaction_id}',
            path: {
                'transaction_id': transactionId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Get Finance Dashboard
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiGetFinanceDashboardAdminFinanceDashboardGet({
        dateFrom,
        dateTo,
        currency,
    }: {
        dateFrom?: (string | null),
        dateTo?: (string | null),
        currency?: (string | null),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/finance/dashboard',
            query: {
                'date_from': dateFrom,
                'date_to': dateTo,
                'currency': currency,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api List Budgets
     * @returns PaginatedResponse_BudgetOut_ Successful Response
     * @throws ApiError
     */
    public static apiListBudgetsAdminFinanceBudgetsGet({
        status,
        page = 1,
        pageSize = 20,
    }: {
        status?: (string | null),
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_BudgetOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/finance/budgets',
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
     * Api Create Budget
     * @returns BudgetOut Successful Response
     * @throws ApiError
     */
    public static apiCreateBudgetAdminFinanceBudgetsPost({
        requestBody,
    }: {
        requestBody: BudgetCreate,
    }): CancelablePromise<BudgetOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/finance/budgets',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Get Budget
     * @returns BudgetOut Successful Response
     * @throws ApiError
     */
    public static apiGetBudgetAdminFinanceBudgetsBudgetIdGet({
        budgetId,
    }: {
        budgetId: string,
    }): CancelablePromise<BudgetOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/finance/budgets/{budget_id}',
            path: {
                'budget_id': budgetId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Update Budget
     * @returns BudgetOut Successful Response
     * @throws ApiError
     */
    public static apiUpdateBudgetAdminFinanceBudgetsBudgetIdPatch({
        budgetId,
        requestBody,
    }: {
        budgetId: string,
        requestBody: BudgetUpdate,
    }): CancelablePromise<BudgetOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/finance/budgets/{budget_id}',
            path: {
                'budget_id': budgetId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Approve Budget
     * @returns BudgetOut Successful Response
     * @throws ApiError
     */
    public static apiApproveBudgetAdminFinanceBudgetsBudgetIdApprovePost({
        budgetId,
    }: {
        budgetId: string,
    }): CancelablePromise<BudgetOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/finance/budgets/{budget_id}/approve',
            path: {
                'budget_id': budgetId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Lock Budget
     * @returns BudgetOut Successful Response
     * @throws ApiError
     */
    public static apiLockBudgetAdminFinanceBudgetsBudgetIdLockPost({
        budgetId,
    }: {
        budgetId: string,
    }): CancelablePromise<BudgetOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/finance/budgets/{budget_id}/lock',
            path: {
                'budget_id': budgetId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Archive Budget
     * @returns BudgetOut Successful Response
     * @throws ApiError
     */
    public static apiArchiveBudgetAdminFinanceBudgetsBudgetIdArchivePost({
        budgetId,
    }: {
        budgetId: string,
    }): CancelablePromise<BudgetOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/finance/budgets/{budget_id}/archive',
            path: {
                'budget_id': budgetId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Clone Budget
     * @returns BudgetOut Successful Response
     * @throws ApiError
     */
    public static apiCloneBudgetAdminFinanceBudgetsBudgetIdClonePost({
        budgetId,
    }: {
        budgetId: string,
    }): CancelablePromise<BudgetOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/finance/budgets/{budget_id}/clone',
            path: {
                'budget_id': budgetId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api List Budget Lines
     * @returns PaginatedResponse_BudgetLineOut_ Successful Response
     * @throws ApiError
     */
    public static apiListBudgetLinesAdminFinanceBudgetsBudgetIdLinesGet({
        budgetId,
        page = 1,
        pageSize = 20,
    }: {
        budgetId: string,
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_BudgetLineOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/finance/budgets/{budget_id}/lines',
            path: {
                'budget_id': budgetId,
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
     * Api Create Budget Line
     * @returns BudgetLineOut Successful Response
     * @throws ApiError
     */
    public static apiCreateBudgetLineAdminFinanceBudgetsBudgetIdLinesPost({
        budgetId,
        requestBody,
    }: {
        budgetId: string,
        requestBody: BudgetLineCreate,
    }): CancelablePromise<BudgetLineOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/finance/budgets/{budget_id}/lines',
            path: {
                'budget_id': budgetId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Update Budget Line
     * @returns BudgetLineOut Successful Response
     * @throws ApiError
     */
    public static apiUpdateBudgetLineAdminFinanceBudgetsBudgetIdLinesLineIdPatch({
        budgetId,
        lineId,
        requestBody,
    }: {
        budgetId: string,
        lineId: string,
        requestBody: BudgetLineUpdate,
    }): CancelablePromise<BudgetLineOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/finance/budgets/{budget_id}/lines/{line_id}',
            path: {
                'budget_id': budgetId,
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
     * Api Delete Budget Line
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiDeleteBudgetLineAdminFinanceBudgetsBudgetIdLinesLineIdDelete({
        budgetId,
        lineId,
    }: {
        budgetId: string,
        lineId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/finance/budgets/{budget_id}/lines/{line_id}',
            path: {
                'budget_id': budgetId,
                'line_id': lineId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api List Forecasts
     * @returns PaginatedResponse_ForecastOut_ Successful Response
     * @throws ApiError
     */
    public static apiListForecastsAdminFinanceForecastsGet({
        status,
        page = 1,
        pageSize = 20,
    }: {
        status?: (string | null),
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_ForecastOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/finance/forecasts',
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
     * Api Create Forecast
     * @returns ForecastOut Successful Response
     * @throws ApiError
     */
    public static apiCreateForecastAdminFinanceForecastsPost({
        requestBody,
    }: {
        requestBody: ForecastCreate,
    }): CancelablePromise<ForecastOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/finance/forecasts',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Run Rate Suggestion
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiRunRateSuggestionAdminFinanceForecastsSuggestionsRunRateGet({
        metric,
        dateFrom,
        dateTo,
        targetDateTo,
    }: {
        metric: string,
        dateFrom: string,
        dateTo: string,
        targetDateTo: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/finance/forecasts/suggestions/run-rate',
            query: {
                'metric': metric,
                'date_from': dateFrom,
                'date_to': dateTo,
                'target_date_to': targetDateTo,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Get Forecast
     * @returns ForecastOut Successful Response
     * @throws ApiError
     */
    public static apiGetForecastAdminFinanceForecastsForecastIdGet({
        forecastId,
    }: {
        forecastId: string,
    }): CancelablePromise<ForecastOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/finance/forecasts/{forecast_id}',
            path: {
                'forecast_id': forecastId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Update Forecast
     * @returns ForecastOut Successful Response
     * @throws ApiError
     */
    public static apiUpdateForecastAdminFinanceForecastsForecastIdPatch({
        forecastId,
        requestBody,
    }: {
        forecastId: string,
        requestBody: ForecastUpdate,
    }): CancelablePromise<ForecastOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/finance/forecasts/{forecast_id}',
            path: {
                'forecast_id': forecastId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Publish Forecast
     * @returns ForecastOut Successful Response
     * @throws ApiError
     */
    public static apiPublishForecastAdminFinanceForecastsForecastIdPublishPost({
        forecastId,
    }: {
        forecastId: string,
    }): CancelablePromise<ForecastOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/finance/forecasts/{forecast_id}/publish',
            path: {
                'forecast_id': forecastId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Archive Forecast
     * @returns ForecastOut Successful Response
     * @throws ApiError
     */
    public static apiArchiveForecastAdminFinanceForecastsForecastIdArchivePost({
        forecastId,
    }: {
        forecastId: string,
    }): CancelablePromise<ForecastOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/finance/forecasts/{forecast_id}/archive',
            path: {
                'forecast_id': forecastId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api List Forecast Lines
     * @returns PaginatedResponse_ForecastLineOut_ Successful Response
     * @throws ApiError
     */
    public static apiListForecastLinesAdminFinanceForecastsForecastIdLinesGet({
        forecastId,
        page = 1,
        pageSize = 20,
    }: {
        forecastId: string,
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_ForecastLineOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/finance/forecasts/{forecast_id}/lines',
            path: {
                'forecast_id': forecastId,
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
     * Api Create Forecast Line
     * @returns ForecastLineOut Successful Response
     * @throws ApiError
     */
    public static apiCreateForecastLineAdminFinanceForecastsForecastIdLinesPost({
        forecastId,
        requestBody,
    }: {
        forecastId: string,
        requestBody: ForecastLineCreate,
    }): CancelablePromise<ForecastLineOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/finance/forecasts/{forecast_id}/lines',
            path: {
                'forecast_id': forecastId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Update Forecast Line
     * @returns ForecastLineOut Successful Response
     * @throws ApiError
     */
    public static apiUpdateForecastLineAdminFinanceForecastsForecastIdLinesLineIdPatch({
        forecastId,
        lineId,
        requestBody,
    }: {
        forecastId: string,
        lineId: string,
        requestBody: ForecastLineUpdate,
    }): CancelablePromise<ForecastLineOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/finance/forecasts/{forecast_id}/lines/{line_id}',
            path: {
                'forecast_id': forecastId,
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
     * Api Delete Forecast Line
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiDeleteForecastLineAdminFinanceForecastsForecastIdLinesLineIdDelete({
        forecastId,
        lineId,
    }: {
        forecastId: string,
        lineId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/finance/forecasts/{forecast_id}/lines/{line_id}',
            path: {
                'forecast_id': forecastId,
                'line_id': lineId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api List Vendor Bills
     * @returns PaginatedResponse_VendorBillOut_ Successful Response
     * @throws ApiError
     */
    public static apiListVendorBillsAdminFinanceVendorBillsGet({
        status,
        paymentStatus,
        page = 1,
        pageSize = 20,
    }: {
        status?: (string | null),
        paymentStatus?: (string | null),
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_VendorBillOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/finance/vendor-bills',
            query: {
                'status': status,
                'payment_status': paymentStatus,
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Create Vendor Bill
     * @returns VendorBillOut Successful Response
     * @throws ApiError
     */
    public static apiCreateVendorBillAdminFinanceVendorBillsPost({
        requestBody,
    }: {
        requestBody: VendorBillCreate,
    }): CancelablePromise<VendorBillOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/finance/vendor-bills',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Get Vendor Bill
     * @returns VendorBillOut Successful Response
     * @throws ApiError
     */
    public static apiGetVendorBillAdminFinanceVendorBillsBillIdGet({
        billId,
    }: {
        billId: string,
    }): CancelablePromise<VendorBillOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/finance/vendor-bills/{bill_id}',
            path: {
                'bill_id': billId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Update Vendor Bill
     * @returns VendorBillOut Successful Response
     * @throws ApiError
     */
    public static apiUpdateVendorBillAdminFinanceVendorBillsBillIdPatch({
        billId,
        requestBody,
    }: {
        billId: string,
        requestBody: VendorBillUpdate,
    }): CancelablePromise<VendorBillOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/finance/vendor-bills/{bill_id}',
            path: {
                'bill_id': billId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Post Vendor Bill
     * @returns VendorBillOut Successful Response
     * @throws ApiError
     */
    public static apiPostVendorBillAdminFinanceVendorBillsBillIdPostPost({
        billId,
    }: {
        billId: string,
    }): CancelablePromise<VendorBillOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/finance/vendor-bills/{bill_id}/post',
            path: {
                'bill_id': billId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Cancel Vendor Bill
     * @returns VendorBillOut Successful Response
     * @throws ApiError
     */
    public static apiCancelVendorBillAdminFinanceVendorBillsBillIdCancelPost({
        billId,
    }: {
        billId: string,
    }): CancelablePromise<VendorBillOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/finance/vendor-bills/{bill_id}/cancel',
            path: {
                'bill_id': billId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api List Payments
     * @returns PaginatedResponse_PaymentOut_ Successful Response
     * @throws ApiError
     */
    public static apiListPaymentsAdminFinancePaymentsGet({
        page = 1,
        pageSize = 20,
    }: {
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_PaymentOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/finance/payments',
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
     * Api Create Payment
     * @returns PaymentOut Successful Response
     * @throws ApiError
     */
    public static apiCreatePaymentAdminFinancePaymentsPost({
        requestBody,
        idempotencyKey,
    }: {
        requestBody: PaymentCreate,
        idempotencyKey?: (string | null),
    }): CancelablePromise<PaymentOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/finance/payments',
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
     * Api Get Payment
     * @returns PaymentOut Successful Response
     * @throws ApiError
     */
    public static apiGetPaymentAdminFinancePaymentsPaymentIdGet({
        paymentId,
    }: {
        paymentId: string,
    }): CancelablePromise<PaymentOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/finance/payments/{payment_id}',
            path: {
                'payment_id': paymentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Reverse Payment
     * @returns PaymentOut Successful Response
     * @throws ApiError
     */
    public static apiReversePaymentAdminFinancePaymentsPaymentIdReversePost({
        paymentId,
    }: {
        paymentId: string,
    }): CancelablePromise<PaymentOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/finance/payments/{payment_id}/reverse',
            path: {
                'payment_id': paymentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Process Sales Finance Event
     * @returns PaymentOut Successful Response
     * @throws ApiError
     */
    public static apiProcessSalesFinanceEventAdminFinanceSalesEventsPost({
        requestBody,
    }: {
        requestBody: SalesFinanceEventCreate,
    }): CancelablePromise<PaymentOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/finance/sales-events',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Finance Outbox Status
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiFinanceOutboxStatusAdminFinanceOutboxStatusGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/finance/outbox/status',
        });
    }
    /**
     * Api Retry Finance Outbox Event
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiRetryFinanceOutboxEventAdminFinanceOutboxEventIdRetryPost({
        eventId,
    }: {
        eventId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/finance/outbox/{event_id}/retry',
            path: {
                'event_id': eventId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api List Financial Transfers
     * @returns PaginatedResponse_FinancialTransferOut_ Successful Response
     * @throws ApiError
     */
    public static apiListFinancialTransfersAdminFinanceTransfersGet({
        page = 1,
        pageSize = 20,
    }: {
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_FinancialTransferOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/finance/transfers',
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
     * Api Create Financial Transfer
     * @returns FinancialTransferOut Successful Response
     * @throws ApiError
     */
    public static apiCreateFinancialTransferAdminFinanceTransfersPost({
        requestBody,
        idempotencyKey,
    }: {
        requestBody: FinancialTransferCreate,
        idempotencyKey?: (string | null),
    }): CancelablePromise<FinancialTransferOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/finance/transfers',
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
     * Api Get Financial Transfer
     * @returns FinancialTransferOut Successful Response
     * @throws ApiError
     */
    public static apiGetFinancialTransferAdminFinanceTransfersTransferIdGet({
        transferId,
    }: {
        transferId: string,
    }): CancelablePromise<FinancialTransferOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/finance/transfers/{transfer_id}',
            path: {
                'transfer_id': transferId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Reverse Financial Transfer
     * @returns FinancialTransferOut Successful Response
     * @throws ApiError
     */
    public static apiReverseFinancialTransferAdminFinanceTransfersTransferIdReversePost({
        transferId,
    }: {
        transferId: string,
    }): CancelablePromise<FinancialTransferOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/finance/transfers/{transfer_id}/reverse',
            path: {
                'transfer_id': transferId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Create Cod Settlement
     * @returns CodSettlementOut Successful Response
     * @throws ApiError
     */
    public static apiCreateCodSettlementAdminFinanceCodSettlementsPost({
        requestBody,
        idempotencyKey,
    }: {
        requestBody: CodSettlementCreate,
        idempotencyKey?: (string | null),
    }): CancelablePromise<CodSettlementOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/finance/cod-settlements',
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
     * Api Sales Report
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiSalesReportAdminFinanceReportsSalesGet({
        dateFrom,
        dateTo,
        paymentMethod,
        paymentStatus,
        currency,
    }: {
        dateFrom?: (string | null),
        dateTo?: (string | null),
        paymentMethod?: (string | null),
        paymentStatus?: (string | null),
        currency?: (string | null),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/finance/reports/sales',
            query: {
                'date_from': dateFrom,
                'date_to': dateTo,
                'payment_method': paymentMethod,
                'payment_status': paymentStatus,
                'currency': currency,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Cash Flow Report
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiCashFlowReportAdminFinanceReportsCashFlowGet({
        dateFrom,
        dateTo,
        currency,
    }: {
        dateFrom?: (string | null),
        dateTo?: (string | null),
        currency?: (string | null),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/finance/reports/cash-flow',
            query: {
                'date_from': dateFrom,
                'date_to': dateTo,
                'currency': currency,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Margin Report
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiMarginReportAdminFinanceReportsMarginsGet({
        dateFrom,
        dateTo,
        productId,
        variantId,
        orderSource,
    }: {
        dateFrom?: (string | null),
        dateTo?: (string | null),
        productId?: (string | null),
        variantId?: (string | null),
        orderSource?: (string | null),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/finance/reports/margins',
            query: {
                'date_from': dateFrom,
                'date_to': dateTo,
                'product_id': productId,
                'variant_id': variantId,
                'order_source': orderSource,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Budget Vs Actual Report
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiBudgetVsActualReportAdminFinanceReportsBudgetVsActualGet({
        budgetId,
        dateFrom,
        dateTo,
        metric,
        costCenterId,
        costCategoryId,
        productId,
        variantId,
        categoryId,
    }: {
        budgetId: string,
        dateFrom?: (string | null),
        dateTo?: (string | null),
        metric?: (string | null),
        costCenterId?: (string | null),
        costCategoryId?: (string | null),
        productId?: (string | null),
        variantId?: (string | null),
        categoryId?: (string | null),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/finance/reports/budget-vs-actual',
            query: {
                'budget_id': budgetId,
                'date_from': dateFrom,
                'date_to': dateTo,
                'metric': metric,
                'cost_center_id': costCenterId,
                'cost_category_id': costCategoryId,
                'product_id': productId,
                'variant_id': variantId,
                'category_id': categoryId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Forecast Vs Budget Report
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiForecastVsBudgetReportAdminFinanceReportsForecastVsBudgetGet({
        forecastId,
        budgetId,
        dateFrom,
        dateTo,
        metric,
    }: {
        forecastId: string,
        budgetId: string,
        dateFrom?: (string | null),
        dateTo?: (string | null),
        metric?: (string | null),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/finance/reports/forecast-vs-budget',
            query: {
                'forecast_id': forecastId,
                'budget_id': budgetId,
                'date_from': dateFrom,
                'date_to': dateTo,
                'metric': metric,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Forecast Vs Actual Report
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiForecastVsActualReportAdminFinanceReportsForecastVsActualGet({
        forecastId,
        dateFrom,
        dateTo,
        metric,
    }: {
        forecastId: string,
        dateFrom?: (string | null),
        dateTo?: (string | null),
        metric?: (string | null),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/finance/reports/forecast-vs-actual',
            query: {
                'forecast_id': forecastId,
                'date_from': dateFrom,
                'date_to': dateTo,
                'metric': metric,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Cash Forecast Report
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiCashForecastReportAdminFinanceReportsCashForecastGet({
        dateFrom,
        dateTo,
        forecastId,
    }: {
        dateFrom?: (string | null),
        dateTo?: (string | null),
        forecastId?: (string | null),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/finance/reports/cash-forecast',
            query: {
                'date_from': dateFrom,
                'date_to': dateTo,
                'forecast_id': forecastId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api List Expenses
     * @returns PaginatedResponse_ExpenseOut_ Successful Response
     * @throws ApiError
     */
    public static apiListExpensesAdminFinanceExpensesGet({
        status,
        page = 1,
        pageSize = 20,
    }: {
        status?: (string | null),
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_ExpenseOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/finance/expenses',
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
     * Api Create Expense
     * @returns ExpenseOut Successful Response
     * @throws ApiError
     */
    public static apiCreateExpenseAdminFinanceExpensesPost({
        requestBody,
        idempotencyKey,
    }: {
        requestBody: ExpenseCreate,
        idempotencyKey?: (string | null),
    }): CancelablePromise<ExpenseOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/finance/expenses',
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
     * Api Get Expense
     * @returns ExpenseOut Successful Response
     * @throws ApiError
     */
    public static apiGetExpenseAdminFinanceExpensesExpenseIdGet({
        expenseId,
    }: {
        expenseId: string,
    }): CancelablePromise<ExpenseOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/finance/expenses/{expense_id}',
            path: {
                'expense_id': expenseId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Update Expense
     * @returns ExpenseOut Successful Response
     * @throws ApiError
     */
    public static apiUpdateExpenseAdminFinanceExpensesExpenseIdPatch({
        expenseId,
        requestBody,
    }: {
        expenseId: string,
        requestBody: ExpenseUpdate,
    }): CancelablePromise<ExpenseOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/finance/expenses/{expense_id}',
            path: {
                'expense_id': expenseId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Submit Expense
     * @returns ExpenseOut Successful Response
     * @throws ApiError
     */
    public static apiSubmitExpenseAdminFinanceExpensesExpenseIdSubmitPost({
        expenseId,
    }: {
        expenseId: string,
    }): CancelablePromise<ExpenseOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/finance/expenses/{expense_id}/submit',
            path: {
                'expense_id': expenseId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Approve Expense
     * @returns ExpenseOut Successful Response
     * @throws ApiError
     */
    public static apiApproveExpenseAdminFinanceExpensesExpenseIdApprovePost({
        expenseId,
    }: {
        expenseId: string,
    }): CancelablePromise<ExpenseOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/finance/expenses/{expense_id}/approve',
            path: {
                'expense_id': expenseId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Reject Expense
     * @returns ExpenseOut Successful Response
     * @throws ApiError
     */
    public static apiRejectExpenseAdminFinanceExpensesExpenseIdRejectPost({
        expenseId,
        requestBody,
    }: {
        expenseId: string,
        requestBody: ExpenseRejectIn,
    }): CancelablePromise<ExpenseOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/finance/expenses/{expense_id}/reject',
            path: {
                'expense_id': expenseId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Cancel Expense
     * @returns ExpenseOut Successful Response
     * @throws ApiError
     */
    public static apiCancelExpenseAdminFinanceExpensesExpenseIdCancelPost({
        expenseId,
    }: {
        expenseId: string,
    }): CancelablePromise<ExpenseOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/finance/expenses/{expense_id}/cancel',
            path: {
                'expense_id': expenseId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
