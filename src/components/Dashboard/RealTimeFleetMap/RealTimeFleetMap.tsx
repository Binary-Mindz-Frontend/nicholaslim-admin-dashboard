import { useEffect, useRef, useState } from "react";

// Leaflet types
interface LeafletMap {
  setView: (center: [number, number], zoom: number) => LeafletMap;
  zoomIn: () => void;
  zoomOut: () => void;
  remove: () => void;
}

interface LeafletTileLayer {
  addTo: (map: LeafletMap) => void;
}

interface LeafletIcon {
  iconSize?: [number, number];
  iconAnchor?: [number, number];
  className?: string;
  html?: string;
}

interface LeafletMarker {
  addTo: (map: LeafletMap) => void;
}

interface LeafletStatic {
  map: (element: HTMLElement) => LeafletMap;
  tileLayer: (
    url: string,
    options: { attribution: string }
  ) => LeafletTileLayer;

  divIcon: (options: LeafletIcon) => LeafletIcon;

  marker: (
    latlng: [number, number],
    options: { icon: LeafletIcon }
  ) => LeafletMarker;
}

declare global {
  interface Window {
    L?: LeafletStatic;
  }
}

// Component types
interface Category {
  id: string;
  label: string;
  count: number;
  color: string;
  markerColor: string;
}

interface Vehicle {
  type: string;
  lat: number;
  lng: number;
  icon: string;
  color: string;
}

export default function FleetMapHeader() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [, setLastUpdated] = useState<string>("2 mins ago");

  const categories: Category[] = [
    {
      id: "all",
      label: "All vehicles",
      count: 0,
      color: "bg-blue-500",
      markerColor: "#3B82F6",
    },
    {
      id: "bikes",
      label: "Bikes",
      count: 0,
      color: "bg-orange-500",
      markerColor: "#F97316",
    },
    {
      id: "cars",
      label: "Cars",
      count: 0,
      color: "bg-green-500",
      markerColor: "#22C55E",
    },
    {
      id: "van",
      label: "Van",
      count: 0,
      color: "bg-cyan-500",
      markerColor: "#06B6D4",
    },
    {
      id: "truck",
      label: "Truck",
      count: 0,
      color: "bg-red-500",
      markerColor: "#EF4444",
    },
  ];

  // Generate random vehicle locations around Singapore
  const generateVehicles = (): Vehicle[] => {
    const vehicles: Vehicle[] = [];
    // const center = { lat: 1.3521, lng: 103.8198 }; // Singapore center

    // // Bikes
    // for (let i = 0; i < 8; i++) {
    //   vehicles.push({
    //     type: "bikes",
    //     lat: center.lat + (Math.random() - 0.5) * 0.1,
    //     lng: center.lng + (Math.random() - 0.5) * 0.1,
    //     icon: "🚲",
    //     color: "#F97316",
    //   });
    // }

    // Cars
    // for (let i = 0; i < 3; i++) {
    //   vehicles.push({
    //     type: "cars",
    //     lat: center.lat + (Math.random() - 0.5) * 0.1,
    //     lng: center.lng + (Math.random() - 0.5) * 0.1,
    //     icon: "🚗",
    //     color: "#22C55E",
    //   });
    // }

    // // Vans
    // for (let i = 0; i < 2; i++) {
    //   vehicles.push({
    //     type: "van",
    //     lat: center.lat + (Math.random() - 0.5) * 0.1,
    //     lng: center.lng + (Math.random() - 0.5) * 0.1,
    //     icon: "🚐",
    //     color: "#06B6D4",
    //   });
    // }

    // // Trucks
    // vehicles.push({
    //   type: "truck",
    //   lat: center.lat + (Math.random() - 0.5) * 0.1,
    //   lng: center.lng + (Math.random() - 0.5) * 0.1,
    //   icon: "🚚",
    //   color: "#EF4444",
    // });

    return vehicles;
  };

  useEffect(() => {
    // Load Leaflet CSS and JS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    script.async = true;

    script.onload = () => {
      if (mapRef.current && window.L && !mapInstanceRef.current) {
        // Initialize map with lower z-index for the container
        const map = window.L.map(mapRef.current).setView(
          [1.3521, 103.8198],
          12
        );

        // Set lower z-index for all Leaflet layers
        const mapContainer = mapRef.current;
        if (mapContainer) {
          // Target Leaflet's pane elements and set lower z-index
          const leafletPanes = mapContainer.querySelectorAll('.leaflet-pane');
          leafletPanes.forEach((pane: Element) => {
            (pane as HTMLElement).style.zIndex = '10'; // Lower than navbar
          });

          // Also set z-index for the map container itself
          mapContainer.style.zIndex = '10';
        }

        // Add OpenStreetMap tiles
        window.L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution: "© OpenStreetMap contributors",
          }
        ).addTo(map);

        // Add vehicle markers
        const vehicles = generateVehicles();
        vehicles.forEach((vehicle: Vehicle) => {
          const icon = window.L!.divIcon({
            html: `<div style="background-color: ${vehicle.color}; width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">${vehicle.icon}</div>`,
            className: "custom-icon",
            iconSize: [36, 36],
            iconAnchor: [18, 18],
          });

          window.L!.marker([vehicle.lat, vehicle.lng], { icon }).addTo(map);
        });

        mapInstanceRef.current = map;
      }
    };

    document.body.appendChild(script);

    // Update time every minute
    const interval = setInterval(() => {
      const time = Math.floor(Math.random() * 5) + 1;
      setLastUpdated(`${time} mins ago`);
    }, 60000);

    return () => {
      clearInterval(interval);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-150 bg-white shadow-sm border border-border rounded-2xl flex flex-col mt-8 relative z-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-4 sm:px-6 md:px-8 py-4 md:py-6 relative z-20">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          Real-Time Fleet Map
        </h1>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          {categories.map((category: Category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border-2 transition-all text-sm sm:text-base relative z-20 ${
                selectedCategory === category.id
                  ? "bg-yellow-200 border-yellow-400"
                  : "bg-yellow-50 border-yellow-200 hover:bg-yellow-100"
              }`}
            >
              <span
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full ${category.color}`}
              ></span>
              <span className="text-gray-700">
                {category.label} ({category.count})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative bg-white m-6 rounded-lg shadow-lg overflow-hidden">
        <div 
          ref={mapRef} 
          className="w-full h-full"
          style={{ zIndex: 10 }}
        ></div>

        {/* Zoom Controls */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-30">
          <button
            className="w-10 h-10 bg-white rounded shadow-lg flex items-center justify-center text-xl font-bold hover:bg-gray-50"
            onClick={() => mapInstanceRef.current?.zoomIn()}
          >
            +
          </button>
          <button
            className="w-10 h-10 bg-white rounded shadow-lg flex items-center justify-center text-xl font-bold hover:bg-gray-50"
            onClick={() => mapInstanceRef.current?.zoomOut()}
          >
            −
          </button>
        </div>

        {/* Last Updated */}
        <div className="absolute bottom-6 right-4 bg-white px-4 py-2 rounded-lg shadow-md z-30">
          <span className="text-sm text-gray-500">
            {/* Last updated {lastUpdated} */}
          </span>
        </div>
      </div>
    </div>
  );
}