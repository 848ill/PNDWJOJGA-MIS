'use client';

import React from 'react';
import { DataTable } from '@/components/ui/data-table';
import { type Role, type UserRow } from '@/lib/types/common';
import { getColumns } from '@/app/(dashboard)/user-management/columns';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface UserManagementTableProps {
    users: UserRow[];
    roles: Role[];
    pageCount: number;
}

export function UserManagementTable({
    users,
    roles,
    pageCount,
}: UserManagementTableProps) {
    const columns = React.useMemo(() => getColumns(roles), [roles]);

    return (
        <DataTable
            columns={columns}
            data={users}
            pageCount={pageCount}
            isPending={false} // Data is pre-fetched by the server
        />
    );
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