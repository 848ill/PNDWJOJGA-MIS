// app/(dashboard)/complaints/page.tsx
import { Suspense } from 'react';
import { ComplaintsTable } from '@/components/dashboard/ComplaintsTable';
import { fetchComplaints } from './actions';
import { Skeleton } from '@/components/ui/skeleton'; // Assuming skeleton component exists

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

async function ComplaintsList({ searchParams }: { searchParams: { status?: string, q?: string, sort?: string, order?: string } }) {
    // We pass searchParams properties directly to the server action
    const { complaints, pageCount, error } = await fetchComplaints({
        pageIndex: 0, 
        pageSize: 10, 
        status: searchParams.status, 
        queryText: searchParams.q, 
        sort: searchParams.sort, 
        order: searchParams.order
    });

    if (error) {
        return <div className="text-red-500 text-center p-8">Error: {error}</div>;
    }

    if (complaints.length === 0) {
        return <div className="text-center text-muted-foreground p-8">No complaints found.</div>;
    }

    return <ComplaintsTable data={complaints} pageCount={pageCount} />;
}

export default function ComplaintsPage({
    searchParams,
}: {
    searchParams: {
        status?: string;
        q?: string;
        sort?: string;
        order?: string;
    };
}) {
    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-6">Semua Pengaduan</h1>
            <Suspense fallback={<ComplaintsPageSkeleton />}>
                <ComplaintsList searchParams={searchParams} />
            </Suspense>
        </div>
    );
}