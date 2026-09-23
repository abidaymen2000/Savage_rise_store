/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContentCommentStatus } from './ContentCommentStatus';
import type { EngagementTargetType } from './EngagementTargetType';
export type ContentCommentOut = {
    id: string;
    target_type?: EngagementTargetType;
    target_id: string;
    user_id: string;
    content: string;
    status?: ContentCommentStatus;
    author?: (string | null);
    target_title?: (string | null);
    locale?: (string | null);
    created_at: string;
    updated_at: string;
};

