// app/(dashboard)/analytics/page.tsx
'use client';

import { useState, useEffect } from 'react';
// FIX: Corrected all relative paths to go up one more level
import { createClient } from '../../../lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { DateRangePicker } from '../../../components/ui/date-range-picker'; // Assumes you've added this component

// --- TYPE DEFINITIONS TO FIX ALL TYPESCRIPT ERRORS ---
type ComplaintData = {
  submitted_at: string;
  sentiment: string | null;
  categories: { name: string } | null;
};

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

  useEffect(() => {
    const fetchData = async () => {
      if (!dateRange?.from || !dateRange?.to) return;

      setLoading(true);

      const { data, error } = await supabase
        .from('complaints')
        .select('submitted_at, sentiment, categories (name)')
        .gte('submitted_at', dateRange.from.toISOString())
        .lte('submitted_at', dateRange.to.toISOString())
        .order('submitted_at', { ascending: true });

      if (error) {
        console.error("Error fetching analytics data:", error);
        setLoading(false);
        return;
      }
      
      const complaints: ComplaintData[] = data || [];

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
        const sentiment = complaint.sentiment || 'Neutral';
        acc[sentiment] = (acc[sentiment] || 0) + 1;
        return acc;
      }, {});
      const sentiments = Object.entries(sentimentCounts).map(([name, value]) => ({ name, value }));
      setSentimentData(sentiments);

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
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Analytics & Reports</h1>
        <DateRangePicker date={dateRange} onDateChange={setDateRange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Most Frequent Category</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{mostFrequentCategory}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Busiest Day</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{busiestDay}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Complaints Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" name="Complaints" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Complaints by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={100} interval={0} />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#82ca9d" name="Total Complaints" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={sentimentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {sentimentData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}