// app/(dashboard)/analytics/page.tsx
'use client';

import { useState, useEffect } from 'react';
// FIX: Corrected all relative paths to go up one more level
import { createClient } from '../../../lib/supabase/client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardSkeleton,
} from '../../../components/ui/card';
import { type DateRange } from 'react-day-picker';
import { subDays, format, parseISO } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ReferenceLine,
  LabelList
} from 'recharts';
import { DateRangePicker } from '../../../components/ui/date-range-picker';
import { Skeleton } from '@/components/ui/skeleton';
import { ValueType } from 'recharts/types/component/DefaultTooltipContent';

// --- TYPE DEFINITIONS TO FIX ALL TYPESCRIPT ERRORS ---


interface TrendData {
  date: string;
  count: number;
}

interface CategoryData {
  name: string;
  total: number;
}

interface SentimentData {
  name: string;
  value: number;
}

const COLORS = {
  Positive: '#22c55e',
  Negative: '#ef4444',
  Neutral: '#f97316',
};
// ---------------------------------------------------------

interface LegendPayload {
  value: string;
  color: string;
}

// Custom Legend Component
const CustomLegend = ({ payload }: { payload?: LegendPayload[] }) => {
  if (!payload) return null;
  return (
    <div className="flex justify-center space-x-4 mt-4">
      {payload.map((entry, index) => (
        <div key={`item-${index}`} className="flex items-center space-x-2 cursor-pointer">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-xs text-gray-500">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

// Skeleton Component for Analytics Page
function AnalyticsSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-8 p-4 md:p-8">
      <div className="flex justify-between items-center">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-10 w-72" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <CardSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });

  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [mostFrequentCategory, setMostFrequentCategory] = useState<string>('N/A');
  const [busiestDay, setBusiestDay] = useState<string>('N/A');
  const [dominantSentiment, setDominantSentiment] = useState<string>('N/A');
  const [activeSlice, setActiveSlice] = useState<{ name: string; value: number; } | null>(null);

  const totalComplaintsInPeriod = trendData.reduce((sum, day) => sum + day.count, 0);
  const averageComplaints = trendData.length > 0 ? totalComplaintsInPeriod / trendData.length : 0;

  useEffect(() => {
    const fetchData = async () => {
      if (!dateRange?.from || !dateRange?.to) return;

      setLoading(true);

      const { data, error } = await supabase
        .from('complaints')
        .select(`
          submitted_at,
          sentiment,
          categories!inner (
            name
          )
        `)
        .gte('submitted_at', dateRange.from.toISOString())
        .lte('submitted_at', dateRange.to.toISOString())
        .order('submitted_at', { ascending: true });

      if (error) {
        console.error("Error fetching analytics data:", error);
        setLoading(false);
        return;
      }
      
      const complaints = (data || []) as unknown as Array<{
        submitted_at: string;
        sentiment: string | null;
        categories: { name: string } | null;
      }>;

      // Process Trend Data
      const dailyCounts = complaints.reduce((acc: Record<string, number>, complaint) => {
        const date = format(parseISO(complaint.submitted_at), 'MMM dd');
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
      const trend = Object.entries(dailyCounts).map(([date, count]) => ({ date, count }));
      setTrendData(trend);
      
      // Process Category Data
      const categoryCounts = complaints.reduce((acc: Record<string, number>, complaint) => {
        const categoryName = complaint.categories?.name || 'Uncategorized';
        acc[categoryName] = (acc[categoryName] || 0) + 1;
        return acc;
      }, {});
      const categories = Object.entries(categoryCounts).map(([name, total]) => ({ name, total }));
      setCategoryData(categories);

      // Process Sentiment Data
      const sentimentCounts = complaints.reduce((acc: Record<string, number>, complaint) => {
        let sentiment = complaint.sentiment || 'Neutral';
        // Capitalize first letter to match COLORS keys and normalize data
        sentiment = sentiment.charAt(0).toUpperCase() + sentiment.slice(1);
        acc[sentiment] = (acc[sentiment] || 0) + 1;
        return acc;
      }, {});
      const sentiments = Object.entries(sentimentCounts).map(([name, value]) => ({ name, value }));
      setSentimentData(sentiments);

      if (sentiments.length > 0) {
        const topSentiment = sentiments.reduce((max, s) => (s.value > max.value ? s : max));
        setDominantSentiment(topSentiment.name);
      } else {
        setDominantSentiment('N/A');
      }

      // Calculate Key Stats
      if (categories.length > 0) {
        const topCategory = categories.reduce((max, cat) => (cat.total > max.total ? cat : max));
        setMostFrequentCategory(topCategory.name);
      } else {
        setMostFrequentCategory('N/A');
      }

      if (trend.length > 0) {
        const topDay = trend.reduce((max, day) => (day.count > max.count ? day : max));
        setBusiestDay(topDay.date);
      } else {
        setBusiestDay('N/A');
      }
      
      setLoading(false);
    };

    fetchData();
  }, [dateRange, supabase]);

  if (loading) {
    return <AnalyticsSkeleton />;
  }

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 md:p-8 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Analitik & Laporan</h1>
            <p className="text-gray-500 mt-1">Visualisasi data pengaduan dalam rentang waktu yang dipilih.</p>
        </div>
        <DateRangePicker date={dateRange} onDateChange={setDateRange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card variant="glass">
          <CardHeader>
            <CardTitle>Kategori Paling Sering</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{mostFrequentCategory}</p>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardHeader>
            <CardTitle>Hari Paling Sibuk</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{busiestDay}</p>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardHeader>
            <CardTitle>Sentimen Dominan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{dominantSentiment}</p>
          </CardContent>
        </Card>
      </div>

      <Card variant="glass">
        <CardHeader>
          <CardTitle>Tren Pengaduan</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(5px)',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(230, 230, 230, 0.5)',
                }}
              />
              <Legend />
              <ReferenceLine y={averageComplaints} label={{ value: 'Rata-rata', position: 'insideTopLeft', fill: '#71717a' }} stroke="#a1a1aa" strokeDasharray="3 3" />
              <Area type="monotone" dataKey="count" stroke="#1d4ed8" strokeWidth={2} fill="url(#colorCount)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <Card variant="glass" className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Pengaduan per Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
               <BarChart 
                data={categoryData.sort((a, b) => a.total - b.total)} 
                layout="vertical" 
                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
               >
                <defs>
                  <linearGradient id="colorCategory" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#6b7280" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  width={120}
                  interval={0}
                />
                <Tooltip 
                  cursor={{fill: 'rgba(239, 246, 255, 0.5)'}} 
                  contentStyle={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(5px)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '0.75rem',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                  }}
                  labelStyle={{ fontWeight: 'bold', color: '#1f2937' }}
                  formatter={(value: ValueType) => [`${value}`, 'Total']}
                />
                <Bar dataKey="total" fill="url(#colorCategory)" radius={[0, 4, 4, 0]}>
                   <LabelList dataKey="total" position="right" style={{ fill: "#1f2937", fontSize: '12px' }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card variant="glass" className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Analisis Sentimen</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  innerRadius={80}
                  outerRadius={110}
                  fill="#8884d8"
                  dataKey="value"
                  onMouseEnter={(_, index) => setActiveSlice(sentimentData[index])}
                  onMouseLeave={() => setActiveSlice(null)}
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} className="focus:outline-none" />
                  ))}
                </Pie>
                <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" className="fill-gray-900 text-3xl font-bold">
                  {activeSlice ? activeSlice.value : totalComplaintsInPeriod}
                </text>
                <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" className="fill-gray-600 text-sm">
                  {activeSlice ? activeSlice.name : 'Total Pengaduan'}
                </text>
                <CustomLegend payload={Object.entries(COLORS).map(([name, color]) => ({ value: name, color }))} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}