'use client';

import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Get the current page index from the URL search params
    const page = searchParams?.get('page') ?? '1';
    const currentPage = Number(page);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        pageCount: pageCount,
        manualPagination: true,
        state: {
            pagination: {
                pageIndex: currentPage - 1, // react-table is 0-indexed
                pageSize: 10, // Assuming a fixed page size
            },
        },
    });

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

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
            <div className="flex items-center justify-between py-4">
                 <span className="text-sm text-muted-foreground">
                    Halaman {currentPage} dari {table.getPageCount()}
                </span>
                <div className="flex items-center space-x-2">
                    <Button
                        size="sm"
                        onClick={() => router.push(createPageURL(currentPage - 1))}
                        disabled={!table.getCanPreviousPage()}
                        className="bg-black text-white hover:bg-gray-900"
                    >
                        Sebelumnya
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => router.push(createPageURL(currentPage + 1))}
                        disabled={!table.getCanNextPage()}
                        className="bg-black text-white hover:bg-gray-900"
                    >
                        Berikutnya
                    </Button>
                </div>
            </div>
        </div>
    );
} 