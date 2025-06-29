// app/(dashboard)/page.tsx
import { Suspense } from 'react';
import { createAdminSupabaseClient } from '@/lib/supabase/admin'; // Use server client for server components
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardSkeleton } from '@/components/ui/card';
import ComplaintChart from '@/components/dashboard/ComplaintCharts';
import AiInsightsDisplay from '@/components/dashboard/AiInsightsDisplay';
import { Activity, ArrowUpRight, CreditCard, DollarSign, Users, MapIcon, LineChartIcon, BrainCircuitIcon } from 'lucide-react';
import DashboardMapWrapper from '@/components/dashboard/DashboardMapWrapper';

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
        .select('id, submitted_at, category_id, categories(name), latitude, longitude, main_topic, sentiment, ai_summary, ai_advice, ai_what_to_do')
        .gte('submitted_at', sevenDaysAgo.toISOString())
        .order('submitted_at', { ascending: true });
    
    if (error) {
        console.error('Error fetching recent complaint details:', error);
        return { dailyCounts: [], complaintLocations: [], aiInsights: [] };
    }
    
    const countsMap = new Map<string, number>();
    (data || []).forEach((complaint) => {
      const date = new Date(complaint.submitted_at).toISOString().split('T')[0];
      countsMap.set(date, (countsMap.get(date) || 0) + 1);
    });
    const dailyCounts = Array.from(countsMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const complaintLocations = (data || [])
      .map((c) => {
        if (c.latitude !== null && c.longitude !== null) {
          return { lat: c.latitude, lng: c.longitude };
        }
        return null;
      })
      .filter((l): l is { lat: number; lng: number } => l !== null);
      
    const aiInsights = (data || [])
      .filter(c => c.main_topic || c.ai_summary)
      .map((c) => ({
          id: c.id,
          mainTopic: c.main_topic,
          summary: c.ai_summary,
          advice: c.ai_advice,
          whatToDo: c.ai_what_to_do,
          sentiment: c.sentiment,
          categoryName: c.categories?.[0]?.name,
      }));

    return { dailyCounts, complaintLocations, aiInsights };
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
    const { dailyCounts, complaintLocations, aiInsights } = await getRecentComplaintData();
    return (
        <div className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-2 animate-fade-in-up [animation-delay:300ms]">
            <DashboardMapWrapper complaintLocations={complaintLocations} />
            <Card variant="glass">
                <CardHeader>
                    <CardTitle className="flex items-center text-gray-800"><LineChartIcon className="mr-2 h-5 w-5" /> Pengaduan 7 Hari Terakhir</CardTitle>
                </CardHeader>
                <CardContent>
                    <ComplaintChart dailyCounts={dailyCounts} />
                </CardContent>
            </Card>
            <Card variant="glass">
                <CardHeader>
                    <CardTitle className="flex items-center text-gray-800"><BrainCircuitIcon className="mr-2 h-5 w-5" /> Wawasan Berbasis AI</CardTitle>
                    <CardDescription>Analisis cerdas dari data pengaduan Anda.</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] overflow-y-auto">
                    <AiInsightsDisplay insights={aiInsights} />
                </CardContent>
            </Card>
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

        <div className="mt-8">
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
        <div className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-2">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <div className="h-6 w-48 rounded-md bg-muted animate-pulse" />
                    <div className="mt-2 h-4 w-64 rounded-md bg-muted animate-pulse" />
                </CardHeader>
                <CardContent className="h-[400px] w-full p-0">
                    <div className="h-full w-full bg-muted animate-pulse rounded-b-lg" />
                </CardContent>
            </Card>
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
        </div>
    );
}