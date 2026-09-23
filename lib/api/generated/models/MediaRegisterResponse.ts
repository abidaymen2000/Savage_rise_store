/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MediaPurpose } from './MediaPurpose';
export type MediaRegisterResponse = {
    id?: (string | null);
    purpose: MediaPurpose;
    provider?: string;
    fileId: string;
    filePath: string;
    url: string;
    thumbnailUrl?: (string | null);
    name?: (string | null);
    size?: (number | null);
    mimeType?: (string | null);
    width?: (number | null);
    height?: (number | null);
    duration?: (number | null);
    folder: string;
    metadata?: Record<string, any>;
};

