import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import type { Map as LeafletMap } from 'leaflet';

// This component uses Leaflet for the interactive map
const DeliveryHeatmap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Dynamically import Leaflet to avoid SSR issues
    const initMap = async () => {
      const L = await import('leaflet');
      
      if (!mapRef.current || mapInstanceRef.current) return;

      // Singapore coordinates
      const singaporeCenter: [number, number] = [1.3521, 103.8198];

      // Initialize map
      const map = L.map(mapRef.current, {
        center: singaporeCenter,
        zoom: 12,
        zoomControl: true,
      });

      mapInstanceRef.current = map;

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Sample delivery zones with different intensities
      const deliveryZones = [
        // High demand zones (red/orange)
        { lat: 1.3521, lng: 103.8198, intensity: 'high', label: 'Central Business District' },
        { lat: 1.3048, lng: 103.8318, intensity: 'high', label: 'Marina Bay' },
        { lat: 1.2800, lng: 103.8500, intensity: 'high', label: 'Changi' },
        
        // Medium demand zones (yellow/green)
        { lat: 1.3700, lng: 103.8500, intensity: 'medium', label: 'Ang Mo Kio' },
        { lat: 1.4400, lng: 103.7900, intensity: 'medium', label: 'Woodlands' },
        { lat: 1.3300, lng: 103.7400, intensity: 'medium', label: 'Jurong' },
        
        // Low demand zones (light yellow)
        { lat: 1.4200, lng: 103.8350, intensity: 'low', label: 'Yishun' },
        { lat: 1.3850, lng: 103.7450, intensity: 'low', label: 'Bukit Batok' },
      ];

      // Custom icon creator
      const createIcon = (intensity: string) => {
        const colors = {
          high: '#FF6B35',
          medium: '#F7931E',
          low: '#FDB913',
        };

        return L.divIcon({
          className: 'custom-marker',
          html: `
            <div style="
              width: 32px;
              height: 32px;
              background: ${colors[intensity as keyof typeof colors]};
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });
      };

      // Add markers for each delivery zone
      deliveryZones.forEach((zone) => {
        const marker = L.marker([zone.lat, zone.lng], {
          icon: createIcon(zone.intensity),
        }).addTo(map);

        marker.bindPopup(`
          <div style="font-family: system-ui, -apple-system, sans-serif;">
            <strong style="font-size: 14px;">${zone.label}</strong>
            <div style="margin-top: 4px; font-size: 12px; color: #666;">
              Demand: <span style="color: ${zone.intensity === 'high' ? '#FF6B35' : zone.intensity === 'medium' ? '#F7931E' : '#FDB913'}; font-weight: 600;">${zone.intensity.toUpperCase()}</span>
            </div>
          </div>
        `);

        // Add circle overlay to show coverage area
        const radiusMap = { high: 3000, medium: 2500, low: 2000 };
        const opacityMap = { high: 0.3, medium: 0.2, low: 0.15 };
        const colorMap = { high: '#FF6B35', medium: '#F7931E', low: '#FDB913' };

        L.circle([zone.lat, zone.lng], {
          radius: radiusMap[zone.intensity as keyof typeof radiusMap],
          fillColor: colorMap[zone.intensity as keyof typeof colorMap],
          fillOpacity: opacityMap[zone.intensity as keyof typeof opacityMap],
          color: colorMap[zone.intensity as keyof typeof colorMap],
          weight: 1,
        }).addTo(map);
      });

      setIsLoading(false);
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-screen bg-gray-50 py-5 mt-5">
      <div className="w-full h-full flex flex-col">
        {/* Header */}
        <div className="bg-white rounded-t-lg shadow-sm p-4 border-b">
          <h1 className="text-2xl font-bold text-gray-900">Delivery Heatmap</h1>
          <p className="text-sm text-gray-600 mt-1">High-demand delivery zones</p>
        </div>

        {/* Map Container */}
        <div className="flex-1 bg-white rounded-b-lg shadow-lg overflow-hidden relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-orange-500"></div>
                <p className="mt-4 text-gray-600">Loading map...</p>
              </div>
            </div>
          )}
          <div ref={mapRef} className="w-full h-full" />
          
          {/* Legend */}
          <div className="absolute bottom-6 right-6 bg-white rounded-lg shadow-lg p-4 z-0">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Order Intensity</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#FF6B35]"></div>
                <span className="text-sm text-gray-700">High</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#F7931E]"></div>
                <span className="text-sm text-gray-700">Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#FDB913]"></div>
                <span className="text-sm text-gray-700">Low</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryHeatmap;