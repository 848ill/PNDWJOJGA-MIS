'use client';

import * as React from 'react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { motion } from 'framer-motion';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from './button';
import { Skeleton } from './skeleton';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pageCount: number;
    isPending: boolean;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    pageCount,
    isPending,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        pageCount: pageCount,
        manualPagination: true,
    });

    return (
        <div>
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
                    <motion.tbody
                        initial="initial"
                        animate="animate"
                        variants={{
                            initial: { opacity: 0 },
                            animate: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.05,
                                },
                            },
                        }}
                    >
                        {isPending ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    {columns.map((column) => (
                                        <TableCell key={(column as any).id || i}>
                                            <Skeleton className="h-6 w-full" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <motion.tr
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                    variants={{
                                        initial: { opacity: 0, y: 20 },
                                        animate: { opacity: 1, y: 0 },
                                    }}
                                    layout
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </motion.tr>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </motion.tbody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="bg-black text-white hover:bg-black/90"
                >
                    Previous
                </Button>
                <Button
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="bg-black text-white hover:bg-black/90"
                >
                    Next
                </Button>
            </div>
        </div>
    );
} 