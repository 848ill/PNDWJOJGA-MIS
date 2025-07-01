// app/(dashboard)/page.tsx
import { Suspense } from 'react';
import { createAdminSupabaseClient } from '@/lib/supabase/admin'; // Use server client for server components
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardSkeleton } from '@/components/ui/card';
import ComplaintChart from '@/components/dashboard/ComplaintCharts';
import { AiInsightsDisplay } from '@/components/dashboard/AiInsightsDisplay';
import { Activity, Users, LineChartIcon, BrainCircuitIcon } from 'lucide-react';
import DashboardMapWrapper from '@/components/dashboard/DashboardMapWrapper';
import { MapPlaceholder } from '@/components/dashboard/MapPlaceholder';
import { ComplaintRow } from '@/components/dashboard/ComplaintsTable';

// --- Data Fetching Functions (Server-Side) ---

async function getTotalComplaints() {
  const supabase = createAdminSupabaseClient();
  const { count, error } = await supabase.from('complaints').select('*', { count: 'exact', head: true });
  if (error) {
    console.error('Error fetching total complaints:', error);
    return 0;
  }
  return count ?? 0;
}

async function getWeeklyComplaints() {
    const supabase = createAdminSupabaseClient();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const { count, error } = await supabase
        .from('complaints')
        .select('*', { count: 'exact', head: true })
        .gte('submitted_at', sevenDaysAgo.toISOString());
    if (error) {
        console.error('Error fetching weekly complaints:', error);
        return 0;
    }
    return count ?? 0;
}

async function getRecentComplaintData() {
    const supabase = createAdminSupabaseClient();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const { data, error } = await supabase
        .from('complaints')
        .select('id, submitted_at, category_id, categories(name), latitude, longitude, main_topic, sentiment, ai_summary, ai_advice, ai_what_to_do, text_content, status, priority')
        .gte('submitted_at', sevenDaysAgo.toISOString())
        .order('submitted_at', { ascending: true });
    
    if (error) {
        console.error('Error fetching recent complaint details:', error);
        return { complaintsData: [], complaints: [], aiInsights: [] };
    }
    
    const complaintsData: ComplaintRow[] = (data || []).map(c => ({
        id: String(c.id),
        text_content: c.text_content || '',
        category_id: String(c.category_id),
        status: (c.status as ComplaintRow['status']) ?? 'open',
        priority: (c.priority as ComplaintRow['priority']) ?? 'medium',
        submitted_at: c.submitted_at,
        category_name: c.categories?.[0]?.name ?? 'N/A',
    }));
    
    const complaints = (data || [])
      .map((c) => {
        if (c.latitude !== null && c.longitude !== null) {
          return { 
            latitude: c.latitude, 
            longitude: c.longitude,
            id: String(c.id),
            category: c.categories?.[0]?.name ?? 'Belum Dikategorikan',
            priority: (c.priority as 'low' | 'medium' | 'high') ?? 'medium',
          };
        }
        return null;
      })
      .filter((l): l is { latitude: number; longitude: number; id: string; category: string; priority: 'low' | 'medium' | 'high'; } => l !== null);
      
    const aiInsights = (data || [])
      .filter(c => c.main_topic || c.ai_summary)
      .map((c) => ({
          id: String(c.id),
          mainTopic: c.main_topic,
          summary: c.ai_summary,
          advice: c.ai_advice,
          whatToDo: c.ai_what_to_do,
          sentiment: c.sentiment,
          categoryName: c.categories?.[0]?.name,
          title: c.main_topic || 'Wawasan AI',
      }));

    return { complaintsData, complaints, aiInsights };
}

// --- Wrapper Components with Suspense ---

async function TotalComplaintsCard() {
    const total = await getTotalComplaints();
    return (
        <Card variant="glass" className="animate-fade-in-up">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Total Pengaduan</CardTitle>
                <Activity className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-gray-900">{total.toLocaleString()}</div>
            </CardContent>
        </Card>
    );
}

async function WeeklyComplaintsCard() {
    const total = await getWeeklyComplaints();
    return (
        <Card variant="glass" className="animate-fade-in-up [animation-delay:100ms]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Baru Minggu Ini</CardTitle>
                <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-gray-900">{total.toLocaleString()}</div>
            </CardContent>
        </Card>
    );
}

async function MainDashboardContent() {
    const { complaintsData, complaints, aiInsights } = await getRecentComplaintData();
    return (
        <div className="space-y-8">
            {/* Map Section - Full Width */}
            <Suspense fallback={<Card variant="glass"><CardContent className="h-[460px]"><MapPlaceholder /></CardContent></Card>}>
                <DashboardMapWrapper complaints={complaints} />
            </Suspense>
            
            {/* Charts and AI Section - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
                <Card variant="glass" className="animate-fade-in-up [animation-delay:300ms]">
                    <CardHeader>
                        <CardTitle className="flex items-center text-gray-800">
                            <LineChartIcon className="mr-2 h-5 w-5" /> Pengaduan 7 Hari Terakhir
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ComplaintChart complaints={complaintsData} />
                    </CardContent>
                </Card>
                
                <Card variant="glass" className="animate-fade-in-up [animation-delay:400ms]">
                    <CardHeader>
                        <CardTitle className="flex items-center text-gray-800">
                            <BrainCircuitIcon className="mr-2 h-5 w-5" /> Wawasan Berbasis AI
                        </CardTitle>
                        <CardDescription>Analisis cerdas dari data pengaduan Anda.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px] overflow-y-auto">
                        <AiInsightsDisplay insights={aiInsights} isLoading={false} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// --- Main Page Component ---

export default function DashboardHomePage() {
  return (
    <div className="relative z-0 flex flex-1 flex-col gap-8 p-4 md:p-8">
        <div className="animate-fade-in-up">
            <h1 className="text-3xl font-bold tracking-tight text-gray-800">Dasbor</h1>
            <p className="text-gray-500 mt-1">Selamat datang kembali! Ini adalah ringkasan sistem Anda.</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Suspense fallback={<CardSkeleton />}>
                <TotalComplaintsCard />
            </Suspense>
            <Suspense fallback={<CardSkeleton />}>
                <WeeklyComplaintsCard />
            </Suspense>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:gap-8">
            <Suspense fallback={<DashboardContentSkeleton />}>
                <MainDashboardContent />
            </Suspense>
        </div>
    </div>
  );
}

// --- Skeleton Components ---

function DashboardContentSkeleton() {
    return (
        <>
            <Card>
                <CardHeader>
                    <div className="h-6 w-3/4 rounded-md bg-muted animate-pulse" />
                </CardHeader>
                <CardContent>
                    <div className="h-[200px] w-full bg-muted animate-pulse rounded-lg" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <div className="h-6 w-3/4 rounded-md bg-muted animate-pulse" />
                    <div className="mt-2 h-4 w-1/2 rounded-md bg-muted animate-pulse" />
                </CardHeader>
                <CardContent className="h-[400px] overflow-y-auto">
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-16 w-full rounded-md bg-muted animate-pulse" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </>
    );
}