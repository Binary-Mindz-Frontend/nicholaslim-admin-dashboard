export interface VehicleType {
  id: number;
  vehicle_type: string;
  base_price: string;
  per_km_price: string;
  peak_pricing: boolean;
  dimension: string;
  max_load: string;
  isActive: boolean;
  admin_id: number;
  created_at: string;
  updated_at: string;
}

export interface OrderDetail {
  id: number;
  serviceZoneId: number | null;
  userId: number;
  route_type: string;
  delivery_type: string;
  pay_type: string;
  collect_time: string;
  scheduled_time: string;
  vehicle_type_id: number;
  useCoins: boolean;
  originalCost: string;
  discountAmount: string;
  coinsRedeemed: number;
  promoCode: string | null;
  promoDiscount: string;
  total_cost: string;
  total_fee: string;
  commission: string | null;
  refund_amount: string | null;
  has_additional_services: boolean;
  notify_favorite_raider: boolean;
  payment_method_id: number | null;
  compititor_id: number[];
  competition_started_at: string;
  competition_closed: boolean;
  assign_rider_id: number;
  isPriorited: boolean;
  priorityAt: string | null;
  raider_confirmation: boolean;
  is_auto_confirmation: boolean;
  is_reviewed: boolean;
  is_placed: boolean;
  is_pickup: boolean;
  order_status: string;
  is_out_for_delivery: boolean;
  isFixed: boolean;
  isDispute: boolean;
  isBulk: boolean;
  total_distance: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pick_up_items: any[];
  created_at: string;
  updated_at: string;
  user: User;
  orderStops: OrderStop[];
  assign_rider: AssignRider;
  pricingSummary: PricingSummary;
}

export interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  password: string;
  reward_points: number;
  is_active: boolean;
  is_verified: boolean;
  is_deleted: boolean;
  refresh_token: string;
  is_acc_refered: boolean;
  referral_code: string;
  referral_link: string;
  regi_status: string;
  stripe_customer_id: string | null;
  stripe_payment_method_id: string | null;
  stripe_balance: number;
  totalWalletBalance: number;
  currentWalletBalance: number;
  stripeCustomerId: string;
  stripeAccountId: string | null;
  total_coin_acc: number;
  current_coin_balance: number;
  reset_pass: boolean;
  fcmToken: string;
  image: string | null;
  roleId: number;
  created_at: string;
  updated_at: string;
}

export interface OrderStop {
  id: number;
  orderId: number;
  destinationId: number;
  address: string;
  latitude: number;
  longitude: number;
  additionalInfo: string;
  type: 'PICKUP' | 'DROP';
  sequence: number;
  status: string;
  proofs: string[];
  notes: string;
  arrivedAt: string | null;
  completedAt: string;
  failedAt: string | null;
  failureReason: string | null;
  createdAt: string;
  updatedAt: string;
  destination: Destination;
  payment: Payment;
  pricingBreakdown?: PricingBreakdown;
}

export interface Destination {
  id: number;
  address: string;
  addressFromApr: string;
  postal_code: string | null;
  floor_unit: string;
  contact_name: string | null;
  contact_number: string | null;
  note_to_driver: string | null;
  is_saved: boolean;
  type: string;
  latitude: number;
  longitude: number;
  accuracy: string | null;
  additionalInfo: string | null;
  userId: number;
  lastUsedAt: string | null;
  useCount: number;
  createdAt: string;
  updatedAt: string;
  service_zoneId: string | null;
}

export interface Payment {
  id: number;
  orderStopId: number;
  payType: string;
  amount: string;
  status: string;
  collectedAt: string | null;
  collectedBy: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface PricingBreakdown {
  distance: number;
  basePrice: number;
  deliveryTypeCharge: number;
  userFeeTotal: number;
  zoneFee: number;
  surgeAmount: number;
  totalFee: number;
  totalPrice: number;
}

export interface AssignRider {
  id: number;
  userId: number;
  is_online: boolean;
  is_available: boolean;
  raider_status: string;
  LoginType: string;
  raider_verificationFromAdmin: string;
  isSuspended: boolean;
  suspendedDuration: string | null;
  suspensionReason: string | null;
  hasBranding: boolean;
  hasAdDecal: boolean;
  isPremium: boolean;
  rank: string;
  rankScore: number;
  reviews_count: number;
  completed_orders: number;
  active_days: number;
  cancellation_rate: number;
  created_at: string;
  updated_at: string;
  locations?: {
    id: number;
    raiderId: number;
    latitude: string;
    longitude: string;
    accuracy: string | null;
    heading: string | null;
    speed: string | null;
    is_active: boolean;
    updated_at: string;
  };
}

export interface PricingSummary {
  totalDistance: number;
  totalCost: number;
  totalFee: number;
  dropCount: number;
  perDropBreakdown: Array<{
    stopId: number;
    address: string;
    sequence: number;
    distance: number;
    price: number;
  }>;
}

export interface LiveVehicle {
  id: string;
  type: string;
  lat: number;
  lng: number;
  icon: string;
  color: string;
  orderId?: number;
  driverName?: string;
  phone?: string;
  zone?: string;
  vehicleType?: string;
}

export interface Category {
  id: string;
  label: string;
  count: number;
  color: string;
  markerColor: string;
  vehicleTypes?: string[];
}