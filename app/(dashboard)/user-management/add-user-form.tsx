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
                <Button 
                  variant="default" 
                  style={{ backgroundColor: 'black', color: 'white' }}
                >
                  Add New User
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
                <DialogHeader>
                    <DialogTitle>Create a New User</DialogTitle>
                    <DialogDescription>
                        Fill out the form below to add a new user to the system.
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
            style={{ backgroundColor: 'black', color: 'white' }}
        >
            {pending ? 'Adding User...' : 'Add User'}
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
                        Full Name
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
                        Password
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
                        Role
                    </Label>
                    <div className="col-span-3">
                        <Select name="roleId" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
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