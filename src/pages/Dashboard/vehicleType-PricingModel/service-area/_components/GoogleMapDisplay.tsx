/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleMapDisplayProps } from '@/types/serviceAreaType';
import { useRef, useEffect } from 'react';

declare global {
  interface Window {
    google: any;
  }
}

const GoogleMapDisplay = ({ serviceAreas, selectedArea, onAreaClick }: GoogleMapDisplayProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const polygonsRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    // Initialize map
    const map = new window.google.maps.Map(mapRef.current, {
      // center: { lat: 23.8103, lng: 90.4125 },
      center: { lat: 1.3521, lng: 103.8198 },
      zoom: 12,
      mapTypeControl: true,
      streetViewControl: false,
    });

    mapInstanceRef.current = map;

    // Clear existing polygons
    polygonsRef.current.forEach((p) => p.setMap(null));
    polygonsRef.current = [];

    // Draw all polygons
    serviceAreas.forEach((area: any) => {
      const polygon = new window.google.maps.Polygon({
        paths: area.coordinates,
        strokeColor: area.color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: area.color,
        fillOpacity: selectedArea?.id === area.id ? 0.5 : 0.35,
        map: map,
      });

      // Add click listener
      polygon.addListener('click', () => {
        onAreaClick(area);
      });

      // Add hover effect
      polygon.addListener('mouseover', () => {
        polygon.setOptions({ fillOpacity: 0.6 });
      });

      polygon.addListener('mouseout', () => {
        polygon.setOptions({
          fillOpacity: selectedArea?.id === area.id ? 0.5 : 0.35,
        });
      });

      polygonsRef.current.push(polygon);
    });

    // Fit bounds to show all polygons
    if (serviceAreas.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      serviceAreas.forEach((area: any) => {
        area.coordinates.forEach((coord: any) => {
          bounds.extend(coord);
        });
      });
      map.fitBounds(bounds);
    }
  }, [serviceAreas, selectedArea, onAreaClick]);

  return <div ref={mapRef} className="w-full h-full rounded-lg" />;
};

export default GoogleMapDisplay;