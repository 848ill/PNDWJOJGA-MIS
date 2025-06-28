// lib/supabase/admin.ts

import { createClient } from '@supabase/supabase-js'
// FIX: Changed the alias path '@/lib/types/supabase' to a relative path
import { type Database } from '../types/supabase'

// IMPORTANT: This client is for SERVER-SIDE USE ONLY.
// It uses the SERVICE_ROLE_KEY to bypass Row Level Security.
// Never expose this client or its key to the browser.

export const createAdminSupabaseClient = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase URL or Service Role Key in .env.local')
  }

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}