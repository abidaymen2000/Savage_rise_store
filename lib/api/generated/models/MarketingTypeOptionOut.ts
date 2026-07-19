/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MarketingTypeDefaults } from './MarketingTypeDefaults';
import type { MarketingTypeRules } from './MarketingTypeRules';
export type MarketingTypeOptionOut = {
    id: string;
    key: string;
    label: string;
    entity_scope: 'campaign' | 'collaboration' | 'both';
    category: 'gifting' | 'loan' | 'content' | 'production' | 'launch' | 'ambassador' | 'press' | 'sponsorship' | 'affiliate' | 'event' | 'other';
    workflow_profile: 'campaign_standard' | 'gift_standard' | 'loan_standard' | 'content_standard' | 'sponsorship_standard' | 'hybrid_standard';
    icon?: (string | null);
    version: number;
    rules: MarketingTypeRules;
    defaults: MarketingTypeDefaults;
};

