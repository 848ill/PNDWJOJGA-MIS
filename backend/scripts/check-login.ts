import { config } from 'dotenv';
import { resolve } from 'path';
import { createAdminSupabaseClient } from '@/lib/supabase/admin-client';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

async function checkLogin() {
  const supabase = createAdminSupabaseClient();
  
  // Email untuk test
  const testEmail = 'rudi.indrasari@email.com';
  
  console.log(`🔍 Checking user: ${testEmail}`);

  try {
    // Check if user exists in public.users
    const { data: publicUser, error: publicError } = await supabase
      .from('users')
      .select('*, roles(name)')
      .eq('email', testEmail)
      .single();
    
    if (publicError) {
      console.log('❌ User not found in public.users table:', publicError.message);
      
      // Check if user exists in auth.users
      const { data: authUsers } = await supabase.auth.admin.listUsers();
      const authUser = authUsers.users.find(u => u.email === testEmail);
      
      if (authUser) {
        console.log('✅ User found in auth.users, creating public profile...');
        
        // Get first available role
        const { data: roles } = await supabase.from('roles').select('*').limit(1);
        const role = roles?.[0];
        
        if (role) {
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              id: authUser.id,
              email: authUser.email,
              full_name: authUser.user_metadata?.full_name || 'Test User',
              role_id: role.id
            });
          
          if (insertError) {
            console.error('❌ Error creating public profile:', insertError);
          } else {
            console.log('✅ Public profile created successfully!');
          }
        }
      } else {
        console.log('❌ User not found in auth.users either');
        console.log('📝 Creating new user...');
        
        // Create auth user
        const { data: newAuthUser, error: createError } = await supabase.auth.admin.createUser({
          email: testEmail,
          password: 'password123',
          email_confirm: true,
          user_metadata: { full_name: 'Test User' }
        });
        
        if (createError) {
          console.error('❌ Error creating auth user:', createError);
        } else if (newAuthUser.user) {
          // Get first available role
          const { data: roles } = await supabase.from('roles').select('*').limit(1);
          const role = roles?.[0];
          
          if (role) {
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                id: newAuthUser.user.id,
                email: newAuthUser.user.email,
                full_name: 'Test User',
                role_id: role.id
              });
            
            if (insertError) {
              console.error('❌ Error creating public profile:', insertError);
            } else {
              console.log('✅ Complete user created successfully!');
            }
          }
        }
      }
    } else {
      console.log('✅ User found in public.users:');
      console.log(`   Email: ${publicUser.email}`);
      console.log(`   Name: ${publicUser.full_name}`);
      console.log(`   Role: ${(publicUser.roles as any)?.name}`);
      console.log('✅ User should be able to login with password: password123');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkLogin(); 