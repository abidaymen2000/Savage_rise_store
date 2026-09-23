/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CatalogMediaUploadAuth = {
    token: string;
    expire: number;
    signature: string;
    public_key: string;
    url_endpoint: string;
    folder: string;
    allowed_mime_types?: Array<string>;
    max_size?: number;
};

