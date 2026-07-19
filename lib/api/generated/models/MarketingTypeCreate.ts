/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MarketingCustomFieldDefinition } from './MarketingCustomFieldDefinition';
import type { MarketingTypeDefaults } from './MarketingTypeDefaults';
import type { MarketingTypeFormConfiguration } from './MarketingTypeFormConfiguration';
import type { MarketingTypeRules } from './MarketingTypeRules';
export type MarketingTypeCreate = {
    key: string;
    label: string;
    description?: (string | null);
    entity_scope: 'campaign' | 'collaboration' | 'both';
    category: 'gifting' | 'loan' | 'content' | 'production' | 'launch' | 'ambassador' | 'press' | 'sponsorship' | 'affiliate' | 'event' | 'other';
    workflow_profile: 'campaign_standard' | 'gift_standard' | 'loan_standard' | 'content_standard' | 'sponsorship_standard' | 'hybrid_standard';
    icon?: (string | null);
    display_order?: number;
    rules: MarketingTypeRules;
    defaults?: MarketingTypeDefaults;
    form_configuration?: MarketingTypeFormConfiguration;
    custom_fields?: Array<MarketingCustomFieldDefinition>;
    is_active?: boolean;
    is_system?: boolean;
};

