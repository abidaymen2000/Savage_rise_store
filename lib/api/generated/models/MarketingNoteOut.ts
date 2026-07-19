/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type MarketingNoteOut = {
    id: string;
    entity_type: 'campaign' | 'collaboration';
    entity_id: string;
    content: string;
    note_type: 'decision' | 'info' | 'warning';
    admin_id?: (string | null);
    admin_email?: (string | null);
    created_at: string;
};

