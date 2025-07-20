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

  // If no complaints with location data, show placeholder instead of loading heavy map
  if (validComplaints.length === 0) {
    return (
      <div className="h-full w-full rounded-xl overflow-hidden border border-slate-200/50 bg-white shadow-sm flex items-center justify-center">
        <div className="text-center p-8 text-gray-500">
          <div className="text-sm font-medium">Belum Ada Data Pengaduan</div>
          <div className="text-xs mt-1">Saat ini belum ada pengaduan dengan koordinat lokasi yang valid untuk ditampilkan di peta distribusi geografis.</div>
        </div>
      </div>
    );
  }

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