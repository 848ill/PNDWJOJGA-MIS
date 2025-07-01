'use server';

import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import { type ComplaintRow } from '@/components/dashboard/ComplaintsTable';
import { revalidatePath } from 'next/cache';
// import type { Database } from '@/lib/types/supabase';

// type ComplaintWithCategory = Database['public']['Views']['complaints_with_priority_rank']['Row'] & {
//   categories: { name: string } | null;
// };

interface FetchComplaintsParams {
  pageIndex: number;
  pageSize: number;
  searchParams: {
    status?: string | null;
    q?: string | null;
    sort?: string | null;
    order?: string | null;
  };
}

export async function fetchComplaints({
  pageIndex,
  pageSize,
  searchParams,
}: FetchComplaintsParams): Promise<{ complaints: ComplaintRow[]; pageCount: number; error: string | null }> {
  const supabase = createAdminSupabaseClient();
  const { status, q: queryText, sort, order } = searchParams;

  try {
    const from = pageIndex * pageSize;
    const to = (pageIndex + 1) * pageSize - 1;

    let query = supabase
      .from('complaints_with_priority_rank')
      .select('*, categories(name)', { count: 'exact' });

    if (status) {
        query = query.eq('status', status);
    }

    if (queryText) {
        query = query.textSearch('text_content', queryText, { type: 'websearch' });
    }

    // Apply sorting
    let sortColumn = sort || 'submitted_at';
    const ascending = order === 'asc';

    // Translate frontend column names to actual database column names
    if (sortColumn === 'category_name') {
      sortColumn = 'category_id';
    } else if (sortColumn === 'priority') {
      // Sort by the numeric rank column when 'priority' is requested
      sortColumn = 'priority_rank';
    }
    
    query = query.order(sortColumn, { ascending });

    const { data, error, count } = await query
      .range(from, to)
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Server Action Error (fetchComplaints):', error);
      return { complaints: [], pageCount: 0, error: error.message };
    }

    const mappedComplaints: ComplaintRow[] = (data || []).map((complaint: unknown) => {
      const c = complaint as Record<string, unknown>;
      return {
        id: String(c.id),
        text_content: (c.text_content as string) || '',
        category_id: String(c.category_id),
        status: c.status === 'in_progress' ? 'in progress' : ((c.status as string) === 'open' || (c.status as string) === 'resolved' || (c.status as string) === 'closed' ? (c.status as 'open' | 'resolved' | 'closed') : 'open'),
        priority: ((c.priority as string) === 'low' || (c.priority as string) === 'high' ? (c.priority as 'low' | 'high') : 'medium'),
                 submitted_at: (c.submitted_at as string),
        main_topic: (c.main_topic as string) || null,
        sentiment: (c.sentiment as string) || null,
        category_name: ((c.categories as { name?: string })?.name) || 'N/A',
      };
    });

    const pageCount = count !== null ? Math.ceil(count / pageSize) : 0;

    return { complaints: mappedComplaints, pageCount, error: null };

  } catch (e: unknown) {
    console.error('Server Action Error (fetchComplaints - general catch):', e);
    const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
    return { complaints: [], pageCount: 0, error: message };
  }
}

export async function updateComplaintStatus(
    complaintId: string,
    newStatus: 'open' | 'in_progress' | 'escalated' | 'resolved' | 'closed' | 'rejected'
): Promise<{ success: boolean; error: string | null }> {
    const supabase = createAdminSupabaseClient();

    try {
        const { error } = await supabase
            .from('complaints')
            .update({ status: newStatus })
            .eq('id', complaintId);

        if (error) {
            console.error('Server Action Error (updateComplaintStatus):', error);
            return { success: false, error: error.message };
        }

        return { success: true, error: null };
    } catch (e: unknown) {
        console.error('Server Action Error (updateComplaintStatus - general catch):', e);
        const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
        return { success: false, error: message };
    }
}

export async function updateComplaintPriority(
    complaintId: string,
    newPriority: 'low' | 'medium' | 'high'
): Promise<{ success: boolean; error: string | null }> {
    const supabase = createAdminSupabaseClient();

    try {
        const { error } = await supabase
            .from('complaints')
            .update({ priority: newPriority })
            .eq('id', complaintId);

        if (error) {
            console.error('Server Action Error (updateComplaintPriority):', error);
            return { success: false, error: error.message };
        }

        return { success: true, error: null };
    } catch (e: unknown) {
        console.error('Server Action Error (updateComplaintPriority - general catch):', e);
        const message = e instanceof Error ? e.message : 'An unexpected error occurred.';
        return { success: false, error: message };
    }
}

export async function fetchComplaintDetails(complaintId: string) {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
        .from('complaints')
        .select('*, categories(name), complaint_updates(*)')
        .eq('id', complaintId)
        .single();
    
    if (error) {
        console.error("Error fetching complaint details:", error);
        return { success: false, data: null, error: error.message };
    }
    return { success: true, data, error: null };
}

export async function addComplaintUpdate({ complaintId, updateText }: { complaintId: string, updateText: string }) {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
        .from('complaint_updates')
        .insert({ complaint_id: complaintId, update_text: updateText })
        .select()
        .single();

    if (error) {
        return { success: false, message: error.message, data: null };
    }
    revalidatePath(`/complaints/${complaintId}`);
    return { success: true, message: 'Update berhasil ditambahkan.', data };
}

export async function changeComplaintStatus({ complaintId, status }: { complaintId: string, status: 'open' | 'in progress' | 'resolved' | 'closed' }) {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
        .from('complaints')
        .update({ status })
        .eq('id', complaintId)
        .select()
        .single();
    
    if (error) {
        return { success: false, message: error.message, data: null };
    }
    revalidatePath(`/complaints/${complaintId}`);
    revalidatePath('/complaints');
    return { success: true, message: `Status berhasil diubah menjadi ${status}.`, data };
}

export async function changeComplaintPriority({ complaintId, priority }: { complaintId: string, priority: 'low' | 'medium' | 'high' }) {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
        .from('complaints')
        .update({ priority })
        .eq('id', complaintId)
        .select()
        .single();
    
    if (error) {
        return { success: false, message: error.message, data: null };
    }
    revalidatePath(`/complaints/${complaintId}`);
    revalidatePath('/complaints');
    return { success: true, message: `Prioritas berhasil diubah menjadi ${priority}.`, data };
}

// This line explicitly marks the file as a module, fixing potential import errors.
export {}; 