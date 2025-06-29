// app/(dashboard)/user-management/columns.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { type ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { buttonVariants } from '@/components/ui/button';

import { deleteUser } from './actions';
import { type Role, type UserRow } from '@/lib/types/common';
import { EditUserForm } from './edit-user-form';

export const getColumns = (roles: Role[]): ColumnDef<UserRow>[] => [
    {
        accessorKey: 'full_name',
        header: 'Nama Lengkap',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'role_name',
        header: 'Peran',
    },
    {
        id: 'actions',
        cell: function Cell({ row }) {
            const user = row.original;
            const router = useRouter();
            const [editOpen, setEditOpen] = useState(false);
            const [deleteOpen, setDeleteOpen] = useState(false);

            const handleSuccess = () => {
                router.refresh();
            };

            return (
                <>
                    <Dialog open={editOpen} onOpenChange={setEditOpen}>
                        <DialogContent className="sm:max-w-[425px] bg-white">
                            <DialogHeader>
                                <DialogTitle>Ubah pengguna</DialogTitle>
                                <DialogDescription>
                                    Lakukan perubahan pada profil pengguna di sini. Klik simpan jika sudah selesai.
                                </DialogDescription>
                            </DialogHeader>
                            <EditUserForm user={user} roles={roles} setOpen={setEditOpen} onSuccess={handleSuccess} />
                        </DialogContent>
                    </Dialog>

                    <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                        <AlertDialogContent className="bg-white">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Apakah Anda benar-benar yakin?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tindakan ini tidak bisa dibatalkan. Ini akan menghapus pengguna secara permanen{' '}
                                    <span className="font-semibold">{user.full_name}</span> dan menghapus data mereka dari server kami.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={async () => {
                                        toast.promise(deleteUser(user.id), {
                                            loading: 'Menghapus pengguna...',
                                            success: (result) => {
                                                handleSuccess();
                                                return result.message;
                                            },
                                            error: (err) => err.message,
                                        });
                                    }}
                                    style={{ backgroundColor: 'hsl(var(--destructive))', color: 'hsl(var(--destructive-foreground))' }}
                                >
                                    Lanjutkan
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 transition-all hover:scale-110 active:scale-95"
                            >
                                <span className="sr-only">Buka menu</span>
                                <DotsHorizontalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setEditOpen(true)}>
                                Ubah
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setDeleteOpen(true)}
                                className="text-red-600"
                            >
                                Hapus
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            );
        },
    },
];


