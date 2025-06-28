// components/shared/Header.tsx
'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { CircleUser, Menu } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import Sidebar from "./Sidebar" // Assuming Sidebar can be rendered here for mobile

interface HeaderProps {
  userName: string | null;
  userRole: string | null;
  className?: string;
}

export default function Header({ userName, userRole, className }: HeaderProps) {
  // We'll reuse the navLinks logic, maybe move it to a shared place later
  const navLinks = [
    { name: 'Dashboard', href: '/', roles: ['system_admin', 'it_support', 'healthcare_official', 'transportation_official', 'infrastructure_official', 'education_official', 'executive'] },
    { name: 'Complaints', href: '/complaints', roles: ['system_admin', 'healthcare_official', 'transportation_official', 'infrastructure_official', 'education_official'] },
    { name: 'Analytics & Reports', href: '/analytics', roles: ['system_admin', 'healthcare_official', 'transportation_official', 'infrastructure_official', 'education_official', 'executive'] },
    { name: 'AI Recommendations', href: '/ai-recommendations', roles: ['system_admin', 'healthcare_official', 'transportation_official', 'infrastructure_official', 'education_official', 'executive'] },
    { name: 'User Management', href: '/user-management', roles: ['system_admin'] },
    { name: 'IT Support Tools', href: '/it-support', roles: ['system_admin', 'it_support'] },
    { name: 'Settings', href: '/settings', roles: ['system_admin'] },
  ];

  return (
    <header className={cn("sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-40", className)}>
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        {/* The title can be a link to the dashboard */}
        <Link
          href="#"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          {/* <LayoutDashboard className="h-6 w-6" /> */}
          <span className="sr-only">PandawaJogja</span>
        </Link>
        {/* Desktop links can go here if needed, or we can keep them in the sidebar only */}
      </nav>

      {/* Mobile Menu using Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle className="sr-only">Menu</SheetTitle>
          </SheetHeader>
          <Sidebar userRole={userRole} isCollapsed={false} onToggle={() => {}} />
        </SheetContent>
      </Sheet>

      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial">
          {/* Optional: Add a search bar or other actions here */}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{userName || 'My Account'}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}