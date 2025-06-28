// app/(dashboard)/user-management/add-user-form.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { type Role } from '@/lib/types/common'; // Import Role type from the page itself
import { useFormStatus, useFormState } from 'react-dom';
import { addUser, State } from './user-actions'; // Import Server Action
import { cn } from '@/lib/utils'; // Import cn utility

interface AddUserFormProps {
    roles: Role[];
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Adding...' : 'Add User'}
    </Button>
  );
}

export function AddUserForm({ roles }: AddUserFormProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    
    // FIX: Ensure these useState declarations are present and correct
    const [error, setError] = useState<string | null>(null); // <--- FIXED: Added/ensured setError declaration
    const [success, setSuccess] = useState<string | null>(null); // <--- FIXED: Added/ensured setSuccess declaration

    const [state, formAction] = useFormState<State, FormData>(addUser, {
      success: false,
      message: '',
      errors: {}
    });

    useEffect(() => {
        if (state.success) {
            setDialogOpen(false);
            formRef.current?.reset();
            setFullName('');
            setEmail('');
            setPassword('');
            setSelectedRole('');
            setError(null); // Ensure this is using local state
            setSuccess(state.message); // Ensure this is using local state
        } else if (state.message) {
            setError(state.message); // Ensure this is using local state
            setSuccess(null); // Ensure this is using local state
        }
        if (state.errors) {
            console.error('Validation errors:', state.errors);
        }
    }, [state]);

    const handleDialogChange = (open: boolean) => {
      if (!open) {
        setDialogOpen(false);
        formRef.current?.reset();
        setFullName('');
        setEmail('');
        setPassword('');
        setSelectedRole('');
        setError(null); // Ensure this is using local state
        setSuccess(null); // Ensure this is using local state
      } else {
        setDialogOpen(true);
        setError(null); // Ensure this is using local state
        setSuccess(null); // Ensure this is using local state
      }
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
            <DialogTrigger asChild>
                <Button>Add New User</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add User</DialogTitle>
                    <DialogDescription>
                        Add a new user to the system.
                    </DialogDescription>
                </DialogHeader>
                <form action={formAction} ref={formRef}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="full_name" className="text-right">
                                Full Name
                            </Label>
                            <Input
                                id="full_name"
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
                                placeholder="user@example.com"
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
                                placeholder="password123"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">
                                Role
                            </Label>
                            <Select onValueChange={setSelectedRole} value={selectedRole} name="roleId" required>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem key={role.id} value={role.id}>
                                            {role.name.replace(/_/g, ' ').replace(/\b\w/g, (char: string) => char.toUpperCase())}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {error && (
                            <p className={cn("text-sm col-span-full text-center", success ? 'text-green-500' : 'text-red-500')}>
                                {error} {/* Display error from local state */}
                            </p>
                        )}
                        {success && (
                            <p className={cn("text-sm col-span-full text-center", success ? 'text-green-500' : 'text-red-500')}>
                                {success} {/* Display success from local state */}
                            </p>
                        )}
                        {state.errors?.email && <p className="text-red-500 text-xs col-span-full text-center">{state.errors.email.join(', ')}</p>}
                        
                        <DialogFooter>
                            <SubmitButton />
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}