// app/(dashboard)/complaints/page.tsx
import { Suspense } from 'react';
import { fetchComplaints } from './actions';
import { ComplaintsTable } from '@/components/dashboard/ComplaintsTable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default async function ComplaintsPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    limit?: string;
    status?: string;
    priority?: string;
  };
}) {
  const { complaints, count, error } = await fetchComplaints(searchParams ?? {});
  const totalPages = count ? Math.ceil(count / (Number(searchParams?.limit) || 10)) : 1;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Pengaduan</h2>
      </div>
        <Card>
          <CardHeader>
            <CardTitle>Daftar Pengaduan</CardTitle>
            <CardDescription>
              Lihat, kelola, dan tindak lanjuti semua pengaduan yang masuk.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
                  {error ? (
                      <div className="text-red-500 text-center p-8">Error: {error}</div>
                  ) : (
                      <ComplaintsTable 
                        data={complaints || []}
                        pageCount={totalPages}
                      />
                  )}
              </Suspense>
          </CardContent>
        </Card>
    </div>
  );
}