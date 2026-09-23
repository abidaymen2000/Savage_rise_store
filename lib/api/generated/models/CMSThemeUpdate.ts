/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSThemeColors } from './CMSThemeColors';
import type { CMSThemeComponents } from './CMSThemeComponents';
import type { CMSThemeLayout } from './CMSThemeLayout';
import type { CMSThemeRadius } from './CMSThemeRadius';
import type { CMSThemeSpacing } from './CMSThemeSpacing';
import type { CMSThemeTypography } from './CMSThemeTypography';
export type CMSThemeUpdate = {
    expected_version: number;
    colors?: (CMSThemeColors | null);
    typography?: (CMSThemeTypography | null);
    layout?: (CMSThemeLayout | null);
    spacing?: (CMSThemeSpacing | null);
    radius?: (CMSThemeRadius | null);
    components?: (CMSThemeComponents | null);
};

