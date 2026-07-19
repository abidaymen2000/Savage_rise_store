/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MarketingCustomFieldValidation } from './MarketingCustomFieldValidation';
export type MarketingCustomFieldDefinition = {
    key: string;
    label: string;
    field_type: 'text' | 'textarea' | 'integer' | 'decimal' | 'money' | 'boolean' | 'date' | 'datetime' | 'url' | 'select' | 'multiselect';
    required?: boolean;
    help_text?: (string | null);
    display_order?: number;
    options?: Array<string>;
    validation?: MarketingCustomFieldValidation;
};

