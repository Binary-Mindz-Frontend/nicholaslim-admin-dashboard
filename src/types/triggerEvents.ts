export interface TriggerEvent {
  id: string;
  name: string;
  backendTag: string;
  description?: string;
  expectedValue?: number;
  expectedValueType?: string;
  status: 'ASSIGNED' | 'ARRIVED_AT_PICKUP' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';
  isActive: boolean;
  createdAt?: string;
}
