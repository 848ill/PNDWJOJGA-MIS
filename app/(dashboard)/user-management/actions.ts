// app/(dashboard)/user-management/actions.ts
'use server';

import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { UserRow } from '@/components/dashboard/UserTable'; // Import UserRow type
import { Role } from './page'; // Import Role type

// Shared State type for form responses (from previous, for forms)
export type State = {
  success: boolean;
  message: string;
  errors?: {
    fullName?: string[];
    email?: string[];
    password?: string[];
    roleId?: string[];
  };
}

// --- ADD USER SERVER ACTION (from previous) ---
const AddUserSchema = z.object({ /* ... */ });
export async function addUser(prevState: State | undefined, formData: FormData): Promise<State> { /* ... */ }

// --- NEW: FETCH USERS SERVER ACTION ---
export async function fetchUsers(
  pageIndex: number,
  pageSize: number
): Promise<{ users: UserRow[]; roles: Role[]; pageCount: number; error: string | null }> {
  const supabase = createAdminSupabaseClient(); // Use the admin client

  try {
    const from = pageIndex * pageSize;
    const to = (pageIndex + 1) * pageSize - 1;

    // Fetch users with pagination and join roles
    const { data: usersData, error: usersError, count: usersCount } = await supabase
      .from('users')
      .select('*, roles(name)', { count: 'exact' })
      .range(from, to)
      .order('full_name', { ascending: true });

    if (usersError) {
      console.error('Server Action Error (fetchUsers - usersData):', usersError);
      return { users: [], roles: [], pageCount: 0, error: usersError.message };
    }

    // Fetch ALL roles for the AddUserForm dropdown
    const { data: rolesData, error: rolesError } = await supabase
      .from('roles')
      .select('id, name')
      .order('name', { ascending: true });

    if (rolesError) {
      console.error('Server Action Error (fetchUsers - rolesData):', rolesError);
      return { users: [], roles: [], pageCount: 0, error: rolesError.message };
    }

    const mappedUsers: UserRow[] = (usersData || []).map((user: any) => ({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role_id: user.role_id,
      role_name: user.roles?.name || 'N/A',
    }));

    const roles: Role[] = (rolesData || []);
    const pageCount = usersCount !== null ? Math.ceil(usersCount / pageSize) : 0;

    return { users: mappedUsers, roles, pageCount, error: null };

  } catch (e: any) {
    console.error('Server Action Error (fetchUsers - general catch):', e);
    return { users: [], roles: [], pageCount: 0, error: e.message || 'An unexpected error occurred on the server.' };
  }
}

// --- UPDATE & DELETE ACTIONS (from previous) ---
export async function updateUser(prevState: State | undefined, formData: FormData): Promise<State> {
    return { success: false, message: 'Update user not yet implemented.' };
}
export async function deleteUser(prevState: State | undefined, formData: FormData): Promise<State> {
    return { success: false, message: 'Delete user not yet implemented.' };
}