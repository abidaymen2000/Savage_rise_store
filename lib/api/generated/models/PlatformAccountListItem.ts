/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlatformAccountCompany } from './PlatformAccountCompany';
export type PlatformAccountListItem = {
    id: string;
    email: string;
    full_name?: (string | null);
    role: 'platform_admin' | 'company_admin' | 'employee';
    is_active: boolean;
    is_verified: boolean;
    invitation_delivery_status?: (string | null);
    invitation_expires_at?: (string | null);
    company: PlatformAccountCompany;
};

