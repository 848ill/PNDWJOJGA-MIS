'use server';

import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import { type ComplaintRow } from '@/components/dashboard/ComplaintsTable';

export async function fetchComplaints(
  pageIndex: number,
  pageSize: number
): Promise<{ complaints: ComplaintRow[]; pageCount: number; error: string | null }> {
  const supabase = createAdminSupabaseClient();

  try {
    const from = pageIndex * pageSize;
    const to = (pageIndex + 1) * pageSize - 1;

    const { data, error, count } = await supabase
      .from('complaints')
      .select('*, categories(name)', { count: 'exact' })
      .range(from, to)
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Server Action Error (fetchComplaints):', error);
      return { complaints: [], pageCount: 0, error: error.message };
    }

    const mappedComplaints: ComplaintRow[] = (data || []).map((complaint: any) => ({
      id: complaint.id,
      text_content: complaint.text_content,
      category_id: complaint.category_id,
      status: complaint.status,
      submitted_at: complaint.submitted_at,
      main_topic: complaint.main_topic,
      sentiment: complaint.sentiment,
      category_name: complaint.categories?.name || 'N/A',
    }));

    const pageCount = count !== null ? Math.ceil(count / pageSize) : 0;

    return { complaints: mappedComplaints, pageCount, error: null };

  } catch (e: any) {
    console.error('Server Action Error (fetchComplaints - general catch):', e);
    return { complaints: [], pageCount: 0, error: e.message || 'An unexpected error occurred.' };
  }
}

// This line explicitly marks the file as a module, fixing potential import errors.
export {}; 