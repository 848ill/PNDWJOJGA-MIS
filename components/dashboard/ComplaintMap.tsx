'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat'; // Import leaflet.heat plugin
import 'react-leaflet-cluster/lib/assets/MarkerCluster.css';
import 'react-leaflet-cluster/lib/assets/MarkerCluster.Default.css';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';

// Custom Icon
const customIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
});

// Define the exact type expected by leaflet.heat
type HeatLatLngTuple = [number, number, number];

interface Complaint {
    lat: number;
    lng: number;
    id: string;
    category: string;
    summary: string;
    intensity?: number;
}

interface ComplaintMapProps {
  complaintLocations: Complaint[];
}

function HeatmapLayer({ complaintLocations }: { complaintLocations: Complaint[] }) {
  const map = useMap();
  const heatLayerRef = useRef<L.HeatLayer | null>(null);

  useEffect(() => {
    const validLocations = complaintLocations.filter(
      loc => typeof loc.lat === 'number' && typeof loc.lng === 'number' && !isNaN(loc.lat) && !isNaN(loc.lng)
    );
    
    const latLngs: HeatLatLngTuple[] = validLocations.map(loc => [loc.lat, loc.lng, loc.intensity || 0.5]);

    if (map) {
      if (latLngs.length > 0) {
        if (!heatLayerRef.current) {
          heatLayerRef.current = (L as any).heatLayer(latLngs, {
            radius: 25,
            blur: 15,
            maxZoom: 17,
            minOpacity: 0.4,
            gradient: { 0.4: '#a7ddff', 0.65: '#3b82f6', 1: '#1d4ed8' } // Premium blue gradient
          });
          heatLayerRef.current!.addTo(map);
        } else {
          heatLayerRef.current!.setLatLngs(latLngs);
        }
        // No need to call invalidateSize here unless the map container size changes dynamically
      } else {
        if (heatLayerRef.current) {
          map.removeLayer(heatLayerRef.current);
          heatLayerRef.current = null;
        }
      }
    }

    return () => {
      if (map && heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
    };
  }, [map, complaintLocations]);

  return null;
}

function MarkersLayer({ complaintLocations }: { complaintLocations: Complaint[] }) {
    return (
        <MarkerClusterGroup chunkedLoading>
            {complaintLocations.map((loc) => (
                <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={customIcon}>
                    <Popup>
                        <div className="font-sans w-64">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold text-base pr-2">{loc.category}</h3>
                                <span className="text-xs font-mono bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-md">
                                    {loc.id.substring(0, 8)}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600">{loc.summary}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MarkerClusterGroup>
    );
}

export default function ComplaintMap({ complaintLocations }: ComplaintMapProps) {
  const diyBounds: L.LatLngBoundsExpression = [
    [-8.1, 109.95],
    [-7.45, 110.75]
  ];

  const defaultCenter: [number, number] = [-7.797068, 110.370529];

  const initialZoom = 13;
  const minZoom = 12;

  return (
    <MapContainer
      center={defaultCenter}
      zoom={initialZoom}
      minZoom={minZoom}
      maxBounds={diyBounds}
      maxBoundsViscosity={1.0}
      scrollWheelZoom={true}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
        crossOrigin="anonymous"
      />
      <HeatmapLayer complaintLocations={complaintLocations} />
      <MarkersLayer complaintLocations={complaintLocations} />
    </MapContainer>
  );
}