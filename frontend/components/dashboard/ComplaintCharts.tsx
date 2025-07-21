// components/dashboard/ComplaintChart.tsx
'use client';

import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { ComplaintRow } from './ComplaintsTable';

interface ComplaintChartProps {
    complaints: ComplaintRow[];
}

export default function ComplaintChart({ complaints }: ComplaintChartProps) {

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
        <div className="opacity-100">
            <Card className="premium-card">
                <CardHeader>
                    <CardTitle className="sophisticated-text">Pengaduan 7 Hari Terakhir</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="name"
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}`}
                            />
                            <Tooltip
                                cursor={{ stroke: 'hsl(var(--border))', strokeDasharray: '3 3' }}
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    backdropFilter: 'blur(8px)',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '0.75rem',
                                    color: 'hsl(var(--foreground))',
                                }}
                            />
                            <Area type="monotone" dataKey="total" stroke="hsl(var(--foreground))" fillOpacity={1} fill="url(#colorTotal)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}