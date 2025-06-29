import { createClient } from '@/lib/supabase/server-session-client';
import { redirect } from 'next/navigation';

export async function getDashboardData() {
    const supabase = createClient();
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
        redirect('/login');
    }

    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*, roles(name)')
        .eq('id', session.user.id)
        .single();
    
    if (userError || !userData) {
        console.error("Error fetching user role:", userError);
        redirect('/login');
    }

    return {
        user: session.user,
        userRole: userData.roles?.name || null
    };
} 