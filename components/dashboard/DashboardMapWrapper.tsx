'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapIcon } from 'lucide-react';

const ComplaintMap = dynamic(() => import('@/components/dashboard/ComplaintMap'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-muted animate-pulse rounded-lg" />,
});

interface DashboardMapProps {
  complaints: {
    id: string;
    latitude: number;
    longitude: number;
    category?: string;
    priority: 'low' | 'medium' | 'high';
  }[];
}

export default function DashboardMapWrapper({ complaints }: DashboardMapProps) {
  // Default center and zoom
  const defaultCenter: [number, number] = [-7.7956, 110.3695]; // Yogyakarta coordinates
  const defaultZoom = 12;

  // Add a fallback for the complaints prop
  const validComplaints = Array.isArray(complaints) ? complaints : [];

  return (
    <Card className="w-full" variant="glass">
      <CardHeader>
        <CardTitle className="flex items-center text-gray-800">
          <MapIcon className="mr-2 h-5 w-5" /> Titik Rawan Pengaduan
        </CardTitle>
        <CardDescription>Distribusi geospasial dari pengaduan terkini.</CardDescription>
      </CardHeader>
      <CardContent className="h-[400px] w-full p-0">
        <ComplaintMap 
          complaints={validComplaints} 
          center={defaultCenter} 
          zoom={defaultZoom} 
        />
      </CardContent>
    </Card>
  );
} 