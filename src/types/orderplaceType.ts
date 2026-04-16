/* eslint-disable @typescript-eslint/no-explicit-any */
export enum PayType {
  COD = "COD",
  WALLET = "WALLET",
  ONLINE_PAY = "ONLINE_PAY",
}

export const PAY_TYPE_DISPLAY: Record<PayType, string> = {
  [PayType.COD]: "cash",
  [PayType.ONLINE_PAY]: "stripe",
  [PayType.WALLET]: "wallet",
};

export const DISPLAY_TO_PAY_TYPE: Record<string, PayType> = {
  cash: PayType.COD,
  stripe: PayType.ONLINE_PAY,
  wallet: PayType.WALLET,
};

export interface RecipientData {
  id: string;
  contact_name: string;
  contact_number: string;
  address: string;
  floor_unit: string;
  note_to_driver: string;
  postal_code: string;
}

export interface OrderFormData {
  route_type: string;
  isFixed: boolean;
  delivery_type_id: number;
  vehicle_type_id: number;
  collect_time: string;
  total_cost: number;
  has_additional_services: boolean;
  is_promo_used: boolean;
  notify_favorite_raider: boolean;
  pay_type: PayType;
  destinations: any[];
  scheduled_time?: string;
}