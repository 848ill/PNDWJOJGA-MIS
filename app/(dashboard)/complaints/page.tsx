// app/(dashboard)/complaints/page.tsx
'use client'; // This component will run on the client-side

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client'; // Client-side Supabase client
import { ComplaintsTable, ComplaintRow } from '@/components/dashboard/ComplaintsTable'; // Import the table component
import { PaginationState } from '@tanstack/react-table'; // Import PaginationState

export default function ComplaintsPage() {
  const supabase = createClient();
  const [complaints, setComplaints] = useState<ComplaintRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10, // Initial page size
  });
  const [pageCount, setPageCount] = useState(0); // Total number of pages

  // Memoize fetch function with useCallback to prevent re-creation on every render
  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    setError(null);

    const from = pagination.pageIndex * pagination.pageSize;
    const to = (pagination.pageIndex + 1) * pagination.pageSize - 1;

    const { data, error: fetchError, count } = await supabase
      .from('complaints')
      .select('*, categories(name)', { count: 'exact' }) // Select categories(name) for the table
      .range(from, to); // IMPLEMENTED PAGINATION RANGE

    if (fetchError) {
      console.error('Error fetching complaints:', fetchError);
      setError(fetchError.message);
      setComplaints([]); // Clear data on error
      setPageCount(0);
    } else {
      const mappedData: ComplaintRow[] = data.map((complaint: any) => ({ // Using 'any' for complaint for now
        id: complaint.id,
        text_content: complaint.text_content,
        category_id: complaint.category_id,
        status: complaint.status,
        submitted_at: complaint.submitted_at,
        main_topic: complaint.main_topic,
        sentiment: complaint.sentiment,
        category_name: complaint.categories?.name || 'N/A', // Access the joined category name
      }));
      setComplaints(mappedData);
      if (count !== null) {
        setPageCount(Math.ceil(count / pagination.pageSize));
      }
    }
    setLoading(false);
  }, [pagination, supabase]);

  // Trigger data fetching when pagination state changes
  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);


  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">All Complaints</h1>

      {loading && (
        <div className="flex items-center justify-center min-h-[200px]">
          <p>Loading complaints...</p>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center min-h-[200px]">{error}</div>
      )}

      {!loading && !error && complaints.length > 0 && (
        <ComplaintsTable
          data={complaints}
          pageCount={pageCount}
          pagination={pagination}
          setPagination={setPagination}
        />
      )}

      {!loading && !error && complaints.length === 0 && (
        <div className="text-center text-muted-foreground">No complaints found.</div>
      )}
    </div>
  );
}