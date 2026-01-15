// import { useGetDriverOrdersQuery, useGetSingleOrderQuery } from "@/redux/features/orders/ordersApi";
// import { useGetVehicleTypesQuery } from "@/redux/features/vehicleType/vehicleTypeApi";
import { useEffect, useRef, useState } from "react";

// Google Maps types
interface GoogleMap {
  setCenter: (center: google.maps.LatLng | google.maps.LatLngLiteral) => void;
  setZoom: (zoom: number) => void;
}

interface Marker {
  setMap: (map: GoogleMap | null) => void;
  setIcon: (icon: google.maps.Icon | google.maps.Symbol | null) => void;
  setVisible: (visible: boolean) => void;
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
  const mapInstanceRef = useRef<GoogleMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // const { data: vehicleTypes } = useGetVehicleTypesQuery("");

  // const { data: driverOrders } = useGetSingleOrderQuery("");

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

    // // Cars
    // for (let i = 0; i < 7; i++) {
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

  // Initialize Google Maps
  const initMap = () => {
    if (!mapRef.current || !window.google) return;

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 1.3521, lng: 103.8198 },
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

    mapInstanceRef.current = map;

    // Add vehicle markers
    const vehicles = generateVehicles();
    const markers: Marker[] = [];

    vehicles.forEach((vehicle) => {
      const marker = new google.maps.Marker({
        position: { lat: vehicle.lat, lng: vehicle.lng },
        map: map,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
              <rect width="40" height="40" rx="8" fill="${vehicle.color}" fill-opacity="0.9"/>
              <text x="20" y="20" font-family="Arial" font-size="20" text-anchor="middle" dy=".3em" fill="white">${vehicle.icon}</text>
            </svg>
          `)}`,
          scaledSize: new google.maps.Size(36, 36),
          anchor: new google.maps.Point(18, 18),
        },
        zIndex: 10,
      });

      markers.push(marker as Marker);
    });

    markersRef.current = markers;
  };

  // Filter markers based on selected category
  const filterMarkers = () => {
    markersRef.current.forEach((marker, index) => {
      if (selectedCategory === "all") {
        marker.setVisible(true);
      } else {
        // You'll need to track which vehicle type each marker represents
        // For now, we'll use a simple approach based on marker count distribution
        const vehicles = generateVehicles();
        const vehicle = vehicles[index];
        marker.setVisible(vehicle.type === selectedCategory);
      }
    });
  };

  useEffect(() => {
    // Load Google Maps API
    const loadGoogleMaps = () => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        // Check if Google Maps is loaded
        const checkGoogleMaps = () => {
          if (window.google && window.google.maps) {
            initMap();
          } else {
            setTimeout(checkGoogleMaps, 100);
          }
        };
        checkGoogleMaps();
      };

      document.head.appendChild(script);
    };

    if (!window.google || !window.google.maps) {
      loadGoogleMaps();
    } else {
      initMap();
    }
  });

  useEffect(() => {
    filterMarkers();
  });

  // Zoom functions
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      const currentZoom = 12; // You might want to track zoom state
      mapInstanceRef.current.setZoom(currentZoom + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      const currentZoom = 12; // You might want to track zoom state
      mapInstanceRef.current.setZoom(currentZoom - 1);
    }
  };

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
            onClick={handleZoomIn}
          >
            +
          </button>
          <button
            className="w-10 h-10 bg-white rounded shadow-lg flex items-center justify-center text-xl font-bold hover:bg-gray-50"
            onClick={handleZoomOut}
          >
            −
          </button>
        </div>

        {/* Last Updated */}
        {/* <div className="absolute bottom-6 right-4 bg-white px-4 py-2 rounded-lg shadow-md z-30">
          <span className="text-sm text-gray-500">
            Last updated {lastUpdated}
          </span>
        </div> */}
      </div>
    </div>
  );
}