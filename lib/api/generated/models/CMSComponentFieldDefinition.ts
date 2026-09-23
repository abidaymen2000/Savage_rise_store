/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CMSComponentFieldDefinition = {
    key: string;
    label: string;
    field_type: 'string' | 'text' | 'markdown' | 'url' | 'boolean' | 'number' | 'select' | 'list' | 'object';
    required?: boolean;
    translatable?: boolean;
    description?: (string | null);
    max_length?: (number | null);
    min_length?: (number | null);
    options?: Array<string>;
    item_fields?: Array<CMSComponentFieldDefinition>;
};

