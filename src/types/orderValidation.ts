/* eslint-disable @typescript-eslint/no-explicit-any */
// import { SenderReceiverData, OrderFormData } from '@/components/OrderPlacement/IndivisualOrder/IndivisualOrderTab/IndivisualOrderTab'; // Adjust path as needed
import toast from "react-hot-toast";

// Validation function for form data
export const validateForm = (
  sender: SenderReceiverData,
  receiver: SenderReceiverData,
  selectedDeliveryType: any,
  selectedVehicle: any,
  collectTimeOption: "now" | "schedule",
  scheduledDate: string
): boolean => {
  // Validate sender fields
  if (!sender.contact_name.trim()) {
    toast.error("Sender name is required");
    return false;
  }
  if (!sender.contact_number.trim()) {
    toast.error("Sender number is required");
    return false;
  }
  if (!sender.address.trim()) {
    toast.error("Sender address is required");
    return false;
  }

  // Validate receiver fields
  if (!receiver.contact_name.trim()) {
    toast.error("Recipient name is required");
    return false;
  }
  if (!receiver.contact_number.trim()) {
    toast.error("Recipient number is required");
    return false;
  }
  if (!receiver.address.trim()) {
    toast.error("Recipient address is required");
    return false;
  }

  // Validate delivery type
  if (!selectedDeliveryType) {
    toast.error("Please select a delivery type");
    return false;
  }

  // Validate vehicle type
  if (!selectedVehicle) {
    toast.error("Please select a vehicle");
    return false;
  }

  // Validate scheduled time if selected
  if (collectTimeOption === "schedule" && !scheduledDate) {
    toast.error("Please select a scheduled time");
    return false;
  }

  return true;
};

// Types for form data
export interface SenderReceiverData {
  contact_name: string;
  contact_number: string;
  address: string;
  postal_code: string;
  floor_unit: string;
  note_to_driver: string;

}

export interface OrderFormData {
  route_type: "ONE_WAY" | "ROUND";
  isFixed: boolean;
  delivery_type: string;
  vehicle_type_id: number;
  collect_time: "ASAP" | "SCHEDULED";
  scheduled_time?: string;
  total_cost: number;
  has_additional_services: boolean;
  is_promo_used: boolean;
  notify_favorite_raider: boolean;
  pay_type: string;
  
  destinations: Array<{
    address: string;
    floor_unit: string;
    contact_name: string;
    contact_number: string;
    postal_code: string;
    note_to_driver: string;
    type: "SENDER" | "RECEIVER";
  }>;
}
