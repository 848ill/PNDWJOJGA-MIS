// app/(dashboard)/user-management/page.tsx

import { Suspense } from 'react';
import { AddUserFormDialog } from './add-user-form';
import { UserManagementTable, TableSkeleton } from '@/components/dashboard/UserManagementTable';
import { fetchUsers } from './actions';
import { UsersIcon } from 'lucide-react';

export default async function UserManagementPage() {
    // This Server Component now fetches ALL data needed for the page.
    const { users, roles, pageCount } = await fetchUsers(0, 10);

    return (
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Manajemen Pengguna</h2>
                    <p className="text-muted-foreground">
                        Berikut adalah daftar semua pengguna dalam sistem.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <AddUserFormDialog roles={roles} />
                </div>
            </div>

            <Suspense fallback={<TableSkeleton />}>
                <UserManagementTableWrapper />
            </Suspense>

        </div>
    );
}

async function UserManagementTableWrapper() {
    const { users, roles, pageCount } = await fetchUsers(0, 10);

    if (users.length === 0) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center rounded-md border border-dashed">
                <UsersIcon className="h-16 w-16 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Tidak Ada Pengguna Ditemukan</h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                    Anda belum menambahkan pengguna. Mulai dengan menambahkan satu.
                </p>
                <AddUserFormDialog roles={roles} />
            </div>
        )
    }

    return <UserManagementTable users={users} roles={roles} pageCount={pageCount} />;
}