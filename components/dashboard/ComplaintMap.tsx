'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngExpression, Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { useEffect, useRef } from 'react';
import L from 'leaflet';

const customIcon = new Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41]
});

interface ComplaintMapProps {
    complaints: {
        id: string;
        latitude: number;
        longitude: number;
        category?: string;
    }[];
    center: LatLngExpression;
    zoom: number;
}

const HeatmapLayer = ({ complaints }: { complaints: ComplaintMapProps['complaints'] }) => {
    const map = useMap();
    const heatLayerRef = useRef<L.Layer>();

    useEffect(() => {
        if (!map) return;

        const points = complaints
            .filter(c => c.latitude && c.longitude)
            .map(c => [c.latitude, c.longitude, 0.5]); 

        if (heatLayerRef.current) {
            map.removeLayer(heatLayerRef.current);
        }

        heatLayerRef.current = (L as any).heatLayer(points, { 
            radius: 25,
            blur: 15,
            maxZoom: 18,
            gradient: {0.4: 'blue', 0.65: 'lime', 1: 'red'}
        }).addTo(map);

    }, [complaints, map]);

    return null;
};


export default function ComplaintMap({ complaints, center, zoom }: ComplaintMapProps) {
    const validComplaints = complaints.filter(c => c.latitude && c.longitude);

    if (typeof window === 'undefined') {
        return null;
    }
    
    return (
        <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}>
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            <HeatmapLayer complaints={validComplaints} />
            {validComplaints.map(complaint => (
                <Marker key={complaint.id} position={[complaint.latitude, complaint.longitude]} icon={customIcon}>
                    <Popup>
                        <strong>Pengaduan:</strong> {complaint.id}<br />
                        <strong>Kategori:</strong> {complaint.category || 'N/A'}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}