'use client';

import dynamic from 'next/dynamic';

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
  // Default center and zoom for Yogyakarta
  const defaultCenter: [number, number] = [-7.7956, 110.3695]; // Yogyakarta coordinates
  const defaultZoom = 12;

  // Add a fallback for the complaints prop
  const validComplaints = Array.isArray(complaints) ? complaints : [];

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border border-slate-200/50 bg-white shadow-sm">
      <ComplaintMap 
        complaints={validComplaints} 
        center={defaultCenter} 
        zoom={defaultZoom} 
      />
    </div>
  );
} 