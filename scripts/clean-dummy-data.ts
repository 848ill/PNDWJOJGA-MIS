import { config } from 'dotenv';
import { resolve } from 'path';
import { createAdminSupabaseClient } from '@/lib/supabase/admin-client';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

async function cleanDummyData() {
  const supabase = createAdminSupabaseClient();
  console.log('🧹 Cleaning existing dummy data...');

  try {
    // Delete complaints first (due to foreign key constraints)
    const { error: complaintsError } = await supabase
      .from('complaints')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Keep any system data if exists

    if (complaintsError) {
      console.error('Error deleting complaints:', complaintsError);
      return;
    }
    console.log('✅ Complaints deleted');

    // Get all non-system-admin users to delete from auth
    const { data: usersToDelete, error: fetchError } = await supabase
      .from('users')
      .select('id, email')
      .neq('email', 'admin@pndwjogja.com'); // Preserve admin user if exists

    if (fetchError) {
      console.error('Error fetching users:', fetchError);
      return;
    }

    // Delete users from public.users table
    if (usersToDelete && usersToDelete.length > 0) {
      const { error: publicUsersError } = await supabase
        .from('users')
        .delete()
        .neq('email', 'admin@pndwjogja.com');

      if (publicUsersError) {
        console.error('Error deleting public users:', publicUsersError);
        return;
      }

      // Delete users from auth.users
      for (const user of usersToDelete) {
        const { error: authDeleteError } = await supabase.auth.admin.deleteUser(user.id);
        if (authDeleteError) {
          console.error(`Error deleting auth user ${user.email}:`, authDeleteError);
        }
      }
    }
    console.log('✅ Users deleted');

    console.log('🎉 Dummy data cleaning completed successfully!');
    console.log('💡 Now you can run: npx tsx generate-dummy-data.ts');

  } catch (error) {
    console.error('Error during cleanup:', error);
  }
}

cleanDummyData(); 