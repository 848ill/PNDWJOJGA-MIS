'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

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
                            <Popup>
                                <div className="text-sm">
                                    <div className="font-semibold mb-1">Pengaduan #{complaint.id}</div>
                                    <div className="mb-1">
                                        <strong>Kategori:</strong> {complaint.category || 'N/A'}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <strong>Prioritas:</strong> 
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            complaint.priority === 'high' ? 'bg-red-100 text-red-800' : 
                                            complaint.priority === 'medium' ? 'bg-orange-100 text-orange-800' : 
                                            'bg-green-100 text-green-800'
                                        }`}>
                                            {getPriorityLabel(complaint.priority)}
                                        </span>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))
                ) : (
                    // Default marker when no data
                    <Marker position={center} icon={createPriorityIcon('medium')}>
                        <Popup>
                            <div className="text-sm text-gray-500">
                                Belum ada data pengaduan dengan koordinat yang valid
                            </div>
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
            
            {/* Improved Legend */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200 z-[1000] min-w-[140px]">
                <div className="text-sm font-semibold text-gray-800 mb-3 text-center">Prioritas Pengaduan</div>
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-red-500 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700 font-medium">Tinggi</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-orange-500 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700 font-medium">Sedang</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-green-500 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700 font-medium">Rendah</span>
                    </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-xs text-gray-500 text-center">
                        {validComplaints.length > 0 ? `${validComplaints.length} titik pengaduan` : 'Menunggu data...'}
                    </div>
                </div>
            </div>
        </div>
    );
}