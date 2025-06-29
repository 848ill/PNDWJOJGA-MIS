'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapIcon } from 'lucide-react';

const ComplaintMap = dynamic(() => import('@/components/dashboard/ComplaintMap'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-muted animate-pulse rounded-lg" />,
});

interface DashboardMapWrapperProps {
  complaintLocations: { lat: number; lng: number; intensity?: number }[];
}

export default function DashboardMapWrapper({ complaintLocations }: DashboardMapWrapperProps) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapIcon className="mr-2 h-5 w-5" /> Titik Rawan Pengaduan
        </CardTitle>
        <CardDescription>Distribusi geospasial dari pengaduan terkini.</CardDescription>
      </CardHeader>
      <CardContent className="h-[400px] w-full p-0">
        <ComplaintMap complaintLocations={complaintLocations} />
      </CardContent>
    </Card>
  );
} 