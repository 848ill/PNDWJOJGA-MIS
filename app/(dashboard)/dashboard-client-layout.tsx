'use client';

import { useState } from 'react';
import Header from '@/components/shared/Header';
import Sidebar from '@/components/shared/Sidebar';
import { User } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';

interface DashboardClientLayoutProps {
    children: React.ReactNode;
    user: User | null;
    userRole: string | null;
}

export default function DashboardClientLayout({ children, user, userRole }: DashboardClientLayoutProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="relative min-h-screen bg-gray-100">
            <div className="absolute inset-0 -z-10 h-full w-full bg-gray-100 bg-[linear-gradient(to_right,#e0e0e0_1px,transparent_1px),linear-gradient(to_bottom,#e0e0e0_1px,transparent_1px)] bg-[size:6rem_4rem]">
                <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_600px_at_50%_100px,#c9d8ff,transparent)]"></div>
            </div>
            <Sidebar 
                userRole={userRole} 
                isCollapsed={isCollapsed}
                onToggle={() => setIsCollapsed(!isCollapsed)}
            />
            <div 
                className={cn(
                    "flex flex-col min-h-screen transition-[margin-left] duration-300",
                    isCollapsed ? "ml-14" : "ml-64"
                )}
            >
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