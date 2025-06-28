'use client';

import React from 'react';
import { DataTable } from '@/components/ui/data-table';
import { type Role, type UserRow } from '@/lib/types/common';
import { getColumns } from '@/app/(dashboard)/user-management/columns';

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