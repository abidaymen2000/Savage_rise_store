/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type MarketingTypeRules = {
    requires_partner?: boolean;
    allowed_partner_types?: Array<'influencer' | 'model' | 'ambassador' | 'photographer' | 'content_creator' | 'press' | 'media' | 'affiliate' | 'partner' | 'other'>;
    requires_campaign?: boolean;
    requires_products?: boolean;
    requires_shipping?: boolean;
    stock_mode?: 'none' | 'gift' | 'loan' | 'mixed';
    return_policy?: 'forbidden' | 'optional' | 'required';
    approval_policy?: 'forbidden' | 'optional' | 'recommended' | 'required';
    deliverables_policy?: 'forbidden' | 'optional' | 'recommended' | 'required';
    promo_code_policy?: 'forbidden' | 'optional' | 'recommended' | 'required';
    tracking_policy?: 'forbidden' | 'optional' | 'recommended' | 'required';
    commission_policy?: 'forbidden' | 'optional' | 'recommended' | 'required';
    cost_tracking_enabled?: boolean;
    budget_tracking_enabled?: boolean;
};

