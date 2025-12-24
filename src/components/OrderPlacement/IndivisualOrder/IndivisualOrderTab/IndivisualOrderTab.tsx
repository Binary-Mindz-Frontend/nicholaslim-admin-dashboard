/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useRef, useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useGetVehicleTypesQuery } from "@/redux/features/vehicleType/vehicleTypeApi";
import { useGetDeliveryTypesQuery } from "@/redux/features/deliveryTypes/deliveryTypesApi";
import { useGetUserFeeStructureQuery } from "@/redux/features/userFeeStructure/userFeeStructureApi";
import { Textarea } from "@/components/ui/textarea";
import { useCreateOrderMutation } from "@/redux/features/orderPlacement/orderPlacementApi";

const IndivisualOrderTab = ({ data }: { data: any }) => {
  const { data: deliveryType } = useGetDeliveryTypesQuery(undefined);
  const { data: vehicleTypes } = useGetVehicleTypesQuery(undefined);
  const { data: userFeeStructure } = useGetUserFeeStructureQuery(undefined);

  const platformFee = userFeeStructure?.data[0].amount || 0;
  const [selectedDeliveryType, setSelectedDeliveryType] = useState<any>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  
  // State for form data
  const [formData, setFormData] = useState({
    route_type: "ONE_WAY",
    isFixed: false,
    delivery_type: "EXPRESS",
    vehicle_type_id: 3,
    collect_time: "ASAP",
    scheduled_time: "",
    total_cost: 0,
    has_additional_services: false,
    is_promo_used: false,
    notify_favorite_raider: false,
    pay_type: "COD",
    destinations: [
      {
        address: "",
        floor_unit: "",
        contact_name: "",
        contact_number: "",
        note_to_driver: "",
        type: "SENDER",
      },
      {
        address: "",
        floor_unit: "",
        contact_name: "",
        contact_number: "",
        note_to_driver: "",
        type: "RECEIVER",
      },
    ]
  });

  const [sender, setSender] = useState({
    contact_name: "",
    contact_number: "",
    address: "",
    floor_unit: "",
    note_to_driver: "",
  });

  const [receiver, setReceiver] = useState({
    contact_name: "",
    contact_number: "",
    address: "",
    floor_unit: "",
    note_to_driver: "",
  });

  const [collectTimeOption, setCollectTimeOption] = useState<"now" | "schedule">("now");
  const [scheduledDate, setScheduledDate] = useState("");

  const [createOrder] = useCreateOrderMutation();

  // Initialize form with provided data if available
  useEffect(() => {
    if (data) {
      setFormData(prev => ({
        ...prev,
        ...data,
        scheduled_time: data.scheduled_time || "",
        collect_time: data.collect_time || "ASAP",
      }));

      // Set collect time option based on data
      if (data.scheduled_time) {
        setCollectTimeOption("schedule");
        // Convert ISO string to datetime-local format (YYYY-MM-DDTHH:mm)
        const date = new Date(data.scheduled_time);
        const localDateTime = date.toISOString().slice(0, 16);
        setScheduledDate(localDateTime);
      } else {
        setCollectTimeOption("now");
      }

      // Set pay_type from data
      if (data.pay_type) {
        setFormData(prev => ({ ...prev, pay_type: data.pay_type }));
      }

      // Extract sender and receiver from destinations
      if (data.destinations && data.destinations.length > 0) {
        // Find sender destination
        const senderData = data.destinations.find((dest: any) => dest.type === "SENDER");
        if (senderData) {
          setSender({
            contact_name: senderData.contact_name || "",
            contact_number: senderData.contact_number || "",
            address: senderData.address || "",
            floor_unit: senderData.floor_unit || "",
            note_to_driver: senderData.note_to_driver || "",
          });
        }
        
        // Find receiver destination
        const receiverData = data.destinations.find((dest: any) => dest.type === "RECEIVER");
        if (receiverData) {
          setReceiver({
            contact_name: receiverData.contact_name || "",
            contact_number: receiverData.contact_number || "",
            address: receiverData.address || "",
            floor_unit: receiverData.floor_unit || "",
            note_to_driver: receiverData.note_to_driver || "",
          });
        }
      }
    }
  }, [data]);

  // Update selected vehicle when vehicle_type_id changes or vehicleTypes loads
  useEffect(() => {
    if (vehicleTypes?.data) {
      const vehicleId = formData.vehicle_type_id;
      const vehicle = vehicleTypes.data.find(
        (item: any) => item.id === vehicleId
      );
      if (vehicle) {
        setSelectedVehicle(vehicle);
      }
    }
  }, [vehicleTypes, formData.vehicle_type_id]);

  // Update selected delivery type when delivery_type changes or deliveryType loads
  useEffect(() => {
    if (deliveryType?.data) {
      const deliveryName = formData.delivery_type;
      const delivery = deliveryType.data.find(
        (item: any) => item.name === deliveryName
      );
      if (delivery) {
        setSelectedDeliveryType(delivery);
      } else if (deliveryType.data.length > 0) {
        // Set first delivery type as default if not found
        setSelectedDeliveryType(deliveryType.data[0]);
        setFormData(prev => ({ 
          ...prev, 
          delivery_type: deliveryType.data[0].name 
        }));
      }
    }
  }, [deliveryType, formData.delivery_type]);

  const deliveryPrice = useMemo(() => {
    if (!selectedVehicle || !selectedDeliveryType) return 0;

    const basePrice = Number(selectedVehicle.base_price);
    const percentage = Number(selectedDeliveryType.percentage);

    const discount = (basePrice * percentage) / 100;
    return basePrice - discount;
  }, [selectedVehicle, selectedDeliveryType]);

  const totalCost = deliveryPrice + platformFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string, type: "sender" | "receiver") => {
    const { value } = e.target;
    
    if (type === "sender") {
      setSender(prev => ({ ...prev, [field]: value }));
    } else if (type === "receiver") {
      setReceiver(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleCollectTimeChange = (value: string) => {
    setCollectTimeOption(value as "now" | "schedule");
    
    if (value === "now") {
      setFormData(prev => ({ 
        ...prev, 
        collect_time: "ASAP",
        scheduled_time: "" 
      }));
      setScheduledDate("");
    } else if (value === "schedule") {
      setFormData(prev => ({ 
        ...prev, 
        collect_time: "SCHEDULED" 
      }));
    }
  };

  const handleScheduledDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    setScheduledDate(dateValue);
    
    if (dateValue) {
      // Convert to ISO string
      const isoDate = new Date(dateValue).toISOString();
      setFormData(prev => ({ 
        ...prev, 
        scheduled_time: isoDate 
      }));
    }
  };

  const handleConfirmOrder = async () => {
    const orderData = {
      ...formData,
      total_cost: totalCost,
      vehicle_type_id: selectedVehicle?.id || formData.vehicle_type_id,
      delivery_type: selectedDeliveryType?.name || formData.delivery_type,
      collect_time: collectTimeOption === "now" ? "ASAP" : "SCHEDULED",
      scheduled_time: collectTimeOption === "schedule" && scheduledDate 
        ? new Date(scheduledDate).toISOString() 
        : null,
      destinations: [
        {
          ...sender,
          type: "SENDER",
        },
        {
          ...receiver,
          type: "RECEIVER",
        },
      ],
    };

    // Remove null scheduled_time if not scheduled
    if (collectTimeOption === "now") {
      delete orderData.scheduled_time;
    }

    console.log("Submitting order data:", orderData);

    try {
      const response = await createOrder(orderData);
      if (response?.data) {
        console.log("Order created successfully", response.data);
      }
      if (response?.error) {
        console.error("Order creation error:", response.error);
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  return (
    <div>
      {/* Delivery Details Section */}
      <div className="pt-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* Delivery Type */}
          <div>
            <Label className="mb-2 block">Delivery Type</Label>
            <Select
              value={selectedDeliveryType?.id?.toString() || ""}
              onValueChange={(value) => {
                const found = deliveryType?.data?.find(
                  (item: any) => String(item.id) === value
                );
                if (found) {
                  setSelectedDeliveryType(found);
                  setFormData(prev => ({ 
                    ...prev, 
                    delivery_type: found.name 
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
                {deliveryType?.data?.map((item: any) => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Route Type */}
          <div>
            <Label className="mb-2 block">Route Type</Label>
            <Select
              value={formData.route_type === "ONE_WAY" ? "oneway" : "round"}
              onValueChange={(value) => {
                // Map UI value to API expected value
                const routeType = value === "oneway" ? "ONE_WAY" : "ROUND";
                setFormData(prev => ({ ...prev, route_type: routeType }));
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

          {/* Vehicle Type */}
          <div>
            <Label className="mb-2 block">Select Vehicle</Label>
            <Select
              value={selectedVehicle?.id?.toString() || formData.vehicle_type_id?.toString() || ""}
              onValueChange={(value) => {
                const found = vehicleTypes?.data?.find(
                  (item: any) => String(item.id) === value
                );
                if (found) {
                  setSelectedVehicle(found);
                  setFormData(prev => ({ 
                    ...prev, 
                    vehicle_type_id: found.id 
                  }));
                }
              }}
            >
              <SelectTrigger className="w-full px-4 py-5 bg-[#FFFAE6] border border-gray-300 rounded">
                <SelectValue placeholder="Select Vehicle">
                  {selectedVehicle ? `${selectedVehicle.vehicle_type} (${selectedVehicle.dimension})` : "Select Vehicle"}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                {vehicleTypes?.data?.map((vehicle: any) => (
                  <SelectItem key={vehicle.id} value={String(vehicle.id)}>
                    {vehicle.vehicle_type} ({vehicle.dimension})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Route & Services */}
      <div className="bg-white rounded-lg p-8 border border-gray-200 mb-6">
        <h3 className="text-lg font-semibold mb-4">Route</h3>
        <RadioGroup
          value={formData.isFixed ? "fixed" : "notfixed"}
          onValueChange={(value) => {
            setFormData(prev => ({ 
              ...prev, 
              isFixed: value === "fixed" 
            }));
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

      {/* Sender and Receiver Information */}
      <div className="bg-white rounded-lg p-8 border border-gray-200 mb-6">
        {/* Sender Information */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <Label className="mb-2">Sender Name</Label>
            <Input
              value={sender.contact_name}
              onChange={(e) => handleInputChange(e, "contact_name", "sender")}
              placeholder="Sender Name"
            />
          </div>
          <div>
            <Label className="mb-2">Sender Number</Label>
            <Input
              value={sender.contact_number}
              onChange={(e) => handleInputChange(e, "contact_number", "sender")}
              placeholder="Sender Number"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <Label className="mb-2">Sender Address</Label>
            <Input
              value={sender.address}
              onChange={(e) => handleInputChange(e, "address", "sender")}
              placeholder="Sender Address"
            />
          </div>
          <div>
            <Label className="mb-2">Floor or Unit no.</Label>
            <Input
              value={sender.floor_unit}
              onChange={(e) => handleInputChange(e, "floor_unit", "sender")}
              placeholder="Floor or Unit no."
            />
          </div>
        </div>

        <div>
          <Label className="mb-2">Note to driver</Label>
          <Textarea
            value={sender.note_to_driver}
            onChange={(e) => handleInputChange(e, "note_to_driver", "sender")}
            className="h-32"
            placeholder="Note to driver"
          />
        </div>
      </div>

      {/* Receiver Information */}
      <div className="bg-white rounded-lg p-8 border border-gray-200 mb-6">
        {/* Receiver Information */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <Label className="mb-2">Recipient 1</Label>
            <Input
              value={receiver.contact_name}
              onChange={(e) => handleInputChange(e, "contact_name", "receiver")}
              placeholder="Recipient 1"
            />
          </div>
          <div>
            <Label className="mb-2">Recipient 1 Number</Label>
            <Input
              value={receiver.contact_number}
              onChange={(e) => handleInputChange(e, "contact_number", "receiver")}
              placeholder="Recipient 1 Number"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label className="mb-2">Recipient 1 Address</Label>
            <Input
              value={receiver.address}
              onChange={(e) => handleInputChange(e, "address", "receiver")}
              placeholder="Recipient 1 Address"
            />
          </div>
          <div>
            <Label className="mb-2">Floor or Unit no.</Label>
            <Input
              value={receiver.floor_unit}
              onChange={(e) => handleInputChange(e, "floor_unit", "receiver")}
              placeholder="Floor or Unit no."
            />
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg p-8 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h2>
        <div className="space-y-4 mb-8">
          <div className="flex justify-between text-gray-700">
            <span>Delivery</span>
            <span>{deliveryPrice > 0 ? `$${deliveryPrice.toFixed(2)}` : "$0.00"}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Fee</span>
            <span>+S${platformFee}</span>
          </div>
          <div className="border-t pt-4 flex justify-between text-lg font-semibold text-gray-900">
            <span>Total</span> <span>+${totalCost.toFixed(2)}</span>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <Label className="mb-0">Payment method</Label>
          <Select 
            value={formData.pay_type === "COD" ? "cash" : formData.pay_type.toLowerCase()}
            onValueChange={(value) => {
              const payType = value === "cash" ? "COD" : value.toUpperCase();
              setFormData(prev => ({ ...prev, pay_type: payType }));
            }}
          >
            <SelectTrigger className="w-[20%]">
              <SelectValue placeholder="Select payment method">
                {formData.pay_type === "COD" ? "COD" : formData.pay_type}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">COD</SelectItem>
              <SelectItem value="stripe">Stripe</SelectItem>
              <SelectItem value="card">Card</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        className="w-full bg-yellow-400 cursor-pointer mt-5 hover:bg-yellow-500 text-gray-900 font-bold py-3"
        onClick={handleConfirmOrder}
      >
        Confirm order
      </Button>
    </div>
  );
};

export default IndivisualOrderTab;