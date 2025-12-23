import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import type { Map as LeafletMap, LatLngExpression } from 'leaflet';

interface PolygonPoint {
  lat: number;
  lng: number;
}

interface HeatmapZone {
  zoneId: number;
  zoneName: string;
  polygon: PolygonPoint[];
  orderCount: number;
  intensity: number;
}

interface DeliveryHeatmapProps {
  heatmapData?: HeatmapZone[];
}

const DeliveryHeatmap: React.FC<DeliveryHeatmapProps> = ({ heatmapData = [] }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getIntensityLevel = (orderCount: number, intensity: number) => {
    const value = intensity > 0 ? intensity : orderCount;
    if (value >= 100) return 'high';
    if (value >= 50) return 'medium';
    return 'low';
  };

  const getColorByIntensity = (intensityLevel: string) => {
    const colors = {
      high: '#FF6B35',
      medium: '#F7931E',
      low: '#FDB913',
    };
    return colors[intensityLevel as keyof typeof colors];
  };

  const getOpacityByIntensity = (intensityLevel: string) => {
    const opacity = {
      high: 0.6,
      medium: 0.4,
      low: 0.2,
    };
    return opacity[intensityLevel as keyof typeof opacity];
  };

  const calculatePolygonCenter = (polygon: PolygonPoint[]): LatLngExpression => {
    if (!polygon || polygon.length === 0) {
      return [0, 0];
    }
    
    const sum = polygon.reduce(
      (acc, point) => {
        acc.lat += point.lat;
        acc.lng += point.lng;
        return acc;
      },
      { lat: 0, lng: 0 }
    );
    
    return [sum.lat / polygon.length, sum.lng / polygon.length];
  };

  useEffect(() => {
    const initMap = async () => {
      try {
        const L = await import('leaflet');
        
        if (!mapRef.current) return;

        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        let initialCenter: LatLngExpression = [0, 0];
        let initialZoom = 2;

        if (heatmapData.length > 0 && heatmapData[0].polygon.length > 0) {
          initialCenter = calculatePolygonCenter(heatmapData[0].polygon);
          initialZoom = 12;
        }

        const map = L.map(mapRef.current, {
          center: initialCenter,
          zoom: initialZoom,
          zoomControl: true,
        });

        mapInstanceRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map);

        const polygons: any[] = [];

        heatmapData.forEach((zone) => {
          if (!zone.polygon || zone.polygon.length === 0) return;

          const latLngs = zone.polygon.map(point => [point.lat, point.lng] as LatLngExpression);
          
          if (latLngs.length > 0) {
            latLngs.push(latLngs[0]);
          }

          const intensityLevel = getIntensityLevel(zone.orderCount, zone.intensity);
          const zoneColor = getColorByIntensity(intensityLevel);
          const fillOpacity = getOpacityByIntensity(intensityLevel);

          const polygon = L.polygon(latLngs, {
            color: zoneColor,
            weight: 2,
            opacity: 0.8,
            fillColor: zoneColor,
            fillOpacity: fillOpacity,
          }).addTo(map);

          polygons.push(polygon);

          polygon.bindPopup(`
            <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 200px;">
              <strong style="font-size: 14px;">${zone.zoneName}</strong>
              <div style="margin-top: 8px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                  <span style="color: #666;">Zone ID:</span>
                  <span style="font-weight: 600;">${zone.zoneId}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                  <span style="color: #666;">Orders:</span>
                  <span style="font-weight: 600;">${zone.orderCount}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                  <span style="color: #666;">Intensity:</span>
                  <span style="color: ${zoneColor}; font-weight: 600;">${intensityLevel.toUpperCase()}</span>
                </div>
                <div style="margin-top: 8px; font-size: 12px; color: #999;">
                  Click outside to close
                </div>
              </div>
            </div>
          `);

          const center = calculatePolygonCenter(zone.polygon);
          
          const marker = L.marker(center, {
            icon: L.divIcon({
              className: 'custom-marker',
              html: `
                <div style="
                  width: 28px;
                  height: 28px;
                  background: ${zoneColor};
                  border: 2px solid white;
                  border-radius: 50%;
                  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  cursor: pointer;
                ">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                  </svg>
                </div>
              `,
              iconSize: [28, 28],
              iconAnchor: [14, 14],
            }),
          }).addTo(map);

          marker.bindPopup(`
            <div style="font-family: system-ui, -apple-system, sans-serif;">
              <strong>${zone.zoneName} Center</strong>
              <div style="margin-top: 4px; font-size: 12px; color: #666;">
                Click polygon for details
              </div>
            </div>
          `);

          marker.on('mouseover', () => {
            polygon.setStyle({ weight: 4, fillOpacity: fillOpacity + 0.2 });
          });
          
          marker.on('mouseout', () => {
            polygon.setStyle({ weight: 2, fillOpacity: fillOpacity });
          });
        });

        if (heatmapData.length > 0 && polygons.length > 0) {
          const group = L.featureGroup(polygons);
          map.fitBounds(group.getBounds().pad(0.1));
        }

        setIsLoading(false);
        setError(null);
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Failed to load map. Please try again.');
        setIsLoading(false);
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [heatmapData]);

  if (error) {
    return (
      <div className="w-full h-screen bg-gray-50 py-5 mt-5">
        <div className="w-full h-full flex flex-col">
          <div className="bg-white rounded-t-lg shadow-sm p-4 border-b">
            <h1 className="text-2xl font-bold text-gray-900">Delivery Heatmap</h1>
            <p className="text-sm text-gray-600 mt-1">High-demand delivery zones</p>
          </div>
          <div className="flex-1 bg-white rounded-b-lg shadow-lg overflow-hidden flex items-center justify-center">
            <div className="text-center p-8">
              <div className="text-red-500 text-lg mb-2">⚠️ Map Error</div>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gray-50 py-5 mt-5">
      <div className="w-full h-full flex flex-col">
        <div className="bg-white rounded-t-lg shadow-sm p-4 border-b">
          <h1 className="text-2xl font-bold text-gray-900">Delivery Heatmap</h1>
          <p className="text-sm text-gray-600 mt-1">
            {heatmapData.length > 0 
              ? `${heatmapData.length} delivery zones with order intensity visualization`
              : 'No heatmap data available'}
          </p>
        </div>

        {heatmapData.length > 0 && (
          <div className="bg-white border-b px-4 py-3">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF6B35]"></div>
                <span className="text-sm text-gray-700">
                  High: {heatmapData.filter(z => getIntensityLevel(z.orderCount, z.intensity) === 'high').length} zones
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#F7931E]"></div>
                <span className="text-sm text-gray-700">
                  Medium: {heatmapData.filter(z => getIntensityLevel(z.orderCount, z.intensity) === 'medium').length} zones
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FDB913]"></div>
                <span className="text-sm text-gray-700">
                  Low: {heatmapData.filter(z => getIntensityLevel(z.orderCount, z.intensity) === 'low').length} zones
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 bg-white rounded-b-lg shadow-lg overflow-hidden relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-orange-500"></div>
                <p className="mt-4 text-gray-600">Loading map...</p>
              </div>
            </div>
          )}
          
          {!isLoading && heatmapData.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <div className="text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Heatmap Data</h3>
                <p className="text-gray-500">Delivery zone data will appear here when available.</p>
              </div>
            </div>
          )}
          
          <div ref={mapRef} className="w-full h-full" />
          
          <div className="absolute bottom-6 right-6 bg-white rounded-lg shadow-lg p-4 z-0">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Order Intensity</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#FF6B35]"></div>
                <span className="text-sm text-gray-700">High (100+ orders)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#F7931E]"></div>
                <span className="text-sm text-gray-700">Medium (50-99)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#FDB913]"></div>
                <span className="text-sm text-gray-700">Low (0-49)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryHeatmap;