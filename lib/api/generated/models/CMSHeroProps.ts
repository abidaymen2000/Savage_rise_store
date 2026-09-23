/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSCTAProps } from './CMSCTAProps';
import type { CMSMediaRef } from './CMSMediaRef';
export type CMSHeroProps = {
    eyebrow?: (string | null);
    title: string;
    subtitle?: (string | null);
    media?: (CMSMediaRef | null);
    mobile_media?: (CMSMediaRef | null);
    primary_cta?: (CMSCTAProps | null);
    secondary_cta?: (CMSCTAProps | null);
    alignment?: 'left' | 'center' | 'right';
    overlay?: 'none' | 'soft' | 'dark' | 'light';
    height?: 'auto' | 'medium' | 'large' | 'fullscreen';
    variant?: 'default' | 'fullscreen' | 'split' | 'media_background';
    image_url?: (string | null);
    image_alt?: (string | null);
    cta_label?: (string | null);
    cta_url?: (string | null);
};

