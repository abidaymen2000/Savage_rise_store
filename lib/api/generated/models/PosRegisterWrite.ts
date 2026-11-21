/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PosRegisterWrite = {
    shop_id: string;
    name: string;
    code: string;
    status?: 'active' | 'archived';
    payment_methods?: Array<'cash' | 'card'>;
};

