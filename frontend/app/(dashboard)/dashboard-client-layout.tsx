'use client';


import Header from '@/components/shared/Header';
import ProfessionalSidebar from '@/components/shared/ProfessionalSidebar';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface DashboardClientLayoutProps {
    children: React.ReactNode;
    user: User | null;
    userRole: string | null;
}

export default function DashboardClientLayout({ children, user, userRole }: DashboardClientLayoutProps) {
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <div className="h-full bg-background flex">
            
            {/* Professional Sidebar with Aceternity */}
            <ProfessionalSidebar 
                userRole={userRole}
                userName={user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Administrator'}
                userEmail={user?.email || 'admin@jogjakota.go.id'}
                onLogout={handleLogout}
            />
            
            {/* Main Content Area */}
            <div className="flex flex-1 flex-col h-full">
                <Header 
                    user={user}
                />
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
} 