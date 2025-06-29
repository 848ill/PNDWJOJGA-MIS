// components/dashboard/ComplaintsTable.tsx
'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { createClient } from '@/lib/supabase/client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { updateComplaintStatus, updateComplaintPriority } from '@/app/(dashboard)/complaints/actions';
import { cn } from '@/lib/utils';
import { priorities } from '@/lib/constants/complaints';
import { DataTable } from '@/components/ui/data-table';

// Corrected type definitions to match backend and database
export type ComplaintRow = {
  id: string;
  text_content: string;
  category_id: string;
  status: 'open' | 'in_progress' | 'escalated' | 'resolved' | 'closed' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  submitted_at: string;
  main_topic: string | null;
  sentiment: string | null;
  category_name: string | null;
};

const availableStatuses: ComplaintRow['status'][] = ['open', 'in_progress', 'escalated', 'resolved', 'closed', 'rejected'];

// Corrected columns definition
export const columns: ColumnDef<ComplaintRow>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Pilih semua"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Pilih baris"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'submitted_at',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Tanggal Dibuat <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{new Date(row.getValue('submitted_at')).toLocaleDateString()}</div>,
  },
  {
    accessorKey: 'category_name',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Kategori <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue('category_name')}</div>,
  },
  {
    accessorKey: 'main_topic',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Topik <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const mainTopic = row.getValue('main_topic');
      return <div>{typeof mainTopic === 'string' ? mainTopic : 'N/A'}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Status <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="capitalize">{(row.getValue('status') as string).replace('_', ' ')}</div>,
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Prioritas <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const priority = priorities.find(p => p.value === row.getValue('priority'));
      if (!priority) return <div className="text-muted-foreground">N/A</div>;
      return (
        <div className="flex items-center">
          <priority.icon className={cn("mr-2 h-4 w-4", 
            priority.value === 'high' && 'text-red-500',
            priority.value === 'medium' && 'text-yellow-500',
            priority.value === 'low' && 'text-green-500'
          )} />
          <span>{priority.label}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'text_content',
    header: 'Isi Pengaduan',
    cell: ({ row }) => <div className="line-clamp-2 max-w-sm">{row.getValue('text_content')}</div>,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const complaint = row.original;
      const [isPending, startTransition] = React.useTransition();

      const handleStatusChange = (newStatus: ComplaintRow['status']) => {
        startTransition(async () => {
          const { success, error } = await updateComplaintStatus(complaint.id, newStatus);
          if (success) {
            toast.success(`Status berhasil diubah ke ${newStatus.replace('_', ' ')}.`);
          } else {
            toast.error(`Pembaruan gagal: ${error}`);
          }
        });
      };

      const handlePriorityChange = (newPriority: ComplaintRow['priority']) => {
        startTransition(async () => {
          const { success, error } = await updateComplaintPriority(complaint.id, newPriority);
          if (success) {
            toast.success(`Prioritas berhasil diubah ke ${newPriority}.`);
          } else {
            toast.error(`Pembaruan gagal: ${error}`);
          }
        });
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Buka menu</span><MoreHorizontal className="h-4 w-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(complaint.id)}>Salin ID</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Ubah Status</DropdownMenuLabel>
            {availableStatuses
              .filter(status => status !== complaint.status)
              .map(status => (
                <DropdownMenuItem key={status} onClick={() => handleStatusChange(status)} disabled={isPending}>
                  Ubah ke {status.replace('_', ' ')}
                </DropdownMenuItem>
              ))}
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span>Ubah Prioritas</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="bg-white">
                {priorities
                  .filter(p => p.value !== complaint.priority)
                  .map(p => (
                    <DropdownMenuItem
                      key={p.value}
                      onClick={() => handlePriorityChange(p.value as ComplaintRow['priority'])}
                      disabled={isPending}
                    >
                      <p.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{p.label}</span>
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface ComplaintsTableProps {
  data: ComplaintRow[];
  pageCount: number;
}

export function ComplaintsTable({ data, pageCount }: ComplaintsTableProps) {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  // Memoize columns to prevent re-renders
  const memoizedColumns = React.useMemo(() => {
    // We need to define the action handlers here or pass them down
    const handleStatusChange = (complaintId: string, newStatus: ComplaintRow['status']) => {
      startTransition(async () => {
        const { success, error } = await updateComplaintStatus(complaintId, newStatus);
        if (success) {
          toast.success(`Status berhasil diubah.`);
          router.refresh(); // Refresh data on success
        } else {
          toast.error(`Pembaruan gagal: ${error}`);
        }
      });
    };

    const handlePriorityChange = (complaintId: string, newPriority: ComplaintRow['priority']) => {
      startTransition(async () => {
        const { success, error } = await updateComplaintPriority(complaintId, newPriority);
        if (success) {
          toast.success(`Prioritas berhasil diubah.`);
          router.refresh(); // Refresh data on success
        } else {
          toast.error(`Pembaruan gagal: ${error}`);
        }
      });
    };

    // Return the columns array, potentially with actions passed into cells
    // Note: This assumes 'columns' can be configured to accept these handlers.
    // We will need to adjust the 'columns.tsx' for complaints if not.
    return columns; // For now, let's assume columns are defined elsewhere and imported
  }, [router]);

  return (
    <DataTable
      columns={memoizedColumns}
      data={data}
      pageCount={pageCount}
      isPending={isPending} // Pass the transition pending state
    />
  );
}