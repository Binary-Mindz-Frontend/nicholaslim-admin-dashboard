/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface OrderConfigurationProps {
  deliveryType: any[];
  vehicleTypes: any[];
  selectedDeliveryType: any;
  selectedVehicle: any;
  formData: any;
  collectTimeOption: string;
  scheduledDate: string;
  setSelectedDeliveryType: (value: any) => void;
  setSelectedVehicle: (value: any) => void;
  setFormData: (value: any) => void;
  handleCollectTimeChange: (value: string) => void;
  handleScheduledDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const OrderConfiguration: React.FC<OrderConfigurationProps> = ({
  deliveryType,
  vehicleTypes,
  selectedDeliveryType,
  selectedVehicle,
  formData,
  collectTimeOption,
  scheduledDate,
  setSelectedDeliveryType,
  setSelectedVehicle,
  setFormData,
  handleCollectTimeChange,
  handleScheduledDateChange,
}) => {
  const dateInputRef = React.useRef<HTMLInputElement>(null);

  const getVehicleDimension = (vehicle: any) => {
    if (!vehicle) return "";
    if (vehicle.dimension) return vehicle.dimension;
    if (vehicle.dimension_width && vehicle.dimension_height) {
      let dim = `${vehicle.dimension_height}m x ${vehicle.dimension_width}m`;
      if (vehicle.dimension_length) dim += ` x ${vehicle.dimension_length}m`;
      return dim;
    }
    return "N/A";
  };

  return (
    <>
      <div className="pt-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div>
            <Label className="mb-2 block">Delivery Type</Label>
            <Select
              value={selectedDeliveryType?.id?.toString() || ""}
              onValueChange={(value) => {
                const found = deliveryType?.find(
                  (item: any) => String(item.id) === value
                );
                if (found) {
                  setSelectedDeliveryType(found);
                  setFormData((prev: any) => ({
                    ...prev,
                    delivery_type: found.name,
                  }));
                }
              }}
            >
              <SelectTrigger className="w-full px-4 py-5 bg-[#FFFAE6] border border-gray-300 rounded">
                <SelectValue placeholder="Select Delivery Type">
                  {selectedDeliveryType?.name || "Select Delivery Type"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {deliveryType?.map((item: any) => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 block">Route Type</Label>
            <Select
              value={formData.route_type === "ONE_WAY" ? "oneway" : "round"}
              onValueChange={(value) => {
                const routeType = value === "oneway" ? "ONE_WAY" : "ROUND";
                setFormData((prev: any) => ({ ...prev, route_type: routeType }));
              }}
            >
              <SelectTrigger className="w-full px-4 py-5 bg-[#FFFAE6] border border-gray-300 rounded">
                <SelectValue placeholder="Select Route Type">
                  {formData.route_type === "ONE_WAY" ? "One Way" : "Round Trip"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="oneway">One Way</SelectItem>
                <SelectItem value="round">Round Trip</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 block">Select Vehicle</Label>
            <Select
              value={
                selectedVehicle?.id?.toString() ||
                formData.vehicle_type_id?.toString() ||
                ""
              }
              onValueChange={(value) => {
                const found = vehicleTypes?.find(
                  (item: any) => String(item.id) === value
                );
                if (found) {
                  setSelectedVehicle(found);
                  setFormData((prev: any) => ({
                    ...prev,
                    vehicle_type_id: found.id,
                  }));
                }
              }}
            >
              <SelectTrigger className="w-full px-4 py-5 bg-[#FFFAE6] border border-gray-300 rounded">
                <SelectValue placeholder="Select Vehicle">
                  {selectedVehicle
                    ? `${selectedVehicle.vehicle_type} (${getVehicleDimension(selectedVehicle)})`
                    : "Select Vehicle"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {vehicleTypes?.map((vehicle: any) => (
                  <SelectItem key={vehicle.id} value={String(vehicle.id)}>
                    {vehicle.vehicle_type} ({getVehicleDimension(vehicle)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 border border-gray-200 mb-6">
        <h3 className="text-lg font-semibold mb-4">Route</h3>
        <RadioGroup
          value={formData.isFixed ? "fixed" : "notfixed"}
          onValueChange={(value) => {
            setFormData((prev: any) => ({ ...prev, isFixed: value === "fixed" }));
          }}
          className="grid grid-cols-2 gap-4 mb-8"
        >
          <div className="flex items-center gap-2 border rounded p-4">
            <RadioGroupItem value="notfixed" id="notfixed" />
            <Label htmlFor="notfixed">Not Fixed</Label>
          </div>
          <div className="flex items-center gap-2 border rounded p-4">
            <RadioGroupItem value="fixed" id="fixed" />
            <Label htmlFor="fixed">Fixed</Label>
          </div>
        </RadioGroup>

        <h3 className="text-lg font-semibold mb-4">Collect Time</h3>
        <RadioGroup
          value={collectTimeOption}
          onValueChange={handleCollectTimeChange}
          className="grid grid-cols-2 gap-4 mb-8"
        >
          <div className="flex items-center gap-2 border rounded p-4">
            <RadioGroupItem value="now" id="now" />
            <Label htmlFor="now">Collect Time</Label>
          </div>
          <div className="flex flex-col gap-2 border rounded p-4">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="schedule" id="schedule" />
              <Label htmlFor="schedule">Schedule Time</Label>
            </div>
            <div className="relative mt-2">
              <Input
                ref={dateInputRef}
                id="schedule-date"
                type="datetime-local"
                value={scheduledDate}
                onChange={handleScheduledDateChange}
                disabled={collectTimeOption !== "schedule"}
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() =>
                  dateInputRef.current?.showPicker?.() ||
                  dateInputRef.current?.focus()
                }
                disabled={collectTimeOption !== "schedule"}
                className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Calendar size={18} />
              </button>
            </div>
          </div>
        </RadioGroup>
      </div>
    </>
  );
};

export default OrderConfiguration;