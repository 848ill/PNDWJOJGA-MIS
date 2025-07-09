'use client';


import Header from '@/components/shared/Header';
import ProfessionalSidebar from '@/components/shared/ProfessionalSidebar';
import { User } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';
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
        <div className="relative min-h-screen bg-slate-50 flex">
            {/* Sophisticated Background Pattern */}
            <div className="absolute inset-0 -z-10 h-full w-full">
                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                {/* Clean Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-slate-100/40"></div>
            </div>
            
            {/* Professional Sidebar with Aceternity */}
            <ProfessionalSidebar 
                userRole={userRole}
                userName={user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Administrator'}
                userEmail={user?.email || 'admin@jogjakota.go.id'}
                onLogout={handleLogout}
            />
            
            {/* Main Content Area */}
            <div className="flex flex-1 flex-col min-h-screen">
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