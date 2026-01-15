/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';

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
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [polygons, setPolygons] = useState<google.maps.Polygon[]>([]);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);

  // Get Google Maps API key from environment variable
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

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

  const calculatePolygonCenter = (polygon: PolygonPoint[]): google.maps.LatLngLiteral => {
    if (!polygon || polygon.length === 0) {
      return { lat: 0, lng: 0 };
    }
    
    const sum = polygon.reduce(
      (acc, point) => {
        acc.lat += point.lat;
        acc.lng += point.lng;
        return acc;
      },
      { lat: 0, lng: 0 }
    );
    
    return {
      lat: sum.lat / polygon.length,
      lng: sum.lng / polygon.length
    };
  };

  // Create zone popup content
  const createZonePopupContent = (zone: HeatmapZone) => {
    const intensityLevel = getIntensityLevel(zone.orderCount, zone.intensity);
    const zoneColor = getColorByIntensity(intensityLevel);
    
    return `
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
        </div>
      </div>
    `;
  };

  // Initialize Google Maps
  const initGoogleMap = () => {
    if (!mapRef.current || !apiKey) {
      setError('Google Maps API key is missing or invalid.');
      setIsLoading(false);
      return;
    }

    try {
      // Check if Google Maps API is already loaded
      if (!window.google) {
        setError('Google Maps API failed to load. Please check your API key.');
        setIsLoading(false);
        return;
      }

      // Determine initial map center and zoom
      let initialCenter: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
      let initialZoom = 2;

      if (heatmapData.length > 0 && heatmapData[0].polygon.length > 0) {
        initialCenter = calculatePolygonCenter(heatmapData[0].polygon);
        initialZoom = 12;
      }

      // Create new map instance
      const map = new google.maps.Map(mapRef.current, {
        center: initialCenter,
        zoom: initialZoom,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        gestureHandling: 'greedy',
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      mapInstanceRef.current = map;

      // Create info window instance
      const infoWindowInstance = new google.maps.InfoWindow({
        maxWidth: 300
      });
      setInfoWindow(infoWindowInstance);

      // Clear previous polygons and markers
      polygons.forEach(polygon => polygon.setMap(null));
      markers.forEach(marker => marker.setMap(null));

      const newPolygons: google.maps.Polygon[] = [];
      const newMarkers: google.maps.Marker[] = [];
      const bounds = new google.maps.LatLngBounds();

      // Create polygons and markers for each zone
      heatmapData.forEach((zone) => {
        if (!zone.polygon || zone.polygon.length === 0) return;

        // Convert polygon points to LatLng array
        const polygonPath = zone.polygon.map(point => 
          new google.maps.LatLng(point.lat, point.lng)
        );

        // Extend bounds with polygon points
        polygonPath.forEach(latlng => bounds.extend(latlng));

        const intensityLevel = getIntensityLevel(zone.orderCount, zone.intensity);
        const zoneColor = getColorByIntensity(intensityLevel);
        const fillOpacity = getOpacityByIntensity(intensityLevel);

        // Create polygon
        const polygon = new google.maps.Polygon({
          paths: polygonPath,
          strokeColor: zoneColor,
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: zoneColor,
          fillOpacity: fillOpacity,
          map: map,
          zIndex: 1
        });

        newPolygons.push(polygon);

        // Add polygon click listener
        polygon.addListener('click', (e: google.maps.PolyMouseEvent) => {
          if (infoWindowInstance) {
            infoWindowInstance.setContent(createZonePopupContent(zone));
            infoWindowInstance.setPosition(e.latLng);
            infoWindowInstance.open(map);
          }
        });

        // Add mouseover and mouseout effects
        polygon.addListener('mouseover', () => {
          polygon.setOptions({
            strokeWeight: 4,
            fillOpacity: fillOpacity + 0.2
          });
        });

        polygon.addListener('mouseout', () => {
          polygon.setOptions({
            strokeWeight: 2,
            fillOpacity: fillOpacity
          });
        });

        // Create center marker
        const center = calculatePolygonCenter(zone.polygon);
        const marker = new google.maps.Marker({
          position: center,
          map: map,
          title: zone.zoneName,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 14,
            fillColor: zoneColor,
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2
          },
          zIndex: 2
        });

        newMarkers.push(marker);

        // Add marker click listener
        marker.addListener('click', () => {
          if (infoWindowInstance) {
            infoWindowInstance.setContent(createZonePopupContent(zone));
            infoWindowInstance.setPosition(center);
            infoWindowInstance.open(map);
          }
        });

        // Add hover effects for marker
        marker.addListener('mouseover', () => {
          polygon.setOptions({
            strokeWeight: 4,
            fillOpacity: fillOpacity + 0.2
          });
        });

        marker.addListener('mouseout', () => {
          polygon.setOptions({
            strokeWeight: 2,
            fillOpacity: fillOpacity
          });
        });
      });

      setPolygons(newPolygons);
      setMarkers(newMarkers);

      // Fit bounds if there are polygons
      if (heatmapData.length > 0 && newPolygons.length > 0) {
        map.fitBounds(bounds);
      }

      setIsLoading(false);
      setError(null);
    } catch (err) {
      console.error('Error initializing Google Maps:', err);
      setError('Failed to load Google Maps. Please check your API key and try again.');
      setIsLoading(false);
    }
  };

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (!apiKey) {
        setError('Google Maps API key is missing. Please check your environment variables.');
        setIsLoading(false);
        return;
      }

      // Check if script is already loaded
      if (window.google && window.google.maps) {
        initGoogleMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        // Small delay to ensure Google Maps is fully loaded
        setTimeout(initGoogleMap, 100);
      };
      
      script.onerror = () => {
        setError('Failed to load Google Maps. Please check your API key and internet connection.');
        setIsLoading(false);
      };
      
      document.head.appendChild(script);
    };

    loadGoogleMapsScript();

    // Cleanup function
    return () => {
      polygons.forEach(polygon => polygon.setMap(null));
      markers.forEach(marker => marker.setMap(null));
      if (infoWindow) {
        infoWindow.close();
      }
    };
  }, [heatmapData]); // Re-initialize when heatmapData changes

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
              {!apiKey && (
                <p className="text-sm text-gray-500 mt-2">
                  Please set VITE_GOOGLE_MAPS_API_KEY in your .env file
                </p>
              )}
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
                <p className="mt-4 text-gray-600">Loading Google Maps...</p>
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
        </div>
      </div>
    </div>
  );
};

export default DeliveryHeatmap;