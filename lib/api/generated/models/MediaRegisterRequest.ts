/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MediaPurpose } from './MediaPurpose';
export type MediaRegisterRequest = {
    purpose: MediaPurpose;
    fileId: string;
    filePath: string;
    url: string;
    thumbnailUrl?: (string | null);
    name?: (string | null);
    size?: (number | null);
    mimeType: string;
    width?: (number | null);
    height?: (number | null);
    duration?: (number | null);
    productId?: (string | null);
    variantId?: (string | null);
    categoryId?: (string | null);
    categorySlug?: (string | null);
    productName?: (string | null);
    section?: (string | null);
    setActive?: boolean;
    metadata?: Record<string, any>;
};

