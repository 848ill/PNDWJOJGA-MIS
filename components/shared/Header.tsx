// components/shared/Header.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from './theme-toggle';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';
import { User } from "@supabase/supabase-js";

interface HeaderProps {
    user: User | null;
}

export default function Header({ user }: HeaderProps) {
    const pathname = usePathname();

    const getTitle = () => {
        const path = pathname.split('/').pop() || 'dashboard';
        return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
    };

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
            <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
                <div className="flex gap-6 md:gap-10">
                    <Link href="/dashboard" className="hidden items-center space-x-2 md:flex">
                        {/* <Logo /> You can uncomment this once you have a Logo component */}
                        <span className="hidden font-bold sm:inline-block">PANDAWA JOGJA</span>
                    </Link>
                </div>

                <div className="flex flex-1 items-center justify-end space-x-4">
                    <nav className="flex items-center space-x-1">
                        <h1 className="text-xl font-semibold hidden md:block">{getTitle()}</h1>
                        <div className="md:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Menu className="h-6 w-6" />
                                        <span className="sr-only">Buka Menu</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left">
                                    <Sidebar userRole={user?.user_metadata.role} isCollapsed={false} onToggle={() => {}} />
                                </SheetContent>
                            </Sheet>
                        </div>
                        <ThemeToggle />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user?.user_metadata.avatar_url} alt={user?.email} />
                                        <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>{user?.user_metadata.full_name || 'My Account'}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/settings">Pengaturan</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <form action="/auth/sign-out" method="post" className="w-full">
                                        <button type="submit" className="w-full text-left">
                                            Keluar
                                        </button>
                                    </form>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </nav>
                </div>
            </div>
        </header>
    );
}