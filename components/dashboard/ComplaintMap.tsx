'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import { Globe } from 'lucide-react';

// Create different colored icons for different priorities
const createPriorityIcon = (priority: 'low' | 'medium' | 'high') => {
    let iconUrl = '';
    
    switch (priority) {
        case 'high':
            iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png';
            break;
        case 'medium':
            iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png';
            break;
        case 'low':
            iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png';
            break;
        default:
            iconUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png';
    }
    
    return new L.Icon({
        iconUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        shadowSize: [41, 41]
    });
};

interface ComplaintMapProps {
    complaints: {
        id: string;
        latitude: number;
        longitude: number;
        category?: string;
        priority: 'low' | 'medium' | 'high';
    }[];
    center: L.LatLngExpression;
    zoom: number;
}

// Helper function to get priority label in Indonesian
const getPriorityLabel = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
        case 'high':
            return 'Tinggi';
        case 'medium':
            return 'Sedang';
        case 'low':
            return 'Rendah';
        default:
            return 'Tidak Diketahui';
    }
};

export default function ComplaintMap({ complaints, center, zoom }: ComplaintMapProps) {
    const validComplaints = complaints.filter(c => c.latitude && c.longitude);

    if (typeof window === 'undefined') {
        return null;
    }

    // Debug log
    console.log('ComplaintMap rendering:', { 
        totalComplaints: complaints.length, 
        validComplaints: validComplaints.length,
        sampleComplaint: validComplaints[0] 
    });
    
    return (
        <div className="relative h-full w-full">
            <MapContainer 
                center={center} 
                zoom={zoom} 
                scrollWheelZoom={false} 
                style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
                className="z-0"
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                {validComplaints.length > 0 ? (
                    validComplaints.map(complaint => (
                        <Marker 
                            key={complaint.id} 
                            position={[complaint.latitude, complaint.longitude]} 
                            icon={createPriorityIcon(complaint.priority)}
                        >
                            <Popup className="custom-popup">
                                <div className="text-sm min-w-[200px]">
                                    {/* Header */}
                                    <div className="border-b border-slate-200 pb-2 mb-3">
                                        <div className="font-semibold text-slate-800">Pengaduan #{complaint.id}</div>
                                        <div className="text-xs text-slate-500 mt-1">Lokasi koordinat</div>
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-start">
                                            <span className="text-xs text-slate-600 font-medium">Kategori:</span>
                                            <span className="text-xs text-slate-800 font-medium max-w-[120px] text-right">
                                                {complaint.category || 'Belum dikategorikan'}
                                            </span>
                                        </div>
                                        
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-slate-600 font-medium">Prioritas:</span>
                                            <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                                                complaint.priority === 'high' ? 'bg-red-100 text-red-800 border border-red-200' : 
                                                complaint.priority === 'medium' ? 'bg-orange-100 text-orange-800 border border-orange-200' : 
                                                'bg-green-100 text-green-800 border border-green-200'
                                            }`}>
                                                {getPriorityLabel(complaint.priority)}
                                            </span>
                                        </div>
                                        
                                        <div className="flex justify-between items-start">
                                            <span className="text-xs text-slate-600 font-medium">Koordinat:</span>
                                            <span className="text-xs text-slate-500 font-mono text-right">
                                                {complaint.latitude.toFixed(4)}, {complaint.longitude.toFixed(4)}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Footer */}
                                    <div className="mt-3 pt-2 border-t border-slate-200">
                                        <div className="text-xs text-slate-500 text-center">
                                            📍 Daerah Istimewa Yogyakarta
                                        </div>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))
                ) : null}
            </MapContainer>

            {/* No Data Overlay */}
            {validComplaints.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl z-[999]">
                    <div className="text-center p-8 max-w-sm">
                        <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                            <Globe className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-sm font-semibold text-slate-800 mb-2">
                            Belum Ada Data Pengaduan
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            Saat ini belum ada pengaduan dengan koordinat lokasi yang valid untuk ditampilkan di peta distribusi geografis.
                        </p>
                        <div className="mt-4 text-xs text-slate-500">
                            📍 Daerah Istimewa Yogyakarta
                        </div>
                    </div>
                </div>
            )}
            
            {/* Premium Executive-level Legend */}
            <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-xl rounded-lg p-4 shadow-lg border border-border z-[1000] min-w-[160px]">
                <div className="space-y-3">
                    <div className="text-xs font-semibold sophisticated-text uppercase tracking-wide text-center">
                        Tingkat Prioritas
                    </div>
                    
                    <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-foreground flex-shrink-0"></div>
                                <span className="text-xs font-medium sophisticated-text">Tinggi</span>
                            </div>
                            <span className="text-xs premium-text font-mono">
                                {validComplaints.filter(c => c.priority === 'high').length}
                            </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-muted-foreground flex-shrink-0"></div>
                                <span className="text-xs font-medium sophisticated-text">Sedang</span>
                            </div>
                            <span className="text-xs premium-text font-mono">
                                {validComplaints.filter(c => c.priority === 'medium').length}
                            </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-muted-foreground/50 flex-shrink-0"></div>
                                <span className="text-xs font-medium sophisticated-text">Rendah</span>
                            </div>
                            <span className="text-xs premium-text font-mono">
                                {validComplaints.filter(c => c.priority === 'low').length}
                            </span>
                        </div>
                    </div>
                    
                    <div className="pt-2 border-t border-border">
                        <div className="text-xs premium-text text-center font-medium">
                            Total: <span className="font-mono">{validComplaints.length}</span> pengaduan
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Map Info Panel */}
            <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-xl rounded-lg p-3 shadow-lg border border-border z-[1000]">
                <div className="text-xs sophisticated-text font-medium">
                    📍 Daerah Istimewa Yogyakarta
                </div>
                <div className="text-xs premium-text mt-1">
                    Real-time monitoring
                </div>
            </div>
        </div>
    );
}