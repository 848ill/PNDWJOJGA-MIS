// lib/supabase/server.ts
// This file serves as the single source for Supabase server-side clients.

import { createServerClient as createSupabaseServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers'; // This import is specific to server-side rendering environments
import { type Database } from '@/lib/types/supabase'; // Import your generated database types

/**
 * Creates a Supabase client for Server Components and API Routes that needs to access
 * data *as the logged-in user*. It handles user session cookies.
 * This client should be used for operations that respect Row Level Security (RLS).
 *
 * @param cookieStore The cookies instance from 'next/headers' (e.g., `cookies()`).
 * @returns A SupabaseClient instance configured for the user's session.
 */
export const createServerClient = async () => {
  const cookieStore = await cookies();

  return createSupabaseServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set(name, value, options);
          } catch (e) {
            // The 'set' method was called from a Server Component that is not
            // a Route Handler. This can be ignored if you have middleware refreshing
            // user sessions.
            console.warn('Could not set cookie from Server Component:', e);
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set(name, '', options);
          } catch (e) {
            // The 'delete' method was called from a Server Component that is not
            // a Route Handler. This can be ignored if you have middleware refreshing
            // user sessions.
            console.warn('Could not remove cookie from Server Component:', e);
          }
        },
      },
    }
  );
}

/**
 * Creates a Supabase client for admin operations that do NOT rely on a user session
 * and bypass Row Level Security (RLS). This client uses the service_role_key.
 *
 * @returns A SupabaseClient instance with admin privileges.
 * @throws {Error} If SUPABASE_SERVICE_ROLE_KEY is not set.
 */
export function createAdminSupabaseClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in .env.local');
  }
  return createSupabaseServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string,
    {
      cookies: { // Still provide empty async cookie methods as required by createServerClient type
          get: async () => undefined,
          set: async () => {},
          remove: async () => {}
      },
      auth: {
        persistSession: false, // Ensures no session is persisted
      }
    }
  );
}