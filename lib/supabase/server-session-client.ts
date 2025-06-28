// lib/supabase/server-session-client.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers'; // <--- FIXED: Removed 'ReadonlyRequestCookies' from here
import { type Database } from '@/lib/types/supabase';

// Client for Server Components/API Routes WITH USER SESSION
export function createServerSupabaseClient(cookieStore: any) { // <--- FIXED: Explicitly type cookieStore as 'any'
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set(name, value, options);
          } catch (e) {
            console.warn('Could not set cookie from Server Component:', e);
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set(name, '', options);
          } catch (e) {
            console.warn('Could not remove cookie from Server Component:', e);
          }
        },
      },
    }
  );
} 