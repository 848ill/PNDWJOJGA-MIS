import { createClient } from '@/lib/supabase/server-session-client';
import { redirect } from 'next/navigation';

export async function getDashboardData() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        redirect('/login');
    }

    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*, roles(name)')
        .eq('id', user.id)
        .single();
    
    if (userError || !userData) {
        console.error("Error fetching user role:", userError);
        redirect('/login');
    }

    return {
        user: user,
        userRole: userData.roles?.name || null
    };
} 