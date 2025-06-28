// app/(dashboard)/user-management/columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { UserRow } from '@/components/dashboard/UserTable'; // <--- Correct import for UserRow type
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { deleteUser } from './actions';
import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';

function DeleteUserForm({ userId }: { userId: string }) {
  const initialState = { success: false, message: '' };
  const [state, formAction] = useFormState(deleteUser, initialState);

  useEffect(() => {
    if (state.message) {
      alert(state.message);
    }
  }, [state]);

  return (
    <form action={formAction} className="w-full">
      <input type="hidden" name="userId" value={userId} />
      <DeleteUserButton />
    </form>
  );
}

function DeleteUserButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-red-500 w-full text-left relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
    >
      {pending ? 'Deleting...' : 'Delete User'}
    </button>
  );
}

export const columns: ColumnDef<UserRow>[] = [
  {
    accessorKey: 'full_name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Full Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue('full_name')}</div>,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'role_name',
    header: 'Role',
    cell: ({ row }) => <div className="capitalize">{row.getValue('role_name')}</div>,
  },
  {
    id: 'actions', // Unique ID for this actions column
    cell: ({ row }) => {
      const user = row.original; // Get the full user object for this row

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" /> {/* Ellipsis icon */}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-2 shadow-lg bg-popover rounded-md border">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(user.id)}
            >
                Copy User ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
                // Implement actual edit dialog later
                onClick={() => alert(`Edit user: ${user.full_name} (ID: ${user.id})`)}
            >
                Edit User
            </DropdownMenuItem>
            <DropdownMenuItem
                className="text-red-500" // Style delete button red
                // Implement actual delete dialog later
                onClick={() => {
                    if (confirm(`Are you sure you want to delete ${user.full_name}?`)) {
                        alert(`Delete user: ${user.full_name} (ID: ${user.id}) - Simulated`);
                        // In real app, call deleteUser server action
                    }
                }}
            >
                Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
]


