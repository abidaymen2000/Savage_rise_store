/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderNotificationConfiguration } from './OrderNotificationConfiguration';
export type CompanyPublic = {
    order_notification_email?: (string | null);
    order_notification_configuration?: (OrderNotificationConfiguration | null);
    id: string;
    name: string;
    slug: string;
    database_name: string;
    domain?: (string | null);
    status: 'active' | 'suspended' | 'archived';
    erp_modules?: Array<string>;
    enabled_permissions?: Array<string>;
    created_at?: (string | null);
    updated_at?: (string | null);
};

