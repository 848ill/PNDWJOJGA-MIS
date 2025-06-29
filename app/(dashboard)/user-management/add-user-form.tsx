// app/(dashboard)/user-management/add-user-form.tsx
'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useFormStatus, useFormState } from 'react-dom';
import { addUser } from './actions';
import { toast } from 'sonner';
import { type Role } from '@/lib/types/common';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

interface AddUserFormDialogProps {
    roles: Role[];
}

export function AddUserFormDialog({ roles }: AddUserFormDialogProps) {
    const [open, setOpen] = useState(false);

    const onUserAdded = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="black">
                  Tambah Pengguna Baru
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
                <DialogHeader>
                    <DialogTitle>Buat Pengguna Baru</DialogTitle>
                    <DialogDescription>
                        Isi formulir di bawah ini untuk menambahkan pengguna baru ke sistem.
                    </DialogDescription>
                </DialogHeader>
                <AddUserForm roles={roles} onUserAdded={onUserAdded} />
            </DialogContent>
        </Dialog>
    );
}

interface AddUserFormProps {
    roles: Role[];
    onUserAdded: () => void;
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button
            type="submit"
            disabled={pending}
            className="w-full"
            variant="black"
        >
            {pending ? 'Menambahkan Pengguna...' : 'Tambah Pengguna'}
        </Button>
    );
}

export function AddUserForm({ roles, onUserAdded }: AddUserFormProps) {
    const formRef = useRef<HTMLFormElement>(null);
    
    const [state, formAction] = useFormState(addUser, {
      success: false,
      message: '',
      errors: {}
    });

    useEffect(() => {
        if (state.message) {
            if (state.success) {
                toast.success(state.message);
                onUserAdded();
                formRef.current?.reset();
            } else {
                // Menampilkan error validasi spesifik jika ada
                const errorMessages = Object.values(state.errors || {}).flat().join('\n');
                toast.error(errorMessages || state.message);
            }
        }
    }, [state, onUserAdded]);

    return (
        <form action={formAction} ref={formRef}>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="fullName" className="text-right">
                        Nama Lengkap
                    </Label>
                    <Input
                        id="fullName"
                        name="fullName"
                        className="col-span-3"
                        required
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                        Email
                    </Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        className="col-span-3"
                        required
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">
                        Kata Sandi
                    </Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        className="col-span-3"
                        required
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="roleId" className="text-right">
                        Peran
                    </Label>
                    <div className="col-span-3">
                        <Select name="roleId" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih peran" />
                            </SelectTrigger>
                            <SelectContent
                                className="bg-white"
                                sideOffset={5}
                                position="popper"
                            >
                                {roles.map((role) => (
                                    <SelectItem key={role.id} value={role.id}>
                                        {role.name.replace(/_/g, ' ').replace(/\b\w/g, (char: string) => char.toUpperCase())}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="pt-4">
                    <SubmitButton />
                </div>
            </div>
        </form>
    );
}