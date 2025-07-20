// components/shared/Header.tsx
'use client';

import { User } from '@supabase/supabase-js';
import { Search, Bell, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useState, useRef, useEffect } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
    user: User | null;
}

// Sample notifications data
const sampleNotifications = [
    {
        id: 1,
        title: "Pengaduan Baru Diterima",
        message: "Pengaduan #PD-2024-001 - Jalan berlubang di Jl. Malioboro",
        time: "5 menit yang lalu",
        type: "new",
        unread: true
    },
    {
        id: 2,
        title: "Status Pengaduan Diperbarui",
        message: "Pengaduan #PD-2024-002 telah ditindaklanjuti",
        time: "1 jam yang lalu",
        type: "update",
        unread: true
    },
    {
        id: 3,
        title: "Laporan Bulanan Siap",
        message: "Laporan analitik bulan Januari 2024 telah tersedia",
        time: "2 jam yang lalu",
        type: "report",
        unread: false
    },
    {
        id: 4,
        title: "Sistem Maintenance",
        message: "Pemeliharaan sistem dijadwalkan pada 15 Feb 2024",
        time: "1 hari yang lalu",
        type: "system",
        unread: false
    }
];

// Sample search results
const sampleSearchResults = [
    {
        id: "PD-2024-001",
        title: "Jalan berlubang di Jl. Malioboro",
        type: "pengaduan",
        status: "Dalam Proses",
        category: "Infrastruktur"
    },
    {
        id: "PD-2024-002", 
        title: "Lampu jalan mati di Jl. Solo",
        type: "pengaduan",
        status: "Selesai",
        category: "Infrastruktur"
    },
    {
        id: "LP-2024-001",
        title: "Laporan Analitik Januari 2024",
        type: "laporan",
        status: "Tersedia",
        category: "Analitik"
    },
    {
        id: "DOC-001",
        title: "Panduan Pengelolaan Pengaduan",
        type: "dokumen",
        status: "Aktif",
        category: "Dokumentasi"
    }
];

export default function Header({ }: HeaderProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<typeof sampleSearchResults>([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [notifications, setNotifications] = useState(sampleNotifications);
    const searchRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => n.unread).length;

    // Handle search functionality
    useEffect(() => {
        if (searchQuery.length > 2) {
            const filtered = sampleSearchResults.filter(item =>
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setSearchResults(filtered);
            setShowSearchResults(true);
        } else {
            setShowSearchResults(false);
        }
    }, [searchQuery]);

    // Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSearchResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = (notificationId: number) => {
        setNotifications(prev => 
            prev.map(n => n.id === notificationId ? { ...n, unread: false } : n)
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'new': return '📝';
            case 'update': return '🔄';
            case 'report': return '📊';
            case 'system': return '⚙️';
            default: return '📢';
        }
    };

    const getResultIcon = (type: string) => {
        switch (type) {
            case 'pengaduan': return '📝';
            case 'laporan': return '📊';
            case 'dokumen': return '📄';
            default: return '📋';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Dalam Proses': return 'bg-yellow-100 text-yellow-800';
            case 'Selesai': return 'bg-green-100 text-green-800';
            case 'Tersedia': return 'bg-blue-100 text-blue-800';
            case 'Aktif': return 'bg-purple-100 text-purple-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    return (
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200/50 bg-white/90 backdrop-blur-xl px-6 shadow-sm">
            {/* Search Area */}
            <div className="flex items-center gap-4 flex-1 max-w-md relative" ref={searchRef}>
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="search"
                        placeholder="Cari pengaduan, laporan, atau dokumen..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white/80 pl-9 pr-4 py-2 text-sm placeholder:text-slate-500 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all duration-200"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setShowSearchResults(false);
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Search Results Dropdown */}
                {showSearchResults && (
                    <div className="absolute top-full left-0 mt-2 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                        <div className="p-3 border-b border-slate-100">
                            <p className="text-sm font-medium text-slate-700">
                                Hasil Pencarian ({searchResults.length})
                            </p>
                        </div>
                        {searchResults.length > 0 ? (
                            <div className="py-2">
                                {searchResults.map((result) => (
                                    <div
                                        key={result.id}
                                        className="px-3 py-2 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0"
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="text-lg">{getResultIcon(result.type)}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-medium text-slate-900 truncate">
                                                        {result.title}
                                                    </span>
                                                    <Badge 
                                                        variant="secondary" 
                                                        className={`text-xs ${getStatusColor(result.status)}`}
                                                    >
                                                        {result.status}
                                                    </Badge>
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {result.type.toUpperCase()} - {result.id} • {result.category}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 text-center text-slate-500 text-sm">
                                Tidak ada hasil ditemukan untuk &quot;{searchQuery}&quot;
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
                {/* Notification Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="relative rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        >
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <Badge 
                                    variant="destructive" 
                                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 min-w-[20px]"
                                >
                                    {unreadCount}
                                </Badge>
                            )}
                            <span className="sr-only">Notifikasi</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80 bg-white border border-slate-200 shadow-lg">
                        <DropdownMenuLabel className="flex items-center justify-between">
                            <span>Notifikasi</span>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-slate-600 hover:text-slate-900"
                                >
                                    Tandai semua dibaca
                                </button>
                            )}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <div className="max-h-96 overflow-y-auto">
                            {notifications.map((notification) => (
                                <DropdownMenuItem
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification.id)}
                                    className={`p-3 cursor-pointer ${notification.unread ? 'bg-blue-50' : ''}`}
                                >
                                    <div className="flex gap-3 w-full">
                                        <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="text-sm font-medium text-slate-900 truncate">
                                                    {notification.title}
                                                </p>
                                                {notification.unread && (
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-600 mb-1">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {notification.time}
                                            </p>
                                        </div>
                                    </div>
                                </DropdownMenuItem>
                            ))}
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* System Status Indicator */}
                <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-slate-100 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-slate-600">Sistem Aktif</span>
                </div>
            </div>
        </header>
    );
}