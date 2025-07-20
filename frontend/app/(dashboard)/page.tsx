import { Suspense } from 'react';
import { createAdminSupabaseClient } from '@/lib/supabase/admin'; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardSkeleton } from '@/components/ui/card';
import ComplaintChart from '@/components/dashboard/ComplaintCharts';
import { AiInsightsDisplay } from '@/components/dashboard/AiInsightsDisplay';
import { Activity, Users, LineChartIcon, BrainCircuitIcon, Clock, TrendingUp } from 'lucide-react';
import DashboardMapWrapper from '@/components/dashboard/DashboardMapWrapper';
import { MapPlaceholder } from '@/components/dashboard/MapPlaceholder';
import { ComplaintRow } from '@/components/dashboard/ComplaintsTable';

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

async function getRecentComplaintData() { //page minta ke db buat ambil data pengaduan
    const supabase = createAdminSupabaseClient();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); // dari 7 hari terakhir = page.tsx ngirim query ke db supabase, setelah itu db ngirim data ke page.tsx
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
      
    const aiInsights = (data || []) //page.tsx bilang "filter yang punya AI analysis saja"
      .filter(c => c.main_topic || c.ai_summary)
      .map((c) => ({
          id: String(c.id),
          mainTopic: c.main_topic, //page.tsx bilang "ambil main topic, summary, advice, what to do, sentiment, category name, title"
          summary: c.ai_summary,
          advice: c.ai_advice,
          whatToDo: c.ai_what_to_do,
          sentiment: c.sentiment,
          categoryName: c.categories?.[0]?.name,
          title: c.main_topic || 'Wawasan AI',
      }));

    return { complaintsData, complaints, aiInsights };
}


async function TotalComplaintsCard() {
    const total = await getTotalComplaints();
    return (
        <Card className="executive-card group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-medium premium-text tracking-wide uppercase">
                    Total Pengaduan
                </CardTitle>
                <div className="p-2 bg-muted rounded-lg group-hover:bg-muted/80 transition-colors duration-200">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="text-3xl metric-number">{total.toLocaleString()}</div>
                <div className="text-xs premium-text mt-2">Seluruh pengaduan terdaftar</div>
                <div className="w-full bg-muted h-0.5 rounded-full mt-4">
                    <div className="w-full bg-foreground/20 h-0.5 rounded-full"></div>
                </div>
            </CardContent>
        </Card>
    );
}

async function WeeklyComplaintsCard() {
    const total = await getWeeklyComplaints();
    return (
        <Card className="executive-card group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-medium premium-text tracking-wide uppercase">
                    Aktivitas Terbaru
                </CardTitle>
                <div className="p-2 bg-muted rounded-lg group-hover:bg-muted/80 transition-colors duration-200">
                    <Users className="h-4 w-4 text-muted-foreground" />
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="text-3xl metric-number">{total.toLocaleString()}</div>
                <div className="text-xs premium-text mt-2">7 hari terakhir</div>
                <div className="w-full bg-muted h-0.5 rounded-full mt-4">
                    <div className="w-4/5 bg-foreground/20 h-0.5 rounded-full"></div>
                </div>
            </CardContent>
        </Card>
    );
}

async function ResolutionTimeCard() {
    // Mock data - replace with actual query
    const avgTime = "2.3";
    return (
        <Card className="executive-card group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-medium premium-text tracking-wide uppercase">
                    Rata-rata Penyelesaian
                </CardTitle>
                <div className="p-2 bg-muted rounded-lg group-hover:bg-muted/80 transition-colors duration-200">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="text-3xl metric-number">{avgTime} hari</div>
                <div className="text-xs premium-text mt-2">Waktu penyelesaian rata-rata</div>
                <div className="w-full bg-muted h-0.5 rounded-full mt-4">
                    <div className="w-3/5 bg-foreground/20 h-0.5 rounded-full"></div>
                </div>
            </CardContent>
        </Card>
    );
}

async function PerformanceCard() {
    // Mock data - replace with actual query
    const performance = "94.2";
    return (
        <Card className="executive-card group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-medium premium-text tracking-wide uppercase">
                    Kinerja Sistem
                </CardTitle>
                <div className="p-2 bg-muted rounded-lg group-hover:bg-muted/80 transition-colors duration-200">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="text-3xl metric-number">{performance}%</div>
                <div className="text-xs premium-text mt-2">Rating efisiensi keseluruhan</div>
                <div className="w-full bg-muted h-0.5 rounded-full mt-4">
                    <div className="w-5/6 bg-foreground/20 h-0.5 rounded-full"></div>
                </div>
            </CardContent>
        </Card>
    );
}

async function MainDashboardContent() {
    const { complaintsData, complaints, aiInsights } = await getRecentComplaintData();
    return (
        <div className="space-y-8">
            
            <Suspense fallback={
                <Card className="executive-card">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold sophisticated-text">Distribusi Geografis</CardTitle>
                        <CardDescription className="text-slate-600">Pemetaan pengaduan real-time dan analisis lokasi</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[460px] relative">
                        <div className="relative z-10">
                            <MapPlaceholder />
                        </div>
                    </CardContent>
                </Card>
            }>
                <Card className="executive-card">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold sophisticated-text">Distribusi Geografis</CardTitle>
                        <CardDescription className="text-slate-600">Pemetaan pengaduan real-time dan analisis lokasi</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[460px] relative p-0 overflow-hidden">
                        <DashboardMapWrapper complaints={complaints} />
                    </CardContent>
                </Card>
            </Suspense>
            
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="executive-card">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center sophisticated-text font-semibold">
                            <LineChartIcon className="mr-3 h-5 w-5 text-slate-600" /> 
                            Analisis Tren
                        </CardTitle>
                        <CardDescription className="text-slate-600">
                            Volume dan pola pengaduan mingguan
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <ComplaintChart complaints={complaintsData} />
                    </CardContent>
                </Card>
                
                <Card className="executive-card"> 
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center sophisticated-text font-semibold">
                            <BrainCircuitIcon className="mr-3 h-5 w-5 text-slate-600" /> 
                            Laporan Analitik
                        </CardTitle>
                        <CardDescription className="text-slate-600">
                            Wawasan dan rekomendasi berbasis AI
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px] overflow-y-auto pt-0"> 
                        <AiInsightsDisplay insights={aiInsights} isLoading={false} />
                    </CardContent> 
                </Card>
            </div>
        </div>
    );
}
// di line 157 page bilang " nih data-nya tolong analysis" dari sini page.tsx lempar data ke AiInsightsDisplay component

export default function DashboardHomePage() {
  return (
    <div className="relative z-0 flex flex-1 flex-col gap-10 p-6 md:p-10">
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight sophisticated-text">
                    Dasbor Eksekutif
                </h1>
                <p className="premium-text">
                    Ringkasan sistem manajemen pengaduan masyarakat DIY
                </p>
            </div>
            <div className="h-px bg-border"></div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-6">
            <Suspense fallback={<CardSkeleton />}>
                <TotalComplaintsCard />
            </Suspense>
            <Suspense fallback={<CardSkeleton />}>
                <WeeklyComplaintsCard />
            </Suspense>
            <Suspense fallback={<CardSkeleton />}>
                <ResolutionTimeCard />
            </Suspense>
            <Suspense fallback={<CardSkeleton />}>
                <PerformanceCard />
            </Suspense>
        </div>

        <div className="mt-10 space-y-8">
            <Suspense fallback={<DashboardContentSkeleton />}>
                <MainDashboardContent />
            </Suspense>
        </div>
    </div>
  );
}



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