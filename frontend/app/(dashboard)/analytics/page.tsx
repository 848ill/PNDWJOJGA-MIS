// app/(dashboard)/analytics/page.tsx
'use client';

import { useState, useEffect } from 'react';
// FIX: Corrected all relative paths to go up one more level
import { createClient } from '@/lib/supabase/client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardSkeleton,
} from '../../../components/ui/card';
import { type DateRange } from 'react-day-picker';
import { subDays, format, parseISO } from 'date-fns';
import { DateRangePicker } from '../../../components/ui/date-range-picker';
import { Skeleton } from '@/components/ui/skeleton';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

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



const GRADIENT_COLORS = {
  Positive: ['#10b981', '#059669'], // Emerald gradient
  Negative: ['#f43f5e', '#e11d48'], // Rose gradient
  Neutral: ['#f59e0b', '#d97706'],  // Amber gradient
};
// ---------------------------------------------------------





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
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickLine={{ stroke: '#cbd5e1' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] w-full bg-muted/30 rounded-lg border border-border flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="text-lg text-slate-700">Belum ada data untuk periode ini</div>
                <div className="text-sm text-slate-500">Silakan pilih rentang tanggal yang berbeda</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <Card variant="glass" className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Pengaduan per Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickLine={{ stroke: '#cbd5e1' }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickLine={{ stroke: '#cbd5e1' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="total" 
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] w-full bg-muted/30 rounded-lg border border-border flex items-center justify-center">
                <div className="text-center space-y-3">
                  <div className="text-lg text-slate-700">Belum ada data kategori</div>
                  <div className="text-sm text-slate-500">Data akan muncul setelah ada pengaduan</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card variant="glass" className="lg:col-span-2 bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 backdrop-blur-xl border border-white/20 shadow-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              📊 Analisis Sentimen
            </CardTitle>
            <div className="text-sm text-slate-600 font-medium">Distribusi emosi pengaduan masyarakat</div>
          </CardHeader>
          <CardContent className="pt-4">
            {sentimentData.length > 0 ? (
              <div className="space-y-6">
                {/* Header Stats */}
                <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100/50 shadow-inner">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                    {totalComplaintsInPeriod}
                  </div>
                  <div className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Total Pengaduan</div>
                  <div className="text-xs text-slate-500 mt-1">Periode yang dipilih</div>
                </div>

                {/* Chart Section */}
                <div className="relative">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <defs>
                        <linearGradient id="positiveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                        <linearGradient id="negativeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#f43f5e" />
                          <stop offset="100%" stopColor="#e11d48" />
                        </linearGradient>
                        <linearGradient id="neutralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#f59e0b" />
                          <stop offset="100%" stopColor="#d97706" />
                        </linearGradient>
                      </defs>
                      <Pie
                        data={sentimentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={85}
                        innerRadius={35}
                        fill="#8884d8"
                        dataKey="value"
                        onMouseEnter={(data) => setActiveSlice(data)}
                        onMouseLeave={() => setActiveSlice(null)}
                        animationBegin={0}
                        animationDuration={1000}
                      >
                        {sentimentData.map((entry, index) => {
                          const gradientId = entry.name === 'Positive' ? 'positiveGradient' : 
                                           entry.name === 'Negative' ? 'negativeGradient' : 'neutralGradient';
                          return (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={`url(#${gradientId})`}
                              stroke={activeSlice?.name === entry.name ? '#1e293b' : '#ffffff'}
                              strokeWidth={activeSlice?.name === entry.name ? 3 : 2}
                              style={{
                                filter: activeSlice?.name === entry.name ? 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))' : 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
                                transform: activeSlice?.name === entry.name ? 'scale(1.05)' : 'scale(1)',
                                transformOrigin: 'center',
                                transition: 'all 0.3s ease'
                              }}
                            />
                          );
                        })}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                          backdropFilter: 'blur(16px)',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}
                        formatter={(value: number, name: string) => [
                          `${value} pengaduan (${((value / totalComplaintsInPeriod) * 100).toFixed(1)}%)`,
                          name
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                                 {/* Premium Legend */}
                 <div className="grid grid-cols-1 gap-3 mt-6">
                   {sentimentData.map((entry) => {
                     const percentage = ((entry.value / totalComplaintsInPeriod) * 100).toFixed(1);
                     const isActive = activeSlice?.name === entry.name;
                     
                     return (
                       <div 
                         key={entry.name}
                         className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                           isActive 
                             ? 'bg-gradient-to-r from-slate-50 to-blue-50 border-2 border-blue-200 shadow-lg transform scale-105' 
                             : 'bg-white/60 border border-slate-200/50 hover:bg-slate-50/80 hover:border-slate-300/50 hover:shadow-md'
                         }`}
                         onMouseEnter={() => setActiveSlice(entry)}
                         onMouseLeave={() => setActiveSlice(null)}
                       >
                         <div className="flex items-center space-x-3">
                           <div className="flex items-center space-x-3">
                             <div 
                               className="w-5 h-5 rounded-full shadow-inner border border-white/50"
                               style={{ 
                                 background: `linear-gradient(135deg, ${GRADIENT_COLORS[entry.name as keyof typeof GRADIENT_COLORS]?.[0] || '#8884d8'}, ${GRADIENT_COLORS[entry.name as keyof typeof GRADIENT_COLORS]?.[1] || '#8884d8'})`
                               }}
                             />
                             <div>
                               <div className="font-semibold text-slate-800">{entry.name}</div>
                               <div className="text-xs text-slate-500">Sentimen pengaduan</div>
                             </div>
                           </div>
                         </div>
                         <div className="text-right">
                           <div className="font-bold text-lg text-slate-800">{entry.value}</div>
                           <div className="text-sm font-medium text-slate-600">{percentage}%</div>
                         </div>
                       </div>
                     );
                   })}
                 </div>
              </div>
            ) : (
              <div className="h-[400px] w-full bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border border-slate-200/50 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="text-6xl">📊</div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-slate-700 to-slate-500 bg-clip-text text-transparent">
                    {totalComplaintsInPeriod}
                  </div>
                  <div className="text-lg font-semibold text-slate-700">Total Pengaduan</div>
                  <div className="text-sm text-slate-500 max-w-xs">
                    {totalComplaintsInPeriod === 0 ? 'Belum ada data sentimen untuk periode ini' : 'Data sentimen sedang dianalisis dengan AI'}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}