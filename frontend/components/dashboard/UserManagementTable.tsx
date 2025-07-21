'use client';

import * as React from 'react';
import {
  ColumnDef,
  Row
} from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/app/(dashboard)/user-management/columns";
import { UserActions } from '@/app/(dashboard)/user-management/user-actions';
import { UserRow, Role } from "@/lib/types/common";
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface UserManagementTableProps {
  users: UserRow[];
  roles: Role[];
  pageCount: number;
  onUserChanged: () => void;
}

export function UserManagementTable({ users, roles, pageCount, onUserChanged }: UserManagementTableProps) {
  
  const memoizedColumns: ColumnDef<UserRow>[] = React.useMemo(() => [
    ...columns.filter(c => c.id !== 'actions'),
    {
      id: "actions",
      cell: ({ row }: { row: Row<UserRow> }) => {
        const user = row.original;
        return <UserActions user={user} roles={roles} onUserChanged={onUserChanged} />;
      },
    }
  ], [roles, onUserChanged]);

  return (
    <DataTable
      columns={memoizedColumns}
      data={users}
      pageCount={pageCount}
      isPending={false}
    />
  )
}

export function TableSkeleton() {
    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Skeleton className="h-10 w-[300px]" />
                <Skeleton className="ml-auto h-10 w-[100px]" />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead><Skeleton className="h-6 w-full" /></TableHead>
                            <TableHead><Skeleton className="h-6 w-full" /></TableHead>
                            <TableHead><Skeleton className="h-6 w-full" /></TableHead>
                            <TableHead><Skeleton className="h-6 w-[50px]" /></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 10 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
            </div>
        </div>
    )
} 