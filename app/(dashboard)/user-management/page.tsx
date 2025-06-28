// app/(dashboard)/user-management/page.tsx
'use client'; // This component will run on the client-side

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client'; // Client-side Supabase client (for general use if needed)
import { UserTable, UserRow } from '@/components/dashboard/UserTable'; // Correctly import UserTable and UserRow
import { PaginationState } from '@tanstack/react-table'; // Import PaginationState
import { columns } from './columns'; // Correctly import columns from local file
import { AddUserForm } from './add-user-form'; // Import AddUserForm from local file
// CRITICAL FIX: Correct import from user-actions.ts, and alias fetchUsers/addUser.
// Role type is defined HERE, so it's NOT imported from user-actions.
import { fetchUsers as fetchUsersAction, addUser as addUserAction } from './user-actions';


// Define types for data fetched from Supabase, specific to this page
export type SupabaseUserFetched = {
  id: string;
  full_name: string | null;
  email: string | null;
  role_id: string | null;
  roles: { name: string } | null; // From roles(name) join
}

// CRITICAL FIX: Define Role type EXPLICITLY HERE as the source of truth for this module
export type Role = { id: string; name: string };


export default function UserManagementPage() {
  const supabase = createClient(); // For general client-side operations if needed
  
  const [users, setUsers] = useState<UserRow[]>([]);
  const [roles, setRoles] = useState<Role[]>([]); // State to hold roles data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [pageCount, setPageCount] = useState(0);

  const fetchUsersAndRoles = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { users: fetchedUsers, roles: fetchedRoles, pageCount: fetchedPageCount, error: fetchError } = await fetchUsersAction(
      pagination.pageIndex,
      pagination.pageSize
    );

    if (fetchError) {
      console.error('Error fetching users/roles via Server Action:', fetchError);
      setError(fetchError);
      setUsers([]);
      setRoles([]);
      setPageCount(0);
    } else {
      setUsers(fetchedUsers);
      setRoles(fetchedRoles);
      setPageCount(fetchedPageCount);
    }
    setLoading(false);
  }, [pagination]);

  useEffect(() => {
    fetchUsersAndRoles();
  }, [fetchUsersAndRoles]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <AddUserForm roles={roles} />
      </div>

      {loading && (
        <div className="flex items-center justify-center min-h-[200px]">
          <p>Loading users...</p>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center min-h-[200px]">{error}</div>
      )}

      {!loading && !error && users.length > 0 && (
        <UserTable
          columns={columns}
          data={users}
          pageCount={pageCount}
          pagination={pagination}
          setPagination={setPagination}
        />
      )}

      {!loading && !error && users.length === 0 && (
        <div className="text-center text-muted-foreground">No users found.</div>
      )}
    </div>
  );
}