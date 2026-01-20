/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';
import { useGetVehicleTypesQuery } from '@/redux/features/vehicleType/vehicleTypeApi';
import { VehicleType, LiveVehicle, Category, OrderDetail } from '@/types/fleet';
import socketService from '@/services/socketService';
import OrderDetailsModal from '../OrderDetailsModal/OrderDetailsModal';
import FleetMapHeader from '../FleetMapHeader/FleetMapHeader';

// Vehicle type to category mapping
const VEHICLE_CATEGORY_MAP: Record<string, string> = {
  'MOTORCYCLE': 'bikes',
  'BICYCLE': 'bikes',
  'ELECTRIC_SCOOTER': 'bikes',
  'CAR': 'cars',
  'SUV': 'cars',
  'VAN': 'van',
  'TRUCK': 'truck',
  'BUS': 'truck'
};

const FleetMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [liveVehicles, setLiveVehicles] = useState<LiveVehicle[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');

  const { data: vehicleTypesResponse } = useGetVehicleTypesQuery('');
  const vehicleTypes = vehicleTypesResponse?.data || [];
  
  const accessToken = localStorage.getItem('accessToken');

  // Mock socket token (replace with actual token from your auth system)
  const adminToken = accessToken;

  // Get categories based on vehicle types
  const getCategories = (): Category[] => {
    const vehicleTypeMap = new Map<string, number>();
    
    vehicleTypes.forEach((vehicle: VehicleType) => {
      const category = VEHICLE_CATEGORY_MAP[vehicle.vehicle_type] || 'other';
      vehicleTypeMap.set(category, (vehicleTypeMap.get(category) || 0) + 1);
    });

    return [
      {
        id: 'all',
        label: 'All vehicles',
        count: vehicleTypes.length,
        color: 'bg-blue-500',
        markerColor: '#3B82F6'
      },
      {
        id: 'bikes',
        label: 'Bikes',
        count: vehicleTypeMap.get('bikes') || 0,
        color: 'bg-orange-500',
        markerColor: '#F97316',
        vehicleTypes: ['MOTORCYCLE', 'BICYCLE', 'ELECTRIC_SCOOTER']
      },
      {
        id: 'cars',
        label: 'Cars',
        count: vehicleTypeMap.get('cars') || 0,
        color: 'bg-green-500',
        markerColor: '#22C55E',
        vehicleTypes: ['CAR', 'SUV']
      },
      {
        id: 'van',
        label: 'Van',
        count: vehicleTypeMap.get('van') || 0,
        color: 'bg-cyan-500',
        markerColor: '#06B6D4',
        vehicleTypes: ['VAN']
      },
      {
        id: 'truck',
        label: 'Truck',
        count: vehicleTypeMap.get('truck') || 0,
        color: 'bg-red-500',
        markerColor: '#EF4444',
        vehicleTypes: ['TRUCK', 'BUS']
      }
    ];
  };

  const categories = getCategories();

  // Get vehicle icon based on type
  const getVehicleIcon = (type: string): string => {
    const icons: Record<string, string> = {
      'MOTORCYCLE': '🏍',
      'BICYCLE': '🚲',
      'ELECTRIC_SCOOTER': '🛵',
      'CAR': '🚗',
      'SUV': '🚙',
      'VAN': '🚐',
      'TRUCK': '🚚',
      'BUS': '🚌'
    };
    return icons[type] || '🚗';
  };

  // Get vehicle color based on type
  const getVehicleColor = (type: string): string => {
    const category = VEHICLE_CATEGORY_MAP[type] || 'cars';
    return categories.find(cat => cat.id === category)?.markerColor || '#3B82F6';
  };

  // Generate mock live vehicles (replace with socket data)
  const generateLiveVehicles = (): LiveVehicle[] => {
    const vehicles: LiveVehicle[] = [];
    const center = { lat: 23.8103, lng: 90.4125 }; // Dhaka center
    
    vehicleTypes.forEach((vehicle: VehicleType, index: number) => {
      // Generate random positions around center
      const lat = center.lat + (Math.random() - 0.5) * 0.1;
      const lng = center.lng + (Math.random() - 0.5) * 0.1;
      
      vehicles.push({
        id: `vehicle-${index}`,
        type: vehicle.vehicle_type,
        lat,
        lng,
        icon: getVehicleIcon(vehicle.vehicle_type),
        color: getVehicleColor(vehicle.vehicle_type),
        orderId: Math.floor(Math.random() * 1000) + 3000,
        driverName: ['Harry Dine', 'John Smith', 'Alice Johnson', 'Bob Wilson'][index % 4],
        phone: '+0123456789',
        zone: ['Pampoli', 'Downtown', 'Uptown', 'Suburbs'][index % 4],
        vehicleType: vehicle.vehicle_type
      });
    });

    return vehicles;
  };

  // Initialize Google Maps
  const initMap = () => {
    if (!mapRef.current || !window.google) return;

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 23.8103, lng: 90.4125 },
      zoom: 12,
      disableDefaultUI: true,
      zoomControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    mapInstanceRef.current = map;
    updateMapMarkers();
  };

  // Update markers on the map
  const updateMapMarkers = () => {
    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    if (!mapInstanceRef.current) return;

    // Create new markers for filtered vehicles
    const filteredVehicles = liveVehicles.filter(vehicle => {
      if (selectedCategory === 'all') return true;
      const category = categories.find(cat => cat.id === selectedCategory);
      return category?.vehicleTypes?.includes(vehicle.type) || false;
    });

    filteredVehicles.forEach(vehicle => {
      const marker = new google.maps.Marker({
        position: { lat: vehicle.lat, lng: vehicle.lng },
        map: mapInstanceRef.current,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
              <rect width="48" height="48" rx="10" fill="${vehicle.color}" fill-opacity="0.9"/>
              <rect x="4" y="4" width="40" height="40" rx="6" fill="white" fill-opacity="0.2"/>
              <text x="24" y="28" font-family="Arial, sans-serif" font-size="20" text-anchor="middle" dy=".3em" fill="white">${vehicle.icon}</text>
            </svg>
          `)}`,
          scaledSize: new google.maps.Size(42, 42),
          anchor: new google.maps.Point(21, 21)
        },
        zIndex: 10,
        title: `${vehicle.driverName} - ${vehicle.vehicleType}`
      });

      // Add click listener to show order details
      marker.addListener('click', () => {
        // Fetch order details (mock for now - replace with actual API call)
        handleVehicleClick(vehicle.orderId!);
      });

      markersRef.current.push(marker);
    });

    // Update last updated time
    setLastUpdated(new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    }));
  };

  // Handle vehicle click to show order details
  const handleVehicleClick = (orderId: number) => {
    // In real implementation, fetch order details using orderId
    // For now, we'll use mock data structure
    setSelectedOrder({
      id: orderId,
      // ... other order properties from your API response
    } as OrderDetail);
    setIsModalOpen(true);
  };

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  // Socket connection for real-time updates
  useEffect(() => {
    // Connect to admin socket for real-time updates
    const adminSocket = socketService.connectAdmin(adminToken || '');
    
    if (adminSocket) {
      adminSocket.connect();

      adminSocket.on('connect', () => {
        console.log('✅ Admin socket connected');
        socketService.refreshOrders();
      });

      adminSocket.on('admin:all_orders', (orders: any[]) => {
        console.log(`📦 Received ${orders.length} orders with locations`);
        // Process live vehicle data from socket
        processLiveVehicleData(orders);
      });

      adminSocket.on('admin:rider_location', (data: any) => {
        console.log(`🚀 Rider location update:`, data);
        // Update specific vehicle location
        updateVehicleLocation(data);
      });
    }

    // Initialize mock vehicles
    const vehicles = generateLiveVehicles();
    setLiveVehicles(vehicles);

    return () => {
      socketService.disconnectAdmin();
    };
  }, []);

  // Process live vehicle data from socket
  const processLiveVehicleData = (orders: any[]) => {
    const newVehicles: LiveVehicle[] = orders.map((order) => {
      const lat = order.lat || order.assign_rider?.locations?.lat || 0;
      const lng = order.lng || order.assign_rider?.locations?.lng || 0;
      
      // Get vehicle type from order
      const vehicleType = vehicleTypes.find((vt: VehicleType) => 
        vt.id === order.vehicle_type_id
      )?.vehicle_type || 'CAR';

      return {
        id: `order-${order.orderId}`,
        type: vehicleType,
        lat: typeof lat === 'string' ? parseFloat(lat) : lat,
        lng: typeof lng === 'string' ? parseFloat(lng) : lng,
        icon: getVehicleIcon(vehicleType),
        color: getVehicleColor(vehicleType),
        orderId: order.orderId,
        driverName: order.assign_rider?.user?.username || 'Unknown Driver',
        phone: order.assign_rider?.user?.phone || '+0123456789',
        zone: 'Pampoli', // You might need to get this from order data
        vehicleType: vehicleType
      };
    });

    setLiveVehicles(newVehicles);
  };

  // Update specific vehicle location
  const updateVehicleLocation = (locationData: any) => {
    setLiveVehicles(prev => prev.map(vehicle => {
      if (vehicle.orderId === locationData.orderId) {
        return {
          ...vehicle,
          lat: locationData.lat,
          lng: locationData.lng
        };
      }
      return vehicle;
    }));
  };

  // Update markers when vehicles or selected category changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      updateMapMarkers();
    }
  }, [liveVehicles, selectedCategory]);

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMaps = () => {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        console.log('apikey================', apiKey);
    
      if (!apiKey) {
        console.error('Google Maps API key is missing');
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
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
  }, []);
  

  // Zoom functions
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      const currentZoom = mapInstanceRef.current.getZoom() || 12;
      mapInstanceRef.current.setZoom(currentZoom + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      const currentZoom = mapInstanceRef.current.getZoom() || 12;
      mapInstanceRef.current.setZoom(currentZoom - 1);
    }
  };

  return (
    <>
      <FleetMapHeader
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        lastUpdated={lastUpdated}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      >
        <div 
          ref={mapRef} 
          className="w-full h-full"
        ></div>
      </FleetMapHeader>

      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
      />
    </>
  );
};

export default FleetMap;