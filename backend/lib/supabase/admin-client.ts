// lib/supabase/admin-client.ts
import { createServerClient } from '@supabase/ssr';
import { type Database } from '@/lib/types/supabase';

// Client for Admin Operations (without user session, full access)
export function createAdminSupabaseClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in .env.local');
  }
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string,
    {
      cookies: { // Still provide empty async cookie methods as required by createServerClient type
          get: async () => undefined,
          set: async () => {},
          remove: async () => {}
      },
      auth: {
        persistSession: false,
      }
    }
  );
}