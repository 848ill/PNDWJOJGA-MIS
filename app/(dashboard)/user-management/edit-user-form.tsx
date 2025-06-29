"use client";

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
import { toast } from 'sonner';
import { updateUser } from './actions';
import { type Role } from '@/lib/types/common';
import { type UserRow } from '@/components/dashboard/UserTable';

interface EditUserFormProps {
    user: UserRow;
    roles: Role[];
    setOpen: (open: boolean) => void;
    onSuccess: () => void;
}

export function EditUserForm({ user, roles, setOpen, onSuccess }: EditUserFormProps) {
    const formAction = async (formData: FormData) => {
        const result = await updateUser(user.id, formData);
        if (result.success) {
            toast.success(result.message);
            onSuccess();
            setOpen(false);
        } else {
            toast.error(result.message || 'An unknown error occurred.');
        }
    };

    return (
        <form action={formAction} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fullName" className="text-right">
                    Nama Lengkap
                </Label>
                <Input
                    id="fullName"
                    name="fullName"
                    defaultValue={user.full_name || ''}
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
                    defaultValue={user.email || ''}
                    className="col-span-3"
                    required
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="roleId" className="text-right">
                    Peran
                </Label>
                <div className="col-span-3">
                    <Select name="roleId" defaultValue={user.role_id || undefined} required>
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih peran" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
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
                <Button
                    type="submit"
                    className="w-full"
                    style={{ backgroundColor: 'black', color: 'white' }}
                >
                    Simpan perubahan
                </Button>
            </div>
        </form>
    );
} 