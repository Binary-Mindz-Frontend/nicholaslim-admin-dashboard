export interface ServiceArea {
  id: number;
  name: string;
  displayName?: string;
  cityZone: string;
  deliveryFee: number;
  priority: number;
  isActive: boolean;
  color: string;
  minOrderAmount: number;
  notes: string;
  coordinates: { lat: number; lng: number }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceAreaModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiResponse: any;
  editData: ServiceArea | null;
  onSave: (data: Partial<ServiceArea>) => void;
  isLoading?: boolean;
}

export interface Coordinate {
  lat: number;
  lng: number;
}

// export interface ServiceArea {
//   updatedAt(updatedAt: any): import("react").ReactNode;
//   id: number;
//   name: string;
//   displayName: string;
//   cityZone: string;
//   deliveryFee: number;
//   priority: number;
//   isActive: boolean;
//   color: string;
//   minOrderAmount: number;
//   notes: string;
//   coordinates: Coordinate[];
// }

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