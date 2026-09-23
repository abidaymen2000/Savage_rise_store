/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MediaPurpose } from './MediaPurpose';
export type MediaUploadAuthRequest = {
    purpose: MediaPurpose;
    file_name: string;
    mime_type: string;
    product_id?: (string | null);
    variant_id?: (string | null);
    category_id?: (string | null);
    category_slug?: (string | null);
    product_name?: (string | null);
    section?: (string | null);
};

