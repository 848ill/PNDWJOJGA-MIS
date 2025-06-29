// app/(dashboard)/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Header from '@/components/shared/Header';
import Sidebar from '@/components/shared/Sidebar';
import { User } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.push('/login');
      } else {
        setUser(data.user);
        const role = data.user.user_metadata?.role || 'user';
        setUserRole(role);
      }
      setIsLoading(false);
    };
    checkUser();
  }, [router, supabase.auth]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
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
    </ThemeProvider>
  );
}