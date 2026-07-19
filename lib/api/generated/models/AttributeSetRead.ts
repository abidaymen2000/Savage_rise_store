/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttributeSetItemWrite } from './AttributeSetItemWrite';
export type AttributeSetRead = {
    id: string;
    version: number;
    created_at?: (string | null);
    updated_at?: (string | null);
    code: string;
    name: string;
    description?: (string | null);
    items?: Array<AttributeSetItemWrite>;
    is_active: boolean;
};

