/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSCTAProps } from './CMSCTAProps';
export type CMSCountdownProps = {
    title: string;
    subtitle?: (string | null);
    target_at: string;
    timezone?: string;
    completed_title?: (string | null);
    completed_message?: (string | null);
    cta?: (CMSCTAProps | null);
    variant?: 'default' | 'compact' | 'banner';
    hide_when_completed?: boolean;
    notification_campaign_key?: (string | null);
};

