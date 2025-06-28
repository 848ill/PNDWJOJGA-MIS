'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat'; // Import leaflet.heat plugin

import L from 'leaflet';

// Define the exact type expected by leaflet.heat
type HeatLatLngTuple = [number, number, number];

interface ComplaintMapProps {
  complaintLocations: { lat: number; lng: number; intensity?: number }[];
}

function HeatmapLayer({ complaintLocations }: { complaintLocations: ComplaintMapProps['complaintLocations'] }) {
  const map = useMap(); // Get map instance using useMap
  const heatLayerRef = useRef<L.HeatLayer | null>(null);

  useEffect(() => {
    // Tambahkan log untuk melihat data mentah yang masuk
    console.log('Original complaintLocations:', complaintLocations);

    const validLocations = complaintLocations.filter(
      loc => typeof loc.lat === 'number' && typeof loc.lng === 'number' && !isNaN(loc.lat) && !isNaN(loc.lng)
    );
    
    const latLngs: HeatLatLngTuple[] = validLocations.map(loc => [loc.lat, loc.lng, loc.intensity || 1]);

    console.log('HeatmapLayer useEffect triggered.');
    console.log('Map instance:', map);
    console.log('Filtered LatLngs count:', latLngs.length);
    if (latLngs.length > 0) {
      console.log('First LatLng entry:', latLngs[0]);
      console.log('Last LatLng entry:', latLngs[latLngs.length - 1]); // Cek juga entry terakhir
    }

    if (map) { // Pastikan map instance tersedia
      if (latLngs.length > 0) {
        if (!heatLayerRef.current) {
          console.log('Initializing new heatLayer...');
          try {
            heatLayerRef.current = (L as any).heatLayer(latLngs, {
              radius: 20,
              blur: 12,
              maxZoom: 17,
              minOpacity: 0.5,
              gradient: { 0.4: 'blue', 0.6: 'cyan', 0.7: 'lime', 0.8: 'yellow', 1.0: 'red' }
            });
            heatLayerRef.current!.addTo(map);
            console.log('HeatLayer added to map successfully.');
          } catch (e) {
            console.error('Error initializing heatLayer:', e);
          }
        } else {
          console.log('Updating existing heatLayer data...');
          try {
            heatLayerRef.current!.setLatLngs(latLngs);
            console.log('HeatLayer data updated successfully.');
          } catch (e) {
            console.error('Error updating heatLayer data:', e);
          }
        }
        map.invalidateSize();
        console.log('Map invalidated size.');
      } else {
        // Jika tidak ada data dan layer sudah ada, hapus layer
        if (heatLayerRef.current) {
          console.log('No valid data, removing heatLayer from map...');
          map.removeLayer(heatLayerRef.current);
          heatLayerRef.current = null;
        }
      }
    } else {
      console.log('Map instance not yet available.');
    }

    // Fungsi Cleanup
    return () => {
      if (map && heatLayerRef.current) {
        console.log('Cleaning up: Removing heatLayer from map...');
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
    };
  }, [map, complaintLocations]);

  return null;
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
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        crossOrigin="anonymous"
      />
      <HeatmapLayer complaintLocations={complaintLocations} />
    </MapContainer>
  );
}