/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MarketingCustomFieldDefinition } from './MarketingCustomFieldDefinition';
import type { MarketingTypeDefaults } from './MarketingTypeDefaults';
import type { MarketingTypeFormConfiguration } from './MarketingTypeFormConfiguration';
import type { MarketingTypeRules } from './MarketingTypeRules';
export type MarketingTypeUpdate = {
    label?: (string | null);
    description?: (string | null);
    category?: ('gifting' | 'loan' | 'content' | 'production' | 'launch' | 'ambassador' | 'press' | 'sponsorship' | 'affiliate' | 'event' | 'other' | null);
    workflow_profile?: ('campaign_standard' | 'gift_standard' | 'loan_standard' | 'content_standard' | 'sponsorship_standard' | 'hybrid_standard' | null);
    icon?: (string | null);
    display_order?: (number | null);
    rules?: (MarketingTypeRules | null);
    defaults?: (MarketingTypeDefaults | null);
    form_configuration?: (MarketingTypeFormConfiguration | null);
    custom_fields?: (Array<MarketingCustomFieldDefinition> | null);
    is_active?: (boolean | null);
    expected_version?: (number | null);
};

