// app/(dashboard)/complaints/page.tsx
import { Suspense } from 'react';
import { ComplaintsTable } from '@/components/dashboard/ComplaintsTable';
import { fetchComplaints } from './actions';
import { Skeleton } from '@/components/ui/skeleton'; // Assuming skeleton component exists
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

function ComplaintsPageSkeleton() {
    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-6">
                <Skeleton className="h-9 w-64" />
            </h1>
            <div className="w-full">
                <div className="flex items-center py-4">
                    <Skeleton className="h-10 w-[300px]" />
                    <Skeleton className="ml-auto h-10 w-[100px]" />
                </div>
                <div className="rounded-md border">
                    {/* Simplified skeleton for the table body */}
                    <div className="divide-y">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="flex items-center space-x-4 p-4">
                                <Skeleton className="h-5 w-5 rounded-sm" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default async function ComplaintsPage({
    searchParams,
}: {
    searchParams: {
        status?: string;
        q?: string;
        sort?: string;
        order?: string;
    };
}) {
    // Langsung fetch data di komponen Page
    const { complaints, pageCount, error } = await fetchComplaints({
        pageIndex: 0, 
        pageSize: 10, 
        searchParams: searchParams
    });

    return (
        <div className="flex flex-1 flex-col gap-8 p-4 md:p-8 animate-fade-in-up">
            <Card variant="glass">
                <CardHeader>
                    <div>
                        <CardTitle className="text-gray-800">Manajemen Pengaduan</CardTitle>
                        <CardDescription>Lihat, cari, dan kelola semua data pengaduan yang masuk.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<ComplaintsTableSkeleton />}>
                        {error ? (
                            <div className="text-red-500 text-center p-8">Error: {error}</div>
                        ) : complaints.length === 0 ? (
                            <div className="text-center text-muted-foreground p-8">No complaints found.</div>
                        ) : (
                            <ComplaintsTable data={complaints} pageCount={pageCount} />
                        )}
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
}

function ComplaintsTableSkeleton() {
    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Skeleton className="h-10 w-[300px]" />
                <Skeleton className="ml-auto h-10 w-[100px]" />
            </div>
            <div className="rounded-md border border-gray-200/50">
                <div className="divide-y divide-gray-200/50">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="flex items-center space-x-4 p-4">
                            <Skeleton className="h-5 w-5 rounded-sm" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}