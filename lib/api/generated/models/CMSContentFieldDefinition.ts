/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSContentFieldType } from './CMSContentFieldType';
import type { CMSContentFieldValidation } from './CMSContentFieldValidation';
import type { CMSContentReferenceType } from './CMSContentReferenceType';
export type CMSContentFieldDefinition = {
    key: string;
    label: string;
    type: CMSContentFieldType;
    required?: boolean;
    translatable?: boolean;
    default?: (string | number | boolean | Record<string, (string | number | boolean | Record<string, (string | number | boolean | null)> | null)> | null);
    validation?: CMSContentFieldValidation;
    reference_type?: (CMSContentReferenceType | null);
    reference_content_type?: (string | null);
    multiple?: boolean;
};

