/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

// Google Maps types
interface GoogleMap {
  setCenter: (center: google.maps.LatLng | google.maps.LatLngLiteral) => void;
  setZoom: (zoom: number) => void;
  fitBounds: (bounds: google.maps.LatLngBounds) => void;
  getZoom: () => number;
}

interface Marker {
  setMap: (map: GoogleMap | null) => void;
  setIcon: (icon: google.maps.Icon | google.maps.Symbol | null) => void;
  setVisible: (visible: boolean) => void;
  setPosition: (
    position: google.maps.LatLng | google.maps.LatLngLiteral,
  ) => void;
  setTitle: (title: string) => void;
}

interface Vehicle {
  id: string; // riderId
  type: string;
  lat: number;
  lng: number;
  heading?: number;
  icon: string;
  color: string;
  orderId?: string;
  riderId?: string;
  vehicleType?: string;
  lastUpdated?: string;
}

interface Category {
  id: string;
  label: string;
  count: number;
  color: string;
  markerColor: string;
}

interface FleetMapHeaderProps {
  selectedOrderId?: string;
}

export default function FleetMapHeader({
  // selectedOrderId,
}: FleetMapHeaderProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<GoogleMap | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());
  const adminSocketRef = useRef<Socket | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "all",
      label: "All vehicles",
      count: 0,
      color: "bg-blue-500",
      markerColor: "#3B82F6",
    },
  ]);

  // const { data: vehicleTypesResponse } = useGetVehicleTypesQuery({});
  const token = localStorage.getItem("accessToken");

  const initMap = () => {
    if (!mapRef.current || !window.google) return;
    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 1.3521, lng: 103.8198 },
      zoom: 12,
      disableDefaultUI: true,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    });
    mapInstanceRef.current = map as GoogleMap;
  };

  const getVehicleConfig = (vehicleType: string = "motorcycle") => {
    const type = vehicleType.toLowerCase();
    const configs: Record<string, { icon: string; color: string }> = {
      motorcycle: { icon: "🏍", color: "#F97316" },
      car: { icon: "🚗", color: "#22C55E" },
      truck: { icon: "🚚", color: "#EF4444" },
      van: { icon: "🚐", color: "#06B6D4" },
    };
    return configs[type] || configs.motorcycle;
  };

  const updateVehicleMarker = (vehicle: Vehicle) => {
    if (!mapInstanceRef.current) return;

    const markerId = vehicle.riderId || vehicle.id;
    let marker = markersRef.current.get(markerId);
    const position = { lat: vehicle.lat, lng: vehicle.lng };
    const heading = vehicle.heading || 0;

    const iconSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="20" fill="${vehicle.color}" fill-opacity="0.9"/>
        <g transform="rotate(${heading} 24 24)">
          <polygon points="24,10 28,38 20,38" fill="white" fill-opacity="0.8"/>
        </g>
        <text x="24" y="26" font-family="Arial" font-size="14" text-anchor="middle" dy=".3em" fill="white" font-weight="bold">${vehicle.icon}</text>
      </svg>
    `;

    const iconObj = {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(iconSvg)}`,
      scaledSize: new google.maps.Size(36, 36),
      anchor: new google.maps.Point(18, 18),
    };

    if (!marker) {
      const newMarker = new google.maps.Marker({
        position,
        map: mapInstanceRef.current as any,
        icon: iconObj,
        title: `Rider: ${vehicle.riderId}`,
      });
      markersRef.current.set(markerId, newMarker as Marker);
    } else {
      marker.setPosition(position);
      marker.setIcon(iconObj);
    }
  };

  const initAdminSocket = () => {
    if (adminSocketRef.current?.connected) return;

    adminSocketRef.current = io("https://api.zipbee.sg/admin", {
      auth: { token: token || "" },
    });

    // ONLY logic for real-time location update as requested
    adminSocketRef.current.on("admin:rider_location", (payload: any) => {
      const { riderId, lat, lng, heading, orderId, vehicle_name } = payload;

      const config = getVehicleConfig(vehicle_name);

      const updatedVehicle: Vehicle = {
        id: riderId,
        riderId,
        orderId,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        heading: heading || 0,
        type: (vehicle_name || "motorcycle").toLowerCase(),
        vehicleType: vehicle_name || "Motorcycle",
        icon: config.icon,
        color: config.color,
        lastUpdated: new Date().toLocaleTimeString(),
      };

      setVehicles((prev) => {
        const index = prev.findIndex((v) => v.riderId === riderId);
        if (index > -1) {
          const newVehicles = [...prev];
          newVehicles[index] = updatedVehicle;
          return newVehicles;
        }
        return [...prev, updatedVehicle];
      });

      updateVehicleMarker(updatedVehicle);
    });
  };

  useEffect(() => {
    const loadMap = () => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY`;
      script.async = true;
      script.onload = () => {
        initMap();
        initAdminSocket();
      };
      document.head.appendChild(script);
    };

    if (!window.google) loadMap();
    else {
      initMap();
      initAdminSocket();
    }

    return () => {
      adminSocketRef.current?.disconnect();
    };
  }, []);

  // Sync Categories UI based on live vehicles
  useEffect(() => {
    const counts: Record<string, number> = {};
    vehicles.forEach((v) => {
      const t = v.type;
      counts[t] = (counts[t] || 0) + 1;
    });

    const newCats: Category[] = [
      {
        id: "all",
        label: "All vehicles",
        count: vehicles.length,
        color: "bg-blue-500",
        markerColor: "#3B82F6",
      },
    ];

    Object.keys(counts).forEach((type) => {
      const config = getVehicleConfig(type);
      newCats.push({
        id: type,
        label: type.charAt(0).toUpperCase() + type.slice(1),
        count: counts[type],
        color: "bg-gray-500", // Dynamic mapping can be added here
        markerColor: config.color,
      });
    });
    setCategories(newCats);
  }, [vehicles]);

  // Filter visibility
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const vehicle = vehicles.find((v) => v.riderId === id);
      if (!vehicle) return;
      marker.setVisible(
        selectedCategory === "all" || vehicle.type === selectedCategory,
      );
    });
  }, [selectedCategory, vehicles]);

  return (
    <div className="w-full h-[800px] bg-white shadow-sm border border-border rounded-2xl flex flex-col mt-8 relative z-10">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between px-6 py-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Real-Time Fleet Map
        </h1>
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                selectedCategory === cat.id
                  ? "bg-yellow-200 border-yellow-400"
                  : "bg-yellow-50 border-yellow-100"
              }`}
            >
              <span className="text-gray-700">
                {cat.label} ({cat.count})
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 relative m-6 rounded-lg overflow-hidden shadow-inner">
        <div ref={mapRef} className="w-full h-full"></div>
        <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md z-30 font-medium">
          Riders Online: {vehicles.length}
        </div>
      </div>
    </div>
  );
}
