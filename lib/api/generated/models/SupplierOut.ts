/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SupplierOut = {
    id: string;
    code: string;
    name: string;
    legal_name?: (string | null);
    email?: (string | null);
    phone?: (string | null);
    tax_id?: (string | null);
    tax_identifier?: (string | null);
    tax_profile_id?: (string | null);
    registration_number?: (string | null);
    address?: (string | null);
    city?: (string | null);
    region?: (string | null);
    postal_code?: (string | null);
    country_code?: (string | null);
    default_currency?: (string | null);
    default_payment_terms_days?: (number | null);
    notes?: (string | null);
    metadata?: Record<string, any>;
    status?: 'active' | 'inactive';
    is_archived?: boolean;
    created_by?: (string | null);
    updated_by?: (string | null);
    created_at: string;
    updated_at: string;
    version?: number;
};

