/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type OrderBulkIn = {
    order_ids: Array<string>;
    action: 'confirm' | 'prepare' | 'ship' | 'deliver' | 'deliver_without_collection' | 'cancel' | 'refuse' | 'mark_paid' | 'request_return' | 'return_in_transit' | 'receive_return' | 'restock_return' | 'mark_return_damaged' | 'refund';
    reason?: (string | null);
    /**
     * Montant par commande pour refund; null rembourse le solde
     */
    amount?: (number | string | null);
    /**
     * Montants de remboursement par ID, prioritaires sur amount
     */
    refund_amounts?: Record<string, (number | string)>;
};

