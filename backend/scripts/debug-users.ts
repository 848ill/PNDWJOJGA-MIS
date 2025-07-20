// scripts/debug-users.ts
import { config } from 'dotenv';
import { resolve } from 'path';
import { createAdminSupabaseClient } from '@/lib/supabase/admin-client';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

async function debugUsers() {
  const supabase = createAdminSupabaseClient();
  console.log('🔍 Debugging users and roles...');

  try {
    // Check roles table
    const { data: roles, error: rolesError } = await supabase
      .from('roles')
      .select('*');
    
    if (rolesError) {
      console.error('Error fetching roles:', rolesError);
      return;
    }
    
    console.log('📋 Available roles:', roles);

    // Check users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*, roles(name)')
      .limit(5);
    
    if (usersError) {
      console.error('Error fetching users:', usersError);
      return;
    }
    
    console.log('👥 Users with roles:', users);

    // Check auth users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error fetching auth users:', authError);
      return;
    }
    
    console.log('🔐 Auth users count:', authUsers.users.length);
    
    if (authUsers.users.length > 0) {
      console.log('First auth user:', {
        id: authUsers.users[0].id,
        email: authUsers.users[0].email
      });
    }

    // Check if there's mismatch
    if (authUsers.users.length > 0 && users.length === 0) {
      console.log('⚠️  PROBLEM: Auth users exist but no public users found!');
      
      // Try to create missing user records
      for (const authUser of authUsers.users.slice(0, 3)) {
        console.log(`🔧 Trying to fix user: ${authUser.email}`);
        
        // Get a random role for this user
        const randomRole = roles[Math.floor(Math.random() * roles.length)];
        
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: authUser.id,
            email: authUser.email,
            full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
            role_id: randomRole.id
          });
        
        if (insertError) {
          console.error(`Error inserting user ${authUser.email}:`, insertError);
        } else {
          console.log(`✅ Fixed user: ${authUser.email} with role: ${randomRole.name}`);
        }
      }
    }

  } catch (error) {
    console.error('Debug error:', error);
  }
}

debugUsers(); 