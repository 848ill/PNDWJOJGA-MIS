// app/(dashboard)/user-management/page.tsx

import { AddUserFormDialog } from './add-user-form';
import { UserManagementTable } from '@/components/dashboard/UserManagementTable';
import { fetchUsers } from './actions';

export default async function UserManagementPage() {
    // This Server Component now fetches ALL data needed for the page.
    const { users, roles, pageCount } = await fetchUsers(0, 10);

    return (
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
                    <p className="text-muted-foreground">
                        Here&apos;s a list of all the users in the system.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <AddUserFormDialog roles={roles} />
                </div>
            </div>
            {/* The table component now receives all data as props */}
            <UserManagementTable users={users} roles={roles} pageCount={pageCount} />
        </div>
    );
}