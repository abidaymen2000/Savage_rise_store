/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class IvaService {
    /**
     * Create Conversation
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createConversationIvaV1ConversationsPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/iva/v1/conversations',
        });
    }
    /**
     * Conversations
     * @returns any Successful Response
     * @throws ApiError
     */
    public static conversationsIvaV1ConversationsGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/iva/v1/conversations',
        });
    }
    /**
     * Conversation
     * @returns any Successful Response
     * @throws ApiError
     */
    public static conversationIvaV1ConversationsConversationIdGet({
        conversationId,
    }: {
        conversationId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/iva/v1/conversations/{conversation_id}',
            path: {
                'conversation_id': conversationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Archive
     * @returns any Successful Response
     * @throws ApiError
     */
    public static archiveIvaV1ConversationsConversationIdArchivePost({
        conversationId,
    }: {
        conversationId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/iva/v1/conversations/{conversation_id}/archive',
            path: {
                'conversation_id': conversationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Message
     * @returns any Successful Response
     * @throws ApiError
     */
    public static messageIvaV1ConversationsConversationIdMessagesPost({
        conversationId,
    }: {
        conversationId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/iva/v1/conversations/{conversation_id}/messages',
            path: {
                'conversation_id': conversationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Run
     * @returns any Successful Response
     * @throws ApiError
     */
    public static runIvaV1RunsRunIdGet({
        runId,
    }: {
        runId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/iva/v1/runs/{run_id}',
            path: {
                'run_id': runId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Cancel
     * @returns any Successful Response
     * @throws ApiError
     */
    public static cancelIvaV1RunsRunIdCancelPost({
        runId,
    }: {
        runId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/iva/v1/runs/{run_id}/cancel',
            path: {
                'run_id': runId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Events
     * @returns any Successful Response
     * @throws ApiError
     */
    public static eventsIvaV1RunsRunIdEventsGet({
        runId,
    }: {
        runId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/iva/v1/runs/{run_id}/events',
            path: {
                'run_id': runId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Approval
     * @returns any Successful Response
     * @throws ApiError
     */
    public static approvalIvaV1ApprovalsApprovalIdGet({
        approvalId,
    }: {
        approvalId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/iva/v1/approvals/{approval_id}',
            path: {
                'approval_id': approvalId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Decide
     * @returns any Successful Response
     * @throws ApiError
     */
    public static decideIvaV1ApprovalsApprovalIdDecisionPost({
        approvalId,
    }: {
        approvalId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/iva/v1/approvals/{approval_id}/decision',
            path: {
                'approval_id': approvalId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Ingest
     * @returns any Successful Response
     * @throws ApiError
     */
    public static ingestIvaV1KnowledgeDocumentsPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/iva/v1/knowledge/documents',
        });
    }
    /**
     * Delete
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteIvaV1KnowledgeDocumentsDocumentIdDelete({
        documentId,
    }: {
        documentId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/iva/v1/knowledge/documents/{document_id}',
            path: {
                'document_id': documentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Article
     * @returns any Successful Response
     * @throws ApiError
     */
    public static articleIvaV1KnowledgeDocumentsDocumentIdGet({
        documentId,
    }: {
        documentId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/iva/v1/knowledge/documents/{document_id}',
            path: {
                'document_id': documentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Search
     * @returns any Successful Response
     * @throws ApiError
     */
    public static searchIvaV1KnowledgeSearchPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/iva/v1/knowledge/search',
        });
    }
    /**
     * Audit
     * @returns any Successful Response
     * @throws ApiError
     */
    public static auditIvaV1AuditGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/iva/v1/audit',
        });
    }
}
