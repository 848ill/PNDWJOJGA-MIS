// app/(dashboard)/user-management/actions.ts
'use server';

import 'server-only';
import { z } from 'zod';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { Role, UserRow } from '@/lib/types/common';

// Re-export types for components
export type { UserRow } from '@/lib/types/common';

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
const AddUserSchema = z.object({
  fullName: z.string().min(3, { message: 'Nama lengkap minimal 3 karakter.' }),
  email: z.string().email({ message: 'Format email tidak valid.' }),
  password: z.string().min(8, { message: 'Password minimal 8 karakter.' }),
  roleId: z.string().uuid({ message: 'Role harus dipilih.' }),
});

export async function addUser(values: z.infer<typeof AddUserSchema>): Promise<{ success: boolean; message: string; }> {
  const supabase = createAdminSupabaseClient();
  try {
    const parsedValues = AddUserSchema.safeParse(values);
    if (!parsedValues.success) {
      return { success: false, message: parsedValues.error.errors.map(e => e.message).join(', ') };
    }

    const { error: insertError } = await supabase.auth.admin.createUser({
      email: parsedValues.data.email,
      password: parsedValues.data.password,
      email_confirm: true,
      user_metadata: {
        full_name: parsedValues.data.fullName,
        role_id: parsedValues.data.roleId,
      }
    });

    if (insertError) {
      return { success: false, message: insertError.message };
    }
    
    // The public.users table is now populated by a trigger, but let's revalidate
    revalidatePath('/user-management');
    return { success: true, message: 'User added successfully!' };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'An unexpected server error occurred.';
    return { success: false, message: errorMessage };
  }
}

// --- NEW: FETCH USERS SERVER ACTION ---
export async function fetchUsers(searchParams: {
  page?: string;
  limit?: string;
}): Promise<{ users: UserRow[]; roles: Role[]; pageCount: number; error: string | null }> {
  const supabase = createAdminSupabaseClient();

  try {
    const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
    const limit = searchParams.limit ? parseInt(searchParams.limit, 10) : 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: usersData, error: usersError, count: usersCount } = await supabase
      .from('users')
      .select('*, roles(name)', { count: 'exact' })
      .range(from, to)
      .order('full_name', { ascending: true });

    if (usersError) throw new Error(usersError.message);

    const { data: rolesData, error: rolesError } = await supabase
      .from('roles')
      .select('id, name')
      .order('name', { ascending: true });
    
    if (rolesError) throw new Error(rolesError.message);

    const mappedUsers: UserRow[] = (usersData || []).map((user) => ({
      id: user.id,
      email: user.email ?? '',
      full_name: user.full_name ?? '',
      role_id: user.role_id ?? '',
      role_name: user.roles?.name || 'N/A',
    }));

    const roles: Role[] = (rolesData || []);
    const pageCount = usersCount !== null ? Math.ceil(usersCount / limit) : 0;
    
    return { users: mappedUsers, roles, pageCount, error: null };

  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred on the server.';
    return { users: [], roles: [], pageCount: 0, error: errorMessage };
  }
}

// --- UPDATE USER SERVER ACTION ---
export async function updateUser(userId: string, fullName: string, roleId: string): Promise<{ success: boolean; message: string; }> {
  const supabase = createAdminSupabaseClient();
  try {
    const { error } = await supabase
      .from('users')
      .update({ full_name: fullName, role_id: roleId })
      .eq('id', userId);

    if (error) return { success: false, message: error.message };
    
    revalidatePath('/user-management');
    return { success: true, message: 'User updated successfully.' };

  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'An unexpected server error occurred.';
    return { success: false, message: errorMessage };
  }
}

// --- UPDATE & DELETE ACTIONS (from previous) ---
export async function deleteUser(userId: string): Promise<{ success: boolean; message: string; }> {
  const supabase = createAdminSupabaseClient();
  try {
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) return { success: false, message: error.message };
    
    revalidatePath('/user-management');
    return { success: true, message: 'User deleted successfully.' };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'An unexpected server error occurred.';
    return { success: false, message: errorMessage };
  }
}

export async function revalidateUserManagement() {
  revalidatePath('/user-management');
}