/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
/* eslint-disable react-hooks/rules-of-hooks */
import { useGetSingleOrderQuery } from "@/redux/features/orders/ordersApi";
import { useGetVehicleTypesQuery } from "@/redux/features/vehicleType/vehicleTypeApi";
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
    position: google.maps.LatLng | google.maps.LatLngLiteral
  ) => void;
  setTitle: (title: string) => void;
}

// Vehicle type from API
interface VehicleType {
  id: number;
  vehicle_type: string;
  base_price: string;
  per_km_price: string;
  peak_pricing: boolean;
  dimension: string;
  max_load: string;
  isActive: boolean;
}

// Socket order data
interface OrderData {
  orderId: string;
  riderId: string;
  lat: number;
  lng: number;
  heading?: number;
  orderStatus?: string;
  vehicleType?: {
    vehicle_type: string;
  };
  assign_rider?: {
    locations?: {
      lat: number;
      lng: number;
      heading?: number;
    };
  };
}

// Single order response from API
interface SingleOrderResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    assign_rider_id: number;
    order_status: string;
    vehicle?: {
      vehicle_type: string;
    };
    assign_rider?: {
      id: number;
      locations?: {
        latitude: string;
        longitude: string;
        heading?: number;
      };
    };
    orderStops?: Array<{
      latitude: number;
      longitude: number;
    }>;
  };
}

// Vehicle for display
interface Vehicle {
  id: string;
  type: string;
  lat: number;
  lng: number;
  heading?: number;
  icon: string;
  color: string;
  orderId?: string;
  riderId?: string;
  status?: string;
  vehicleType?: string;
  riderName?: string;
  lastUpdated?: string;
}

// Category for filtering
interface Category {
  id: string;
  label: string;
  count: number;
  color: string;
  markerColor: string;
}

interface FleetMapHeaderProps {
  selectedOrderId?: string; // Dynamic order ID passed from parent
}

