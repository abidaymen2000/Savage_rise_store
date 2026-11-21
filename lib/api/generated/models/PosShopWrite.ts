/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PosShopWrite = {
    name: string;
    code: string;
    address?: string;
    /**
     * Ville de préparation web, correspondance exacte normalisée avec la livraison
     */
    city?: string;
    phone?: string;
    timezone?: string;
    currency?: 'TND' | 'EUR' | 'USD' | 'GBP' | 'JPY' | 'KWD' | 'BHD' | 'CHF' | 'CAD' | 'MAD' | 'DZD';
    location_id?: (string | null);
    status?: 'active' | 'archived';
    promotions?: boolean;
    receipt_footer?: string;
};

