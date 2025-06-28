// lib/types/common.ts
// Define shared types here

export type Role = { id: string; name: string };

export type UserRow = {
    id: string;
    email: string | null;
    full_name: string | null;
    role_id: string | null;
    role_name: string | null;
};
