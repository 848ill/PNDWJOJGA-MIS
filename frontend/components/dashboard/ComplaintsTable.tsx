// components/dashboard/ComplaintsTable.tsx
'use client';

import * as React from 'react';
import {
  ColumnDef,
  Row,
  getCoreRowModel,
  useReactTable,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type ComplaintRow = {
  id: string;
  text_content: string;
  submitted_at: string;
  status: 'open' | 'in progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  category_name: string | null;
};

export const columns: ColumnDef<ComplaintRow>[] = [
  {
    accessorKey: 'text_content',
    header: 'Pengaduan',
    cell: ({ row }: { row: Row<ComplaintRow> }) => (
      <div className="capitalize truncate max-w-xs">{row.getValue('text_content')}</div>
    ),
  },
  {
    accessorKey: 'category_name',
    header: 'Kategori',
    cell: ({ row }: { row: Row<ComplaintRow> }) => (
      <div>{row.getValue('category_name') || 'N/A'}</div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }: { row: Row<ComplaintRow> }) => {
      const status = row.getValue('status') as string;
      return <div className="capitalize">{status}</div>;
    },
  },
  {
    accessorKey: 'priority',
    header: 'Prioritas',
    cell: ({ row }: { row: Row<ComplaintRow> }) => {
      const priority = row.getValue('priority') as string;
      return <div className="capitalize">{priority}</div>;
    },
  },
  {
    accessorKey: 'submitted_at',
    header: 'Tanggal',
    cell: ({ row }: { row: Row<ComplaintRow> }) => {
      const date = new Date(row.getValue('submitted_at'));
      return <div>{date.toLocaleDateString('id-ID')}</div>;
    },
  },
];

interface ComplaintsTableProps {
  data: ComplaintRow[];
  pageCount: number;
}

export function ComplaintsTable({ data, pageCount }: ComplaintsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    pageCount,
    state: {
      sorting,
      columnFilters,
    },
    manualPagination: true,
  });

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter pengaduan..."
          value={(table.getColumn('text_content')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('text_content')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(
                (column) => column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}