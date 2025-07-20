// app/(dashboard)/user-management/page.tsx

import { AddUserForm } from './add-user-form';
import { UserManagementTable } from '@/components/dashboard/UserManagementTable';
import { fetchUsers, revalidateUserManagement } from './actions';
import { UsersIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { MotionDiv } from '@/components/shared/MotionDiv';

export default async function UserManagementPage({
  searchParams,
}: {
  searchParams?: Promise<{
    page?: string;
    limit?: string;
  }>;
}) {
    const resolvedSearchParams = await searchParams;
    const page = resolvedSearchParams?.page ?? '1';
    const limit = resolvedSearchParams?.limit ?? '10';
    const { users, roles, pageCount } = await fetchUsers({ page, limit });

    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <MotionDiv
            className="h-full flex-1 flex-col space-y-6 p-4 md:p-8 flex"
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.1 }}
        >
            <MotionDiv variants={variants} className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-800">
                        Manajemen Pengguna
                    </h2>
                    <p className="text-muted-foreground">
                        Kelola pengguna, peran, dan hak akses sistem.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <AddUserForm roles={roles} />
                </div>
            </MotionDiv>

            <MotionDiv variants={variants} className="flex-grow">
                <Card variant="glass" className="h-full flex flex-col">
                    {users.length === 0 ? (
                        <CardContent className="flex flex-col flex-grow items-center justify-center p-6">
                             <div className="flex h-full flex-col items-center justify-center rounded-md text-center">
                                <UsersIcon className="h-16 w-16 text-muted-foreground/50" />
                                <h3 className="mt-4 text-lg font-semibold text-gray-700">Tidak Ada Pengguna Ditemukan</h3>
                                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                                    Mulai dengan menambahkan pengguna baru untuk ditampilkan di sini.
                                </p>
                                <AddUserForm roles={roles} />
                            </div>
                        </CardContent>
                    ) : (
                        <CardContent className="p-6 pt-0">
                            <UserManagementTable users={users} roles={roles} pageCount={pageCount} onUserChanged={revalidateUserManagement} />
                        </CardContent>
                    )}
                </Card>
            </MotionDiv>
        </MotionDiv>
    );
}