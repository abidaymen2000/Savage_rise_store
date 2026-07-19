/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type NotificationOut = {
    id: string;
    audience?: 'admin' | 'erp' | 'cms' | 'store';
    category: string;
    title: string;
    message: string;
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    source_module?: (string | null);
    action_url?: (string | null);
    metadata?: Record<string, any>;
    recipient_admin_id?: (string | null);
    is_read?: boolean;
    created_at: string;
    read_at?: (string | null);
};

