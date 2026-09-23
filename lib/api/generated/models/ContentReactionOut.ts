/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContentReactionType } from './ContentReactionType';
import type { EngagementTargetType } from './EngagementTargetType';
export type ContentReactionOut = {
    target_type?: EngagementTargetType;
    target_id: string;
    reaction?: ContentReactionType;
    active: boolean;
    count: number;
};

