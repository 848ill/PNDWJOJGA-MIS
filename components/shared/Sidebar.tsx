// components/shared/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import {
  LayoutDashboard,
  FileText,
  BarChart2,
  Users,
  Settings,
  LifeBuoy,
  Briefcase,
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
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, roles: ['system_admin', 'it_support', 'healthcare_official', 'transportation_official', 'infrastructure_official', 'education_official', 'executive'] },
    { name: 'Complaints', href: '/complaints', icon: FileText, roles: ['system_admin', 'healthcare_official', 'transportation_official', 'infrastructure_official', 'education_official'] },
    { name: 'Analytics & Reports', href: '/analytics', icon: BarChart2, roles: ['system_admin', 'healthcare_official', 'transportation_official', 'infrastructure_official', 'education_official', 'executive'] },
    { name: 'AI Recommendations', href: '/ai-recommendations', icon: Briefcase, roles: ['system_admin', 'healthcare_official', 'transportation_official', 'infrastructure_official', 'education_official', 'executive'] },
    { name: 'User Management', href: '/user-management', icon: Users, roles: ['system_admin'] },
    { name: 'IT Support Tools', href: '/it-support', icon: LifeBuoy, roles: ['system_admin', 'it_support'] },
    { name: 'Settings', href: '/settings', icon: Settings, roles: ['system_admin'] },
  ];

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "h-screen fixed top-0 left-0 z-50 flex flex-col border-r bg-background transition-[width] duration-300",
          isCollapsed ? "w-14" : "w-64",
          className
        )}
      >
        <div className="flex h-14 items-center border-b p-2 justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold whitespace-nowrap overflow-hidden">
            {!isCollapsed && <span className="ml-2">PANDAWAJOGJA</span>}
          </Link>
          <Button variant="ghost" size="icon" onClick={onToggle} className="shrink-0">
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
                      className={cn("w-full justify-start", isCollapsed && "justify-center px-0")}
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