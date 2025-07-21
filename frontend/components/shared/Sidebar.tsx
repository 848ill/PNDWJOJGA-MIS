// components/shared/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import {
  LayoutDashboard,
  FileText,
  BarChart2,
  Users,
  Settings,
  LifeBuoy,
  Briefcase,
  Shield,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface SidebarProps {
  userRole: string | null;
  className?: string;
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ userRole, className, isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Dasbor', href: '/', icon: LayoutDashboard, roles: ['system_admin', 'it_support', 'healthcare_official', 'transportation_official', 'infrastructure_official', 'education_official', 'executive'] },
    { name: 'Pengaduan', href: '/complaints', icon: FileText, roles: ['system_admin', 'healthcare_official', 'transportation_official', 'infrastructure_official', 'education_official'] },
    { name: 'Analitik & Laporan', href: '/analytics', icon: BarChart2, roles: ['system_admin', 'healthcare_official', 'transportation_official', 'infrastructure_official', 'education_official', 'executive'] },
    { name: 'Rekomendasi AI', href: '/ai-recommendations', icon: Briefcase, roles: ['system_admin', 'healthcare_official', 'transportation_official', 'infrastructure_official', 'education_official', 'executive'] },
    { name: 'Manajemen Pengguna', href: '/user-management', icon: Users, roles: ['system_admin'] },
    { name: 'Alat Dukungan TI', href: '/it-support', icon: LifeBuoy, roles: ['system_admin', 'it_support'] },
    { name: 'Log Audit', href: '/it-support/audit-logs', icon: Shield, roles: ['system_admin'] },
    { name: 'Pengaturan', href: '/settings', icon: Settings, roles: ['system_admin'] },
  ];

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "h-screen fixed top-0 left-0 z-50 flex flex-col border-r bg-white/60 backdrop-blur-xl border-white/20 transition-[width] duration-300",
          isCollapsed ? "w-14" : "w-64",
          className
        )}
      >
        <div className="flex h-14 items-center border-b border-white/20 p-2 justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold whitespace-nowrap overflow-hidden text-gray-900">
            {!isCollapsed && <span className="ml-2">PANDAWAJOGJA</span>}
          </Link>
          <Button variant="ghost" size="icon" onClick={onToggle} className="shrink-0 text-gray-700 hover:bg-white/20">
            {isCollapsed ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
          </Button>
        </div>
        <nav className="flex-1 space-y-2 p-2">
          {navLinks.map((link) => {
            if (!link.roles.includes(userRole || '')) return null;
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Tooltip key={link.name}>
                <TooltipTrigger asChild>
                  <Link href={link.href}>
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      className={cn(
                        "w-full justify-start text-gray-800",
                        isActive && "bg-white/40 font-semibold",
                        !isActive && "hover:bg-white/20",
                        isCollapsed && "justify-center px-0"
                      )}
                    >
                      <link.icon className="h-5 w-5" />
                      {!isCollapsed && <span className="ml-3">{link.name}</span>}
                    </Button>
                  </Link>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">{link.name}</TooltipContent>}
              </Tooltip>
            );
          })}
        </nav>
      </aside>
    </TooltipProvider>
  );
}