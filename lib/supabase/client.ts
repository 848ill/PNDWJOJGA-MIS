// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';
// IMPORTANT: We'll generate this type in the next mini-step!
import { type Database } from '@/lib/types/supabase';

export function createClient() {
  // Ensure environment variables are loaded
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Supabase URL and/or Anon Key are missing in .env.local");
  }

  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}