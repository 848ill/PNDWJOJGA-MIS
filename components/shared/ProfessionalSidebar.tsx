"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";

import { cn } from "@/lib/utils";
import {
  IconDashboard,
  IconFileText,
  IconChartBar,
  IconBulb,
  IconUsers,
  IconHeadphones,
  IconShield,
  IconSettings,
  IconUser,
  IconLogout,
  IconCrown,
  IconTool,
  IconStethoscope,
  IconBuilding,
  IconSchool,
  IconCar,
} from "@tabler/icons-react";

// Helper functions for role styling
const getRoleStyle = (role: string | null) => {
  switch (role) {
    case 'system_admin':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'executive':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'it_support':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'healthcare_official':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'transportation_official':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'infrastructure_official':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'education_official':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};

const getRoleIcon = (role: string | null) => {
  switch (role) {
    case 'system_admin':
      return <IconShield className="h-3 w-3" />;
    case 'executive':
      return <IconCrown className="h-3 w-3" />;
    case 'it_support':
      return <IconTool className="h-3 w-3" />;
    case 'healthcare_official':
      return <IconStethoscope className="h-3 w-3" />;
    case 'transportation_official':
      return <IconCar className="h-3 w-3" />;
    case 'infrastructure_official':
      return <IconBuilding className="h-3 w-3" />;
    case 'education_official':
      return <IconSchool className="h-3 w-3" />;
    default:
      return <IconUser className="h-3 w-3" />;
  }
};

const getRoleLabel = (role: string | null) => {
  switch (role) {
    case 'system_admin':
      return 'Administrator';
    case 'executive':
      return 'Eksekutif';
    case 'it_support':
      return 'IT Support';
    case 'healthcare_official':
      return 'Dinkes';
    case 'transportation_official':
      return 'Dishub';
    case 'infrastructure_official':
      return 'PUPR';
    case 'education_official':
      return 'Disdik';
    default:
      return 'Pengguna';
  }
};

interface ProfessionalSidebarProps {
  userRole: string | null;
  userName?: string;
  userEmail?: string;
  onLogout?: () => void;
}

export default function ProfessionalSidebar({ 
  userRole, 
  userName = "Administrator",
  userEmail = "admin@jogjakota.go.id",
  onLogout 
}: ProfessionalSidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navigationLinks = [
    {
      label: "Dasbor Eksekutif",
      href: "/",
      icon: <IconDashboard className="h-5 w-5" />,
      roles: ['system_admin', 'it_support', 'healthcare_official', 'transportation_official', 'infrastructure_official', 'education_official', 'executive']
    },
    {
      label: "Manajemen Pengaduan",
      href: "/complaints",
      icon: <IconFileText className="h-5 w-5" />,
      roles: ['system_admin', 'healthcare_official', 'transportation_official', 'infrastructure_official', 'education_official']
    },
    {
      label: "Analitik & Laporan",
      href: "/analytics",
      icon: <IconChartBar className="h-5 w-5" />,
      roles: ['system_admin', 'healthcare_official', 'transportation_official', 'infrastructure_official', 'education_official', 'executive']
    },
    {
      label: "Rekomendasi AI",
      href: "/ai-recommendations",
      icon: <IconBulb className="h-5 w-5" />,
      roles: ['system_admin', 'healthcare_official', 'transportation_official', 'infrastructure_official', 'education_official', 'executive']
    },
    {
      label: "Manajemen Pengguna",
      href: "/user-management",
      icon: <IconUsers className="h-5 w-5" />,
      roles: ['system_admin']
    },
    {
      label: "Dukungan Teknis",
      href: "/it-support",
      icon: <IconHeadphones className="h-5 w-5" />,
      roles: ['system_admin', 'it_support']
    },
    {
      label: "Log Audit Sistem",
      href: "/it-support/audit-logs",
      icon: <IconShield className="h-5 w-5" />,
      roles: ['system_admin']
    },
    {
      label: "Pengaturan Sistem",
      href: "/settings",
      icon: <IconSettings className="h-5 w-5" />,
      roles: ['system_admin']
    },
  ];

  // Filter links based on user role
  const filteredLinks = navigationLinks.filter(link => 
    link.roles.includes(userRole || '')
  );

  return (
    <div className="h-full w-fit flex">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 h-full">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {/* Logo Section */}
            {open ? <ExecutiveLogo /> : <ExecutiveLogoIcon />}
            
            {/* Navigation Links */}
            <div className="mt-8 flex flex-col gap-2">
              {filteredLinks.map((link, idx) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <SidebarLink 
                    key={idx} 
                    link={link} 
                    isActive={isActive}
                  />
                );
              })}
            </div>
          </div>
          
          {/* User Profile Section */}
          <div className="border-t border-slate-200 pt-4 space-y-2">
            {/* User Profile Card */}
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-all duration-200">
              <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center shadow-sm">
                <IconUser className="h-4 w-4 text-white" />
              </div>
              
              {open && (
                <div className="flex-1 min-w-0 animate-slide-in-left">
                  <div className="text-sm font-medium text-slate-800 truncate">
                    {userName}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {userEmail}
                  </div>
                </div>
              )}
            </div>
            
            {/* Role & Status Badge - Only show when expanded */}
            {open && (
              <div className="px-3 py-2 space-y-2 animate-slide-in-up delay-100">
                {/* Role Badge */}
                <div className="flex items-center justify-center">
                  <span className={cn(
                    "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border",
                    getRoleStyle(userRole)
                  )}>
                    {getRoleIcon(userRole)}
                    {getRoleLabel(userRole)}
                  </span>
                </div>
                
                {/* Status Indicator */}
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-slate-600 font-medium">Sesi Aktif</span>
                </div>
              </div>
            )}
            
            {/* Logout Button - Only show when expanded */}
            {open && (
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 py-2 px-3 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 animate-slide-in-up delay-200"
              >
                <IconLogout className="h-4 w-4" />
                <span>Keluar Sistem</span>
              </button>
            )}
            
            {/* Compact logout button when collapsed */}
            {!open && (
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center py-2 px-3 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                title="Keluar Sistem"
              >
                <IconLogout className="h-4 w-4" />
              </button>
            )}
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
}

// Executive Logo Component (Expanded)
export const ExecutiveLogo = () => {
  return (
    <div className="relative z-20 flex items-center space-x-3 py-2 hover:scale-105 transition-transform duration-200">
      <div className="w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center shadow-sm hover:shadow-lg transition-shadow duration-200">
        <span className="text-white font-bold text-sm">DIY</span>
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-slate-800 text-sm whitespace-pre">
          PANDAWA JOGJA
        </span>
        <span className="text-xs text-slate-500 -mt-0.5">
          Sistem Informasi Pengaduan
        </span>
      </div>
    </div>
  );
};

// Executive Logo Icon (Collapsed)
export const ExecutiveLogoIcon = () => {
  return (
    <div className="relative z-20 flex items-center justify-center py-2">
      <div className="w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center shadow-sm cursor-pointer hover:scale-110 hover:shadow-lg transition-all duration-200">
        <span className="text-white font-bold text-sm">DIY</span>
      </div>
    </div>
  );
}; 