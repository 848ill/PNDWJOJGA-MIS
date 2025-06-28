// app/(dashboard)/layout.tsx
'use client';
import '../../app/globals.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../lib/supabase/client';
import Header from '../../components/shared/Header';
import Sidebar from '../../components/shared/Sidebar';
import { User } from '@supabase/supabase-js';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/button';
import { Menu } from 'lucide-react'; 

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      setLoading(true);
      const { data: { user: sessionUser } } = await supabase.auth.getUser();
      if (!sessionUser) {
        router.push('/login');
        return;
      }
      setUser(sessionUser);
      const { data: userData, error } = await supabase
        .from('users')
        .select('full_name, roles(name)')
        .eq('id', sessionUser.id)
        .single();
      if (userData && !error) {
        setUserRole((userData.roles as { name: string })?.name || null);
        setUserName((userData.full_name as string) || null);
      }
      setLoading(false);
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/login');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router, supabase]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-background">Loading...</div>;
  }
  if (!user) {
    return null;
  }

  return (
    <div className="relative min-h-screen">
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
          userName={userName} 
          userRole={userRole} 
        />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}