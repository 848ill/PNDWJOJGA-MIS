'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { useEffect, useRef } from 'react';
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

const HeatmapLayer = ({ complaints }: { complaints: ComplaintMapProps['complaints'] }) => {
    const map = useMap();
    const heatLayerRef = useRef<L.Layer>();

    useEffect(() => {
        if (!map) return;

        const points = complaints
            .filter(c => c.latitude && c.longitude)
            .map(c => {
                // Set intensity based on priority
                let intensity = 0.3;
                switch (c.priority) {
                    case 'high':
                        intensity = 1.0;
                        break;
                    case 'medium':
                        intensity = 0.6;
                        break;
                    case 'low':
                        intensity = 0.3;
                        break;
                }
                return [c.latitude, c.longitude, intensity] as [number, number, number];
            }); 

        if (heatLayerRef.current) {
            map.removeLayer(heatLayerRef.current);
        }

        heatLayerRef.current = L.heatLayer(points, { 
            radius: 25,
            blur: 15,
            maxZoom: 18,
            gradient: {0.4: 'blue', 0.65: 'lime', 1: 'red'}
        }).addTo(map);

    }, [complaints, map]);

    return null;
};

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
    
    return (
        <div className="relative">
            <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}>
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                <HeatmapLayer complaints={validComplaints} />
                {validComplaints.map(complaint => (
                    <Marker 
                        key={complaint.id} 
                        position={[complaint.latitude, complaint.longitude]} 
                        icon={createPriorityIcon(complaint.priority)}
                    >
                        <Popup>
                            <strong>Pengaduan:</strong> {complaint.id}<br />
                            <strong>Kategori:</strong> {complaint.category || 'N/A'}<br />
                            <strong>Prioritas:</strong> <span style={{ 
                                color: complaint.priority === 'high' ? '#ef4444' : 
                                       complaint.priority === 'medium' ? '#f97316' : '#22c55e',
                                fontWeight: 'bold'
                            }}>
                                {getPriorityLabel(complaint.priority)}
                            </span>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
            
            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border z-[1000]">
                <div className="text-sm font-semibold mb-2 text-gray-700">Prioritas Pengaduan</div>
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-xs text-gray-600">Tinggi</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span className="text-xs text-gray-600">Sedang</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-xs text-gray-600">Rendah</span>
                    </div>
                </div>
            </div>
        </div>
    );
}