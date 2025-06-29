'use server';

import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import { type ComplaintRow } from '@/components/dashboard/ComplaintsTable';
import { revalidatePath } from 'next/cache';

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
        query = query.textSearch('description', queryText, { type: 'websearch' });
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

    const mappedComplaints: ComplaintRow[] = (data || []).map((complaint: any) => ({
      id: String(complaint.id),
      text_content: complaint.description || '',
      category_id: String(complaint.category_id),
      status: complaint.status ?? 'open',
      priority: complaint.priority ?? 'medium',
      submitted_at: complaint.submitted_at,
      main_topic: complaint.main_topic || null,
      sentiment: complaint.sentiment || null,
      category_name: complaint.categories?.name || 'N/A',
    }));

    const pageCount = count !== null ? Math.ceil(count / pageSize) : 0;

    return { complaints: mappedComplaints, pageCount, error: null };

  } catch (e: any) {
    console.error('Server Action Error (fetchComplaints - general catch):', e);
    return { complaints: [], pageCount: 0, error: e.message || 'An unexpected error occurred.' };
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
    } catch (e: any) {
        console.error('Server Action Error (updateComplaintStatus - general catch):', e);
        return { success: false, error: e.message || 'An unexpected error occurred.' };
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
    } catch (e: any) {
        console.error('Server Action Error (updateComplaintPriority - general catch):', e);
        return { success: false, error: e.message || 'An unexpected error occurred.' };
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