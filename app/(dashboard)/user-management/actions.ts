// app/(dashboard)/user-management/actions.ts
'use server';

import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { UserRow } from '@/components/dashboard/UserTable'; // Import UserRow type
import { type Role } from '@/lib/types/common';

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
  fullName: z.string().min(3, 'Full name must be at least 3 characters.'),
  email: z.string().email('Invalid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  roleId: z.string().uuid('A role must be selected.'),
});

export async function addUser(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = AddUserSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid form data. Please check the fields.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { fullName, email, password, roleId } = validatedFields.data;
  const supabase = createAdminSupabaseClient();
  
  try {
    // 1. Create user in Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      // Check for specific, common errors
      if (authError.message.includes('already exists')) {
        return { success: false, message: 'A user with this email already exists.' };
      }
      throw new Error(`Auth Error: ${authError.message}`);
    }
    if (!user) {
      throw new Error('User not created in Supabase Auth.');
    }

    // 2. Insert user profile into public.users table
    const { error: insertError } = await supabase.from('users').insert({
      id: user.id,
      full_name: fullName,
      email,
      role_id: roleId,
    });

    if (insertError) {
      // If profile insert fails, we must delete the auth user to prevent orphans.
      await supabase.auth.admin.deleteUser(user.id);
      throw new Error(`Profile Insert Error: ${insertError.message}`);
    }

    revalidatePath('/user-management');
    return { success: true, message: 'User created successfully!' };

  } catch (e: any) {
    console.error('Server Action Error (addUser):', e);
    return { success: false, message: e.message || 'An unexpected server error occurred.' };
  }
}

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

// --- UPDATE USER SERVER ACTION ---
const EditUserSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters.'),
  roleId: z.string().uuid('Invalid role selected.'),
});

export async function updateUser(userId: string, formData: FormData): Promise<State> {
  const validatedFields = EditUserSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid form data. Please check inputs.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { fullName, roleId } = validatedFields.data;
  const supabase = createAdminSupabaseClient();

  try {
    const { error } = await supabase
      .from('users')
      .update({ full_name: fullName, role_id: roleId })
      .eq('id', userId);

    if (error) {
        return { success: false, message: error.message };
    }

    revalidatePath('/user-management');
    return { success: true, message: 'User updated successfully.' };

  } catch (e: any) {
    console.error('Server Action Error (updateUser):', e);
    return { success: false, message: e.message || 'An unexpected error occurred.' };
  }
}

// --- UPDATE & DELETE ACTIONS (from previous) ---
export async function deleteUser(userId: string) {
    const supabase = createAdminSupabaseClient();
    const { error } = await supabase.from('users').delete().eq('id', userId);

    if (error) {
        return { success: false, message: `Failed to delete user: ${error.message}` };
    }

    revalidatePath('/user-management');
    return { success: true, message: 'User deleted successfully.' };
}