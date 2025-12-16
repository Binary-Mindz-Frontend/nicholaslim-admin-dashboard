export interface Coordinate {
  lat: number;
  lng: number;
}

export interface ServiceArea {
  id: number;
  name: string;
  displayName: string;
  cityZone: string;
  deliveryFee: number;
  priority: number;
  isActive: boolean;
  color: string;
  minOrderAmount: number;
  notes: string;
  coordinates: Coordinate[];
}

export interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ size: number; color: string }>;
  color: string;
  bgColor: string;
}

export interface GoogleMapDisplayProps {
  serviceAreas: ServiceArea[];
  selectedArea: ServiceArea | null;
  onAreaClick: (area: ServiceArea) => void;
}

export interface ServiceAreaModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData: ServiceArea | null;
  onSave: (data: Partial<ServiceArea>) => void;
}