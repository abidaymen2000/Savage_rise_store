/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ReviewOut = {
    /**
     * Note de 1 à 5
     */
    rating: number;
    title?: (string | null);
    comment: (string | null);
    id: string;
    user_id: string;
    product_id: string;
    status?: 'visible' | 'hidden';
    created_at: string;
    updated_at: string;
    author?: (string | null);
    product_name?: (string | null);
};

