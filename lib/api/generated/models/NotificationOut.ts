/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NotificationDestination } from './NotificationDestination';
import type { NotificationOrderRef } from './NotificationOrderRef';
export type NotificationOut = {
    id: string;
    audience?: 'admin' | 'erp' | 'cms' | 'store';
    type?: (string | null);
    category: string;
    title: string;
    message: string;
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    source_module?: (string | null);
    action_url?: (string | null);
    metadata?: Record<string, any>;
    order?: (NotificationOrderRef | null);
    destination?: (NotificationDestination | null);
    recipient_admin_id?: (string | null);
    recipient_user_ids?: Array<string>;
    is_read?: boolean;
    created_at: string;
    read_at?: (string | null);
};

