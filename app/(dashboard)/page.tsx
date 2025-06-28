// app/(dashboard)/page.tsx
'use client';
import '../../app/globals.css';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type Database } from '@/lib/types/supabase';
import ComplaintChart from '@/components/dashboard/ComplaintCharts';
import AiInsightsDisplay from '@/components/dashboard/AiInsightsDisplay';
import { Activity, ArrowUpRight, CreditCard, DollarSign, Users } from 'lucide-react';

const ComplaintMap = dynamic(() => import('@/components/dashboard/ComplaintMap'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-muted animate-pulse rounded-lg" />,
});

export default function DashboardHomePage() {
  const supabase = createClient();

  const [totalComplaints, setTotalComplaints] = useState<number | null>(null);
  const [dailyCounts, setDailyCounts] = useState<{ date: string; count: number }[]>([]);
  const [complaintLocations, setComplaintLocations] = useState<{ lat: number; lng: number; intensity?: number }[]>([]);
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const { count: fetchedTotalComplaints, error: countError } = await supabase
        .from('complaints')
        .select('*', { count: 'exact' });

      if (countError) {
        console.error('Error fetching total complaints:', countError);
      } else {
        setTotalComplaints(fetchedTotalComplaints);
      }

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const { data: recentComplaintsData, error: recentError } = await supabase
        .from('complaints')
        .select('id, submitted_at, category_id, categories(name), latitude, longitude, main_topic, sentiment, ai_summary, ai_advice, ai_what_to_do')
        .gte('submitted_at', sevenDaysAgo.toISOString())
        .order('submitted_at', { ascending: true });

      if (recentError) {
        console.error('Error fetching recent complaints:', recentError);
      } else if (recentComplaintsData) {
        const countsMap = new Map<string, number>();
        recentComplaintsData.forEach((complaint: any) => {
          const date = new Date(complaint.submitted_at).toISOString().split('T')[0];
          countsMap.set(date, (countsMap.get(date) || 0) + 1);
        });
        const processedDailyCounts = Array.from(countsMap.entries())
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => a.date.localeCompare(b.date));
        setDailyCounts(processedDailyCounts);

        const locationsForMap = recentComplaintsData
          .filter(complaint => complaint.latitude !== null && complaint.longitude !== null)
          .map((complaint: any) => ({
            lat: complaint.latitude,
            lng: complaint.longitude,
          }));
        setComplaintLocations(locationsForMap);

        const insightsForDisplay = recentComplaintsData
            .filter(complaint => complaint.main_topic || complaint.ai_summary || complaint.ai_advice || complaint.ai_what_to_do)
            .map((complaint: any) => ({
                id: complaint.id,
                mainTopic: complaint.main_topic,
                summary: complaint.ai_summary,
                advice: complaint.ai_advice,
                whatToDo: complaint.ai_what_to_do,
                sentiment: complaint.sentiment,
                categoryName: complaint.categories?.name,
            }));
        setAiInsights(insightsForDisplay);
      }
      setLoading(false);
    }

    fetchData();
  }, [supabase]);


  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Complaints
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalComplaints ?? '...'}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              New This Week
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">125</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        {/* Add more cards if needed */}
      </div>
      <div className="grid grid-cols-1 gap-4 md:gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Complaint Hotspots</CardTitle>
            <CardDescription>
              Geospatial distribution of recent complaints.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] w-full p-0">
            <ComplaintMap complaintLocations={complaintLocations} />
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Complaints Over Last 7 Days</CardTitle>
            </CardHeader>
            <CardContent>
                <ComplaintChart dailyCounts={dailyCounts} />
            </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Insights</CardTitle>
            <CardDescription>
              Intelligent analysis of your complaint data.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] overflow-y-auto">
            <AiInsightsDisplay insights={aiInsights} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}