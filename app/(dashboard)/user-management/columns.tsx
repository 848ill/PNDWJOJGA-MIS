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

import { deleteUser } from './actions';
import { type Role, type UserRow } from '@/lib/types/common';
import { EditUserForm } from './edit-user-form';

export const getColumns = (roles: Role[]): ColumnDef<UserRow>[] => [
    {
        accessorKey: 'full_name',
        header: 'Full Name',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'role_name',
        header: 'Role',
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
                                <DialogTitle>Edit user</DialogTitle>
                                <DialogDescription>
                                    Make changes to the user profile here. Click save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <EditUserForm user={user} roles={roles} setOpen={setEditOpen} onSuccess={handleSuccess} />
                        </DialogContent>
                    </Dialog>

                    <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                        <AlertDialogContent className="bg-white">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the user{' '}
                                    <span className="font-semibold">{user.full_name}</span> and remove their data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={async () => {
                                        toast.promise(deleteUser(user.id), {
                                            loading: 'Deleting user...',
                                            success: (result) => {
                                                handleSuccess();
                                                return result.message;
                                            },
                                            error: (err) => err.message,
                                        });
                                    }}
                                >
                                    Continue
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <DotsHorizontalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setEditOpen(true)}>
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setDeleteOpen(true)}
                                className="text-red-600"
                            >
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            );
        },
    },
];


