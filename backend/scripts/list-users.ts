// scripts/list-users.ts
import { config } from 'dotenv';
import { resolve } from 'path';
import { createAdminSupabaseClient } from '@/lib/supabase/admin-client';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

async function listUsers() {
  const supabase = createAdminSupabaseClient();
  console.log('📋 Available login credentials:');

  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('email, full_name, roles(name)')
      .limit(10);
    
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    console.log('\n🔑 Valid login emails (all use password: password123):');
    console.log('=' .repeat(60));
    
    users?.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`);
      console.log(`   Name: ${user.full_name}`);
      console.log(`   Role: ${(user.roles as any)?.name || 'No Role'}`);
      console.log(`   Password: password123`);
      console.log('-'.repeat(40));
    });

  } catch (error) {
    console.error('Error:', error);
  }
}

listUsers(); 