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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sort = searchParams.get('sort');
  const order = searchParams.get('order');
  const sortingState: SortingState = sort ? [{ id: sort, desc: order === 'desc' }] : [];

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  React.useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel('realtime-complaints')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'complaints' }, () => {
        router.refresh();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: { 
      sorting: sortingState, 
      columnFilters, 
      columnVisibility, 
      rowSelection 
    },
    onSortingChange: (updater) => {
      const newSorting = typeof updater === 'function' ? updater(sortingState) : updater;
      const params = new URLSearchParams(searchParams.toString());
      const sortParam = newSorting[0]?.id;
      const orderParam = newSorting[0]?.desc ? 'desc' : 'asc';

      if (sortParam) {
        params.set('sort', sortParam);
        params.set('order', orderParam);
      } else {
        params.delete('sort');
        params.delete('order');
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualFiltering: true,
  });

  // Function to create/update URL search params
  const createQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );
  
  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Cari berdasarkan isi pengaduan..."
          value={(searchParams.get('q') ?? '')}
          onChange={(event) => {
             router.push(pathname + '?' + createQueryString('q', event.target.value));
          }}
          className="max-w-sm"
        />
        {/* Here we can add a Dropdown for Status Filter */}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={columns.length} className="h-24 text-center">Tidak ada hasil.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} dari {table.getFilteredRowModel().rows.length} baris dipilih.
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            const currentPage = Number(params.get('page') || '1');
            if (currentPage > 1) {
                router.push(pathname + '?' + createQueryString('page', String(currentPage - 1)));
            }
          }}
          disabled={!table.getCanPreviousPage()}
        >
          Sebelumnya
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            const currentPage = Number(params.get('page') || '1');
             router.push(pathname + '?' + createQueryString('page', String(currentPage + 1)));
          }}
          disabled={!table.getCanNextPage()}
        >
          Berikutnya
        </Button>
      </div>
    </div>
  );
}