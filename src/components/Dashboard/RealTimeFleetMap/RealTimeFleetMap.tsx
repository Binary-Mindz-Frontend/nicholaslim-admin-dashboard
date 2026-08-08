/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useGoogleMapsContext } from "@/context/GoogleMapsProvider";

interface Vehicle {
  id: string;
  type: string;
  lat: number;
  lng: number;
  heading?: number;
  color: string;
  riderId: string;
  vehicleName: string;
  lastUpdated: string;
  fullData: any;
}

interface Category {
  id: string;
  label: string;
  count: number;
  color: string;
}

const OFFLINE_THRESHOLD_MS = 1000;
const CLEANUP_INTERVAL_MS = 100;

export default function FleetMapHeader() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const adminSocketRef = useRef<Socket | null>(null);

  const lastSeenRef = useRef<Map<string, number>>(new Map());

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { id: "all", label: "All vehicles", count: 0, color: "#3B82F6" },
  ]);

  const token = localStorage.getItem("accessToken");

  // Wait for GoogleMapsProvider to signal that the script is fully loaded
  const isMapsLoaded = useGoogleMapsContext();

  const initMap = () => {
    if (!mapRef.current || !window.google) return;
    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 1.3521, lng: 103.8198 },
      zoom: 12,
      disableDefaultUI: true,
    });
    mapInstanceRef.current = map;
    infoWindowRef.current = new google.maps.InfoWindow();
    map.addListener("click", () => infoWindowRef.current?.close());
  };

  const getVehicleColor = (name: string = "") => {
    const n = name.toLowerCase();
    if (n.includes("van")) return "#EF4444";
    if (n.includes("car")) return "#22C55E";
    if (n.includes("motorcycle")) return "#F97316";
    return "#3B82F6";
  };

  const removeVehicle = (riderId: string) => {
    // Remove marker from map
    const marker = markersRef.current.get(riderId);
    if (marker) {
      marker.setMap(null);
      markersRef.current.delete(riderId);
    }
    lastSeenRef.current.delete(riderId);

    // Remove from vehicles state
    setVehicles((prev) => prev.filter((v) => v.riderId !== riderId));
  };

  const updateVehicleMarker = (vehicle: Vehicle) => {
    if (!mapInstanceRef.current) return;

    const markerId = vehicle.riderId;
    let marker = markersRef.current.get(markerId);
    const position = { lat: vehicle.lat, lng: vehicle.lng };

    const iconSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" fill="${vehicle.color}" stroke="white" stroke-width="2" />
      </svg>`;

    const iconObj = {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(iconSvg)}`,
      scaledSize: new google.maps.Size(20, 20),
      anchor: new google.maps.Point(10, 10),
    };

    if (!marker) {
      marker = new google.maps.Marker({
        position,
        map: mapInstanceRef.current,
        icon: iconObj,
      });

      marker.addListener("click", () => {
        const content = `
          <div style="padding:12px;min-width:150px;font-family:sans-serif;">
            <h4 style="margin:0 0 8px;color:#1a1a1a;border-bottom:1px solid #eee;padding-bottom:4px;">
              Rider #${vehicle.riderId}
            </h4>
            <p style="margin:4px 0;font-size:13px;"><b>Vehicle:</b> ${vehicle.vehicleName}</p>
            <p style="margin:4px 0;font-size:13px;"><b>Max Load:</b> ${vehicle.fullData.vehicle_type?.max_load || "N/A"}</p>
            <p style="margin:4px 0;font-size:13px;"><b>Base Price:</b> $${vehicle.fullData.vehicle_type?.base_price || "0"}</p>
            <p style="margin:8px 0 0;font-size:11px;color:#666;">Last sync: ${vehicle.lastUpdated}</p>
          </div>`;
        infoWindowRef.current?.setContent(content);
        infoWindowRef.current?.open(mapInstanceRef.current, marker);
      });

      markersRef.current.set(markerId, marker);
    } else {
      marker.setPosition(position);
    }
  };

  const initAdminSocket = () => {
    if (adminSocketRef.current?.connected) return;

    adminSocketRef.current = io("https://api.zipbee.sg/admin", {
      auth: { token: token || "" },
    });

    adminSocketRef.current.on("admin:rider_location", (payload: any) => {
      const riderId = payload.riderId.toString();
      const vName = payload.vehicle_type?.vehicle_name || "Unknown";

      lastSeenRef.current.set(riderId, Date.now());

      // if (!lastSeenRef.current.has(riderId)) {
      //   console.log(
      //     `🟢 [${new Date().toLocaleTimeString()}] Rider #${riderId} came ONLINE (${vName})`,
      //   );
      // }

      // lastSeenRef.current.set(riderId, now);

      console.log(
        `🟢 [${new Date().toLocaleTimeString()}] Rider #${riderId} location updated`,
      );

      const updatedVehicle: Vehicle = {
        id: riderId,
        riderId,
        lat: parseFloat(payload.lat),
        lng: parseFloat(payload.lng),
        heading: payload.heading,
        vehicleName: vName,
        type: vName.toLowerCase(),
        color: getVehicleColor(vName),
        lastUpdated: new Date().toLocaleTimeString(),
        fullData: payload,
      };

      setVehicles((prev) => {
        const index = prev.findIndex((v) => v.riderId === riderId);
        if (index > -1) {
          const newArr = [...prev];
          newArr[index] = updatedVehicle;
          return newArr;
        }
        return [...prev, updatedVehicle];
      });

      updateVehicleMarker(updatedVehicle);
    });
  };

  // ─── Heartbeat cleanup: evict stale vehicles ─────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const staleRiderIds: string[] = [];

      lastSeenRef.current.forEach((lastSeen, riderId) => {
        if (now - lastSeen > OFFLINE_THRESHOLD_MS) {
          staleRiderIds.push(riderId);
        }
      });

      staleRiderIds.forEach((riderId) => {
        console.log(`🔴 Rider ${riderId} OFFLINE`);
        removeVehicle(riderId);
      });
    }, CLEANUP_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isMapsLoaded) return;   // wait until GoogleMapsProvider confirms script is ready
    initMap();
    initAdminSocket();
    return () => {
      adminSocketRef.current?.disconnect();
    };
  }, [isMapsLoaded]);

  useEffect(() => {
    const counts: Record<string, number> = {};
    vehicles.forEach((v) => {
      counts[v.type] = (counts[v.type] || 0) + 1;
    });

    const newCats: Category[] = [
      {
        id: "all",
        label: "All vehicles",
        count: vehicles.length,
        color: "#3B82F6",
      },
    ];
    Object.keys(counts).forEach((type) => {
      newCats.push({
        id: type,
        label: type.toUpperCase(),
        count: counts[type],
        color: getVehicleColor(type),
      });
    });
    setCategories(newCats);
  }, [vehicles]);

  useEffect(() => {
    markersRef.current.forEach((marker, riderId) => {
      const vehicle = vehicles.find((v) => v.riderId === riderId);
      if (vehicle) {
        const isVisible =
          selectedCategory === "all" || vehicle.type === selectedCategory;
        marker.setVisible(isVisible);
        if (!isVisible) infoWindowRef.current?.close();
      }
    });
  }, [selectedCategory, vehicles]);

  return (
    <div className="w-full h-200 bg-white shadow-sm border rounded-2xl flex flex-col mt-8 relative z-10 overflow-hidden">
      <div className="flex flex-wrap items-start md:items-center gap-4 justify-between px-6 py-6 border-b">
        <h1 className="text-2xl font-bold text-gray-800">
          Real-Time Fleet Map
        </h1>
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg border-2 transition-all flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? "bg-yellow-100 border-yellow-500"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              <span className="font-medium text-gray-700">
                {cat.label} ({cat.count})
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 relative">
        <div ref={mapRef} className="w-full h-full" />
        <div className="absolute bottom-6 left-6 bg-white px-4 py-2 rounded-full shadow-lg z-30 font-bold border border-yellow-400">
          🟢 Online Riders: {vehicles.length}
        </div>
      </div>
    </div>
  );
}
