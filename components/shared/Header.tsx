// components/shared/Header.tsx
'use client';

import { User } from '@supabase/supabase-js';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from './theme-toggle';
import { Button } from '../ui/button';
import Link from 'next/link';

interface HeaderProps {
    user: User | null;
}

export default function Header({ user }: HeaderProps) {
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const getInitials = (fullName: string | undefined): string => {
        if (!fullName) return 'N/A';
        const names = fullName.split(' ');
        if (names.length === 1) return names[0].charAt(0).toUpperCase();
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    };
    
    return (
        <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background/60 px-4 backdrop-blur-xl sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <span className="">PANDAWA JOGJA</span>
                </Link>
            </div>
            <div className="relative flex-1">
                {/* Search can be added here in the future */}
            </div>
            <ThemeToggle />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="rounded-full">
                        <Avatar>
                            <AvatarImage src={user?.user_metadata.avatar_url} alt={user?.user_metadata.full_name || 'User'} />
                            <AvatarFallback>{getInitials(user?.user_metadata.full_name)}</AvatarFallback>
                        </Avatar>
                        <span className="sr-only">Toggle user menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user?.user_metadata.full_name}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {user?.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}