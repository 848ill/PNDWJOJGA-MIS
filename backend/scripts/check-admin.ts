// scripts/check-admin.ts
import { config } from 'dotenv';
import { resolve } from 'path';
import { createAdminSupabaseClient } from '@/lib/supabase/admin-client';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

async function checkAdmin() {
  const supabase = createAdminSupabaseClient();
  
  console.log('🔍 Checking for system_admin users...');

  try {
    // Get system_admin role ID
    const { data: roles, error: roleError } = await supabase
      .from('roles')
      .select('*')
      .eq('name', 'system_admin')
      .single();
    
    if (roleError) {
      console.error('❌ Error finding system_admin role:', roleError);
      return;
    }
    
    console.log('✅ Found system_admin role:', roles.id);

    // Check if any users have system_admin role
    const { data: adminUsers, error: userError } = await supabase
      .from('users')
      .select('*, roles(name)')
      .eq('role_id', roles.id);
    
    if (userError) {
      console.error('❌ Error finding admin users:', userError);
      return;
    }
    
    if (adminUsers.length > 0) {
      console.log('✅ Found existing system_admin users:');
      adminUsers.forEach((user, index) => {
        console.log(`${index + 1}. Email: ${user.email}`);
        console.log(`   Name: ${user.full_name}`);
        console.log(`   Password: password123`);
        console.log('-'.repeat(40));
      });
    } else {
      console.log('❌ No system_admin users found. Creating one...');
      
      // Create new admin user
      const adminEmail = 'admin@pndwjogja.com';
      const { data: newAuthUser, error: createError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: 'password123',
        email_confirm: true,
        user_metadata: { full_name: 'System Administrator' }
      });
      
      if (createError) {
        console.error('❌ Error creating auth admin user:', createError);
      } else if (newAuthUser.user) {
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: newAuthUser.user.id,
            email: newAuthUser.user.email,
            full_name: 'System Administrator',
            role_id: roles.id
          });
        
        if (insertError) {
          console.error('❌ Error creating admin profile:', insertError);
        } else {
          console.log('✅ System admin created successfully!');
          console.log('📋 Admin credentials:');
          console.log(`   Email: ${adminEmail}`);
          console.log(`   Password: password123`);
          console.log(`   Role: system_admin`);
        }
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkAdmin(); 