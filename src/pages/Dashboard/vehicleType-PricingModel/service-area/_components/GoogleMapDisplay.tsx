/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleMapDisplayProps } from "@/types/serviceAreaType";
import { useRef, useEffect } from "react";
import { Plus, Minus } from "lucide-react"; // আইকন ব্যবহারের জন্য

declare global {
  interface Window {
    google: any;
  }
}

const GoogleMapDisplay = ({
  serviceAreas,
  selectedArea,
  onAreaClick,
}: GoogleMapDisplayProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const polygonsRef = useRef<any[]>([]);

  // Zoom In করার ফাংশন
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      const currentZoom = mapInstanceRef.current.getZoom();
      mapInstanceRef.current.setZoom(currentZoom + 1);
    }
  };

  // Zoom Out করার ফাংশন
  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      const currentZoom = mapInstanceRef.current.getZoom();
      mapInstanceRef.current.setZoom(currentZoom - 1);
    }
  };

  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    // Initialize map (যদি অলরেডি তৈরি না হয়ে থাকে)
    if (!mapInstanceRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 1.3521, lng: 103.8198 },
        zoom: 12,
        mapTypeControl: true,
        streetViewControl: false,
        zoomControl: false, // Google-এর ডিফল্ট জুম বাটন হাইড করলাম, কারণ আমরা কাস্টম বাটন বানাচ্ছি
      });
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

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
      polygon.addListener("click", () => {
        onAreaClick(area);
      });

      // Add hover effect
      polygon.addListener("mouseover", () => {
        polygon.setOptions({ fillOpacity: 0.6 });
      });

      polygon.addListener("mouseout", () => {
        polygon.setOptions({
          fillOpacity: selectedArea?.id === area.id ? 0.5 : 0.35,
        });
      });

      polygonsRef.current.push(polygon);
    });

    // Fit bounds to show all polygons (শুধু প্রথমবার বা ডেটা চেঞ্জ হলে ফিট করবে)
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

  return (
    <div className="relative w-full h-full">
      {/* আসল ম্যাপ ক্যানভাস */}
      <div ref={mapRef} className="w-full h-full rounded-lg" />

      {/* কাস্টম জুম বাটন ওভারলে (ম্যাপের ওপর ভাসমান থাকবে) */}
      <div className="absolute bottom-20 right-3 z-10 flex flex-col gap-1.5 bg-white p-1.5 rounded-md shadow-md border border-gray-200">
        <button
          onClick={handleZoomIn}
          className="p-2 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 rounded text-gray-700 transition-colors cursor-pointer flex items-center justify-center font-bold"
          title="Zoom In"
          type="button"
        >
          <Plus size={18} />
        </button>
        <hr className="border-gray-200 my-0.5" />
        <button
          onClick={handleZoomOut}
          className="p-2 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 rounded text-gray-700 transition-colors cursor-pointer flex items-center justify-center font-bold"
          title="Zoom Out"
          type="button"
        >
          <Minus size={18} />
        </button>
      </div>
    </div>
  );
};

export default GoogleMapDisplay;
