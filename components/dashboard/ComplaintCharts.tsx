// components/dashboard/ComplaintChart.tsx
'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ComplaintChartProps {
  dailyCounts: { date: string; count: number }[];
}

export default function ComplaintChart({ dailyCounts }: ComplaintChartProps) {
  return (
    <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={dailyCounts}
            margin={{
              top: 5,
              right: 20,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => new Date(value).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              width={30}
            />
            <Tooltip
              contentStyle={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(5px)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              }}
              labelClassName="font-bold"
              wrapperClassName="!border-none"
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#1d4ed8"
              strokeWidth={2}
              fill="url(#colorUv)"
              name="Pengaduan"
            />
          </AreaChart>
        </ResponsiveContainer>
    </div>
  );
}