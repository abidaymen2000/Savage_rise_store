/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type OrderNoteOut = {
    id: string;
    note_uid?: (string | null);
    order_id?: (string | null);
    content: string;
    step_key?: (string | null);
    step_label?: (string | null);
    note_type?: 'decision' | 'info' | 'warning';
    visibility?: string;
    admin_id?: (string | null);
    admin_email?: (string | null);
    created_at: string;
    updated_at?: (string | null);
};