export default function FleetMapHeader({
  selectedOrderId,
}: FleetMapHeaderProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<GoogleMap | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());
  const adminSocketRef = useRef<Socket | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [, setVehicleTypes] = useState<VehicleType[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "all",
      label: "All vehicles",
      count: 0,
      color: "bg-blue-500",
      markerColor: "#3B82F6",
    },
  ]);

  // Get vehicle types from API
  const { data: vehicleTypesResponse } = useGetVehicleTypesQuery({});

  // Get single order data based on selectedOrderId
  const { data: singleOrderResponse } = useGetSingleOrderQuery(
    selectedOrderId || "",
    {
      skip: !selectedOrderId,
    }
  );

  // Get token from localStorage
  const token = localStorage.getItem("accessToken");

  // Initialize Google Maps with Dhaka center
  const initMap = () => {
    if (!mapRef.current || !window.google) return;

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 23.8103, lng: 90.4125 }, // Dhaka coordinates
      zoom: 12,
      disableDefaultUI: true,
      zoomControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
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

  // Map vehicle type to icon and color
  const getVehicleConfig = (vehicleType: string) => {
    const type = vehicleType.toLowerCase();

    // Default configurations based on vehicle types from API
    const defaultConfigs: Record<string, { icon: string; color: string }> = {
      motorcycle: { icon: "🏍", color: "#F97316" },
      car: { icon: "🚗", color: "#22C55E" },
      suv: { icon: "🚙", color: "#10B981" },
      van: { icon: "🚐", color: "#06B6D4" },
      truck: { icon: "🚚", color: "#EF4444" },
      bus: { icon: "🚌", color: "#8B5CF6" },
      bicycle: { icon: "🚲", color: "#F59E0B" },
      electric_scooter: { icon: "🛴", color: "#84CC16" },
    };

    // Try exact match first
    if (defaultConfigs[type]) {
      return defaultConfigs[type];
    }

    // Try partial matches for different vehicle types
    if (
      type.includes("motor") ||
      type.includes("bike") ||
      type.includes("moto")
    ) {
      return defaultConfigs.motorcycle;
    }
    if (type.includes("car")) {
      return defaultConfigs.car;
    }
    if (type.includes("suv")) {
      return defaultConfigs.suv;
    }
    if (type.includes("van")) {
      return defaultConfigs.van;
    }
    if (type.includes("truck")) {
      return defaultConfigs.truck;
    }
    if (type.includes("bus")) {
      return defaultConfigs.bus;
    }
    if (type.includes("cycle") || type.includes("bicycle")) {
      return defaultConfigs.bicycle;
    }
    if (type.includes("electric") || type.includes("scooter")) {
      return defaultConfigs.electric_scooter;
    }

    // Default to motorcycle
    return defaultConfigs.motorcycle;
  };

  // Convert order data to vehicle format
  const convertOrderToVehicle = (order: OrderData): Vehicle | null => {
    // Extract lat/lng from either flat or nested structure
    const lat =
      order.lat ||
      order.assign_rider?.locations?.lat ||
      23.8103 + Math.random() * 0.01;
    const lng =
      order.lng ||
      order.assign_rider?.locations?.lng ||
      90.4125 + Math.random() * 0.01;
    const heading =
      order.heading ||
      order.assign_rider?.locations?.heading ||
      Math.floor(Math.random() * 360);

    // Get vehicle type from order data or use default
    const vehicleTypeStr = order.vehicleType?.vehicle_type || "MOTORCYCLE";
    const vehicleConfig = getVehicleConfig(vehicleTypeStr);

    // Create unique ID using orderId and riderId combination
    const uniqueId = `${order.orderId}-${order.riderId}`;

    return {
      id: uniqueId,
      type: vehicleTypeStr.toLowerCase(),
      lat,
      lng,
      heading,
      icon: vehicleConfig.icon,
      color: vehicleConfig.color,
      orderId: order.orderId,
      riderId: order.riderId,
      status: order.orderStatus || "Active",
      vehicleType: vehicleTypeStr,
      lastUpdated: new Date().toLocaleTimeString(),
    };
  };

  // Convert single order API response to vehicle format
  const convertSingleOrderToVehicle = (
    orderData: SingleOrderResponse
  ): Vehicle | null => {
    if (!orderData?.success || !orderData.data) return null;

    const data = orderData.data;

    // Get location from assign_rider or use default
    let lat = 23.8103;
    let lng = 90.4125;
    let heading = 0;

    if (data.assign_rider?.locations) {
      lat = parseFloat(data.assign_rider.locations.latitude) || lat;
      lng = parseFloat(data.assign_rider.locations.longitude) || lng;
      heading = data.assign_rider.locations.heading || heading;
    }

    // Get vehicle type from response or use default
    const vehicleTypeStr = data.vehicle?.vehicle_type || "MOTORCYCLE";
    const vehicleConfig = getVehicleConfig(vehicleTypeStr);

    const uniqueId = `${data.id}-${data.assign_rider_id}`;

    return {
      id: uniqueId,
      type: vehicleTypeStr.toLowerCase(),
      lat,
      lng,
      heading,
      icon: vehicleConfig.icon,
      color: vehicleConfig.color,
      orderId: data.id.toString(),
      riderId: data.assign_rider_id.toString(),
      status: data.order_status,
      vehicleType: vehicleTypeStr,
      lastUpdated: new Date().toLocaleTimeString(),
    };
  };

  // Create or update a vehicle marker
  const updateVehicleMarker = (vehicle: Vehicle) => {
    if (!mapInstanceRef.current) return;

    const markerId = vehicle.id;
    let marker = markersRef.current.get(markerId);

    const position = { lat: vehicle.lat, lng: vehicle.lng };
    const heading = vehicle.heading || 0;

    // Create custom marker with direction indicator
    const iconSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="20" fill="${vehicle.color}" fill-opacity="0.9"/>
        <g transform="rotate(${heading} 24 24)">
          <polygon points="24,10 28,38 20,38" fill="white" fill-opacity="0.8"/>
        </g>
        <text x="24" y="26" font-family="Arial" font-size="14" text-anchor="middle" dy=".3em" fill="white" font-weight="bold">${vehicle.icon}</text>
        <circle cx="24" cy="24" r="2" fill="white"/>
      </svg>
    `;

    const title = `Order: ${vehicle.orderId || "N/A"}
Rider: ${vehicle.riderId || "N/A"}
Vehicle: ${vehicle.vehicleType || "N/A"}
Status: ${vehicle.status || "Active"}
Last Updated: ${vehicle.lastUpdated || "N/A"}`;

    if (!marker) {
      const newMarker = new google.maps.Marker({
        position,
        map: mapInstanceRef.current as any | null,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
            iconSvg
          )}`,
          scaledSize: new google.maps.Size(36, 36),
          anchor: new google.maps.Point(18, 18),
        },
        title,
        zIndex: 10,
      });

      markersRef.current.set(markerId, newMarker as Marker);
    } else {
      marker.setPosition(position);
      marker.setIcon({
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(iconSvg)}`,
        scaledSize: new google.maps.Size(36, 36),
        anchor: new google.maps.Point(18, 18),
      });
      marker.setTitle(title);
    }
  };

  // Remove a vehicle marker
  const removeVehicleMarker = (vehicleId: string) => {
    const marker = markersRef.current.get(vehicleId);
    if (marker) {
      marker.setMap(null);
      markersRef.current.delete(vehicleId);
    }
  };

  // Initialize admin socket connection
  const initAdminSocket = () => {
    if (adminSocketRef.current && adminSocketRef.current.connected) {
      return;
    }

    adminSocketRef.current = io("https://api.zipbee.sg/admin", {
      auth: { token: token || "" },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const socket = adminSocketRef.current;

    socket.on("connect", () => {
      // Request initial orders data
      socket.emit("admin:refresh_orders");
    });

    // Listen for all active orders with rider locations
    socket.on("admin:all_orders", (orders: OrderData[]) => {
      // Create a map to track unique vehicles by riderId
      const uniqueVehiclesMap = new Map<string, Vehicle>();

      orders.forEach((order) => {
        const vehicle = convertOrderToVehicle(order);
        if (vehicle) {
          // Use riderId as key to ensure uniqueness (one rider = one vehicle)
          // If same rider has multiple orders, we'll show the latest one
          uniqueVehiclesMap.set(vehicle?.riderId || "", vehicle);
        }
      });

      // Convert map values to array
      const newVehicles = Array.from(uniqueVehiclesMap.values());

      setVehicles(newVehicles);
      updateCategories(newVehicles);

      // Update markers on map
      newVehicles.forEach((vehicle) => updateVehicleMarker(vehicle));

      // Remove old markers that are no longer in the list
      const currentVehicleIds = new Set(newVehicles.map((v) => v.id));
      markersRef.current.forEach((marker, vehicleId) => {
        console.log(marker)
        if (!currentVehicleIds.has(vehicleId)) {
          removeVehicleMarker(vehicleId);
        }
      });
    });

    // Listen for real-time rider location updates
    socket.on(
      "admin:rider_location",
      (data: {
        orderId: string;
        riderId: string;
        lat: number;
        lng: number;
        heading?: number;
      }) => {
        // Update the specific vehicle
        setVehicles((prev) =>
          prev.map((vehicle) => {
            if (vehicle.riderId === data.riderId) {
              const updatedVehicle = {
                ...vehicle,
                lat: data.lat,
                lng: data.lng,
                heading: data.heading || vehicle.heading,
                lastUpdated: new Date().toLocaleTimeString(),
              };

              updateVehicleMarker(updatedVehicle);
              return updatedVehicle;
            }
            return vehicle;
          })
        );
      }
    );
  };

  // Get unique vehicle types from API response
  const getUniqueVehicleTypes = (types: VehicleType[]): VehicleType[] => {
    const seen = new Set<string>();
    return types.filter((type) => {
      const normalizedType = type.vehicle_type.toLowerCase();
      if (seen.has(normalizedType)) {
        return false;
      }
      seen.add(normalizedType);
      return true;
    });
  };

  // Update categories based on current vehicles and vehicle types
  const updateCategories = (currentVehicles: Vehicle[]) => {
    if (!vehicleTypesResponse?.success || !vehicleTypesResponse.data) return;

    // Get unique vehicle types from API
    const uniqueVehicleTypes = getUniqueVehicleTypes(vehicleTypesResponse.data);

    // Group vehicles by type
    const vehicleCounts: Record<string, number> = {};

    currentVehicles.forEach((vehicle) => {
      const type = vehicle.vehicleType?.toLowerCase() || "unknown";
      vehicleCounts[type] = (vehicleCounts[type] || 0) + 1;
    });

    // Create categories from unique vehicle types
    const newCategories: Category[] = [
      {
        id: "all",
        label: "All vehicles",
        count: currentVehicles.length,
        color: "bg-blue-500",
        markerColor: "#3B82F6",
      },
    ];

    // Add categories for each unique vehicle type
    uniqueVehicleTypes.forEach((type) => {
      const typeLower = type.vehicle_type.toLowerCase();
      const count = vehicleCounts[typeLower] || 0;

      // Only add category if we have this vehicle type in API
      const config = getVehicleConfig(type.vehicle_type);

      newCategories.push({
        id: typeLower,
        label: type.vehicle_type,
        count,
        color:
          config.color === "#F97316"
            ? "bg-orange-500"
            : config.color === "#22C55E"
            ? "bg-green-500"
            : config.color === "#10B981"
            ? "bg-emerald-500"
            : config.color === "#06B6D4"
            ? "bg-cyan-500"
            : config.color === "#EF4444"
            ? "bg-red-500"
            : config.color === "#8B5CF6"
            ? "bg-purple-500"
            : config.color === "#F59E0B"
            ? "bg-amber-500"
            : config.color === "#84CC16"
            ? "bg-lime-500"
            : "bg-gray-500",
        markerColor: config.color,
      });
    });

    setCategories(newCategories);
  };

  // Filter markers based on selected category
  const filterMarkers = () => {
    markersRef.current.forEach((marker, vehicleId) => {
      const vehicle = vehicles.find((v) => v.id === vehicleId);
      if (!vehicle) {
        marker.setVisible(false);
        return;
      }

      if (selectedCategory === "all") {
        marker.setVisible(true);
      } else {
        const vehicleType = vehicle.vehicleType?.toLowerCase();
        marker.setVisible(vehicleType === selectedCategory);
      }
    });
  };

  // Zoom functions
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      const currentZoom = mapInstanceRef.current.getZoom();
      mapInstanceRef.current.setZoom(currentZoom + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      const currentZoom = mapInstanceRef.current.getZoom();
      mapInstanceRef.current.setZoom(currentZoom - 1);
    }
  };

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMaps = () => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        if (window.google && window.google.maps) {
          initMap();
          initAdminSocket();
        }
      };

      document.head.appendChild(script);
    };

    if (!window.google || !window.google.maps) {
      loadGoogleMaps();
    } else {
      initMap();
      initAdminSocket();
    }

    return () => {
      if (adminSocketRef.current) {
        adminSocketRef.current.disconnect();
      }
    };
  }, []);

  // Update vehicle types from API response
  useEffect(() => {
    if (vehicleTypesResponse?.success && vehicleTypesResponse.data) {
      const uniqueTypes = getUniqueVehicleTypes(vehicleTypesResponse.data);
      setVehicleTypes(uniqueTypes);
      updateCategories(vehicles);
    }
  }, [vehicleTypesResponse, vehicles]);

  // Handle single order response from API
  useEffect(() => {
    if (singleOrderResponse && selectedOrderId) {
      const vehicle = convertSingleOrderToVehicle(singleOrderResponse);

      if (vehicle) {
        // Check if vehicle already exists
        const existingVehicleIndex = vehicles.findIndex(
          (v) => v.riderId === vehicle.riderId
        );

        if (existingVehicleIndex === -1) {
          // Add new vehicle
          const newVehicles = [...vehicles, vehicle];
          setVehicles(newVehicles);
          updateVehicleMarker(vehicle);
          updateCategories(newVehicles);
        } else {
          // Update existing vehicle
          const updatedVehicles = [...vehicles];
          updatedVehicles[existingVehicleIndex] = vehicle;
          setVehicles(updatedVehicles);
          updateVehicleMarker(vehicle);
        }

        // Center map on this vehicle
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setCenter({
            lat: vehicle.lat,
            lng: vehicle.lng,
          });
          mapInstanceRef.current.setZoom(15);
        }
      }
    }
  }, [singleOrderResponse, selectedOrderId]);

  // Filter markers when category or vehicles change
  useEffect(() => {
    filterMarkers();
  }, [selectedCategory, vehicles]);

  return (
    <div className="w-full h-[600px] bg-white shadow-sm border border-border rounded-2xl flex flex-col mt-8 relative z-10">
      {/* Header - Removed status and last updated */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-4 sm:px-6 md:px-8 py-4 md:py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          Real-Time Fleet Map
        </h1>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          {categories.map((category: Category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border-2 transition-all text-sm sm:text-base ${
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
      <div className="flex-1 relative bg-gray-100 m-6 rounded-lg shadow-lg overflow-hidden">
        <div ref={mapRef} className="w-full h-full"></div>

        {/* Zoom Controls */}
        <div className="absolute right-4 top-4 flex flex-col gap-2 z-30">
          <button
            className="w-10 h-10 bg-white rounded shadow-lg flex items-center justify-center text-xl font-bold hover:bg-gray-50 transition-colors"
            onClick={handleZoomIn}
          >
            +
          </button>
          <button
            className="w-10 h-10 bg-white rounded shadow-lg flex items-center justify-center text-xl font-bold hover:bg-gray-50 transition-colors"
            onClick={handleZoomOut}
          >
            −
          </button>
        </div>

        {/* Vehicle Count Display */}
        <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md z-30">
          <div className="text-sm font-medium text-gray-700">
            Active Vehicles: {vehicles.length}
          </div>
        </div>
      </div>
    </div>
  );
}
