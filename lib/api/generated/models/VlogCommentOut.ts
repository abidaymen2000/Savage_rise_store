/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type VlogCommentOut = {
    id: string;
    episode_id: string;
    user_id: string;
    content: string;
    status?: 'visible' | 'hidden';
    author?: (string | null);
    episode_title?: (string | null);
    created_at: string;
    updated_at: string;
};

