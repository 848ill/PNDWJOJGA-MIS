// components/dashboard/ComplaintChart.tsx
'use client';

import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MotionDiv } from '@/components/shared/MotionDiv';
import { useTheme } from 'next-themes';
import { ComplaintRow } from './ComplaintsTable';

interface ComplaintChartProps {
    complaints: ComplaintRow[];
}

export default function ComplaintChart({ complaints }: ComplaintChartProps) {
    const { theme } = useTheme();

    const trendData = complaints.reduce((acc: { [key: string]: number }, complaint) => {
        const date = new Date(complaint.submitted_at).toLocaleDateString('en-CA'); // YYYY-MM-DD
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});

    const chartData = Object.entries(trendData)
        .map(([date, count]) => ({
            date: new Date(date),
            name: new Date(date).toLocaleDateString('id-ID', { weekday: 'short' }),
            total: count,
        }))
        .sort((a, b) => a.date.getTime() - b.date.getTime());

    return (
        <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <Card variant="glass">
                <CardHeader>
                    <CardTitle>Pengaduan 7 Hari Terakhir</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="name"
                                stroke={theme === 'dark' ? '#a1a1aa' : '#374151'}
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke={theme === 'dark' ? '#a1a1aa' : '#374151'}
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}`}
                            />
                            <Tooltip
                                cursor={{ stroke: theme === 'dark' ? '#a1a1aa' : '#374151', strokeDasharray: '3 3' }}
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                    backdropFilter: 'blur(5px)',
                                    border: '1px solid rgba(0, 0, 0, 0.1)',
                                    borderRadius: '0.75rem',
                                }}
                            />
                            <Area type="monotone" dataKey="total" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTotal)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </MotionDiv>
    );
}