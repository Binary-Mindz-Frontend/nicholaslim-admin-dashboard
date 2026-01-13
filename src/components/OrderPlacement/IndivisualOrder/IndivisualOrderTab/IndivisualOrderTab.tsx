
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
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
import { Calendar, X } from "lucide-react";
import { useGetVehicleTypesQuery } from "@/redux/features/vehicleType/vehicleTypeApi";
import { useGetDeliveryTypesQuery } from "@/redux/features/deliveryTypes/deliveryTypesApi";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateOrderMutation,
  usePlaceOrderMutation,
} from "@/redux/features/orderPlacement/orderPlacementApi";
import {
  validateForm,
  SenderReceiverData,
  OrderFormData,
} from "@/types/orderValidation";
import StripeCheckoutModal from "@/components/Stripe/StripeCheckoutModal";

enum PayType {
  COD = "COD",
  WALLET = "WALLET",
  ONLINE_PAY = "ONLINE_PAY",
}

const PAY_TYPE_DISPLAY: Record<PayType, string> = {
  [PayType.COD]: "cash",
  [PayType.ONLINE_PAY]: "stripe",
  [PayType.WALLET]: "wallet",
};

const DISPLAY_TO_PAY_TYPE: Record<string, PayType> = {
  cash: PayType.COD,
  stripe: PayType.ONLINE_PAY,
  wallet: PayType.WALLET,
};

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface IndivisualOrderTabProps {
  data?: Partial<OrderFormData>;
}

interface RecipientData extends SenderReceiverData {
  id: string;
}

const IndivisualOrderTab = ({ data = {} }: IndivisualOrderTabProps) => {
  const { data: deliveryType } = useGetDeliveryTypesQuery(undefined);
  const { data: vehicleTypes } = useGetVehicleTypesQuery(undefined);

  const [selectedDeliveryType, setSelectedDeliveryType] = useState<any>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

  const dateInputRef = useRef<HTMLInputElement>(null);

  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [orderTotalCost, setOrderTotalCost] = useState<number | null>(null);
  const [orderTotalFee, setOrderTotalFee] = useState<number | null>(null);
  const [orderCreated, setOrderCreated] = useState<boolean>(false);

  const [formData, setFormData] = useState<OrderFormData>({
    route_type: "ONE_WAY",
    isFixed: false,
    delivery_type: "EXPRESS",
    vehicle_type_id: 1,
    collect_time: "ASAP",
    total_cost: 0,
    has_additional_services: false,
    is_promo_used: false,
    notify_favorite_raider: false,
    pay_type: PayType.COD,
    destinations: [
      {
        address: "",
        postal_code: "",
        floor_unit: "",
        contact_name: "",
        contact_number: "",
        note_to_driver: "",

        type: "SENDER",
      },
      {
        address: "",
        postal_code: "",
        floor_unit: "",
        contact_name: "",
        contact_number: "",
        note_to_driver: "",
        type: "RECEIVER",
      },
    ],
  });

  const [sender, setSender] = useState<SenderReceiverData>({
    contact_name: "",
    contact_number: "",
    address: "",
    floor_unit: "",
    note_to_driver: "",
    postal_code: "",
  });

  const [recipients, setRecipients] = useState<RecipientData[]>([
    {
      id: "recipient-1",
      contact_name: "",
      contact_number: "",
      address: "",
      floor_unit: "",
      note_to_driver: "",
      postal_code: "",
    },
  ]);

  const [collectTimeOption, setCollectTimeOption] = useState<
    "now" | "schedule"
  >("now");
  const [scheduledDate, setScheduledDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createOrder] = useCreateOrderMutation();
  const [placeOrder] = usePlaceOrderMutation();

  useEffect(() => {}, [formData.pay_type]);

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      const updatedFormData: Partial<OrderFormData> = {
        ...data,
        collect_time: (data.collect_time as "ASAP" | "SCHEDULED") || "ASAP",
      };

      if (data.scheduled_time) {
        setCollectTimeOption("schedule");
        const date = new Date(data.scheduled_time);
        const localDateTime = date.toISOString().slice(0, 16);
        setScheduledDate(localDateTime);
        updatedFormData.scheduled_time = data.scheduled_time;
      } else {
        setCollectTimeOption("now");
        updatedFormData.scheduled_time = undefined;
      }

      if (data.pay_type) {
        updatedFormData.pay_type = data.pay_type as PayType;
      }

      setFormData((prev) => ({ ...prev, ...updatedFormData } as OrderFormData));

      if (data.destinations && data.destinations.length > 0) {
        const senderData = data.destinations.find(
          (dest: any) => dest.type === "SENDER"
        );
        if (senderData) {
          setSender({
            contact_name: senderData.contact_name || "",
            contact_number: senderData.contact_number || "",
            address: senderData.address || "",
            floor_unit: senderData.floor_unit || "",
            note_to_driver: senderData.note_to_driver || "",
            postal_code: senderData.postal_code || "",
          });
        }

        const receiverDataList = data.destinations.filter(
          (dest: any) => dest.type === "RECEIVER"
        );
        if (receiverDataList.length > 0) {
          setRecipients(
            receiverDataList.map((receiverData: any, index: number) => ({
              id: `recipient-${index + 1}`,
              contact_name: receiverData.contact_name || "",
              contact_number: receiverData.contact_number || "",
              address: receiverData.address || "",
              floor_unit: receiverData.floor_unit || "",
              note_to_driver: receiverData.note_to_driver || "",
              postal_code: receiverData.postal_code || "",
            }))
          );
        }
      }
    }
  }, [data]);

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

  useEffect(() => {
    if (deliveryType?.data) {
      const deliveryName = formData.delivery_type;
      const delivery = deliveryType.data.find(
        (item: any) => item.name === deliveryName
      );
      if (delivery) {
        setSelectedDeliveryType(delivery);
      } else if (deliveryType.data.length > 0) {
        setSelectedDeliveryType(deliveryType.data[0]);
        setFormData((prev) => ({
          ...prev,
          delivery_type: deliveryType.data[0].name,
        }));
      }
    }
  }, [deliveryType, formData.delivery_type]);

  const handleSenderInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof SenderReceiverData
  ) => {
    const { value } = e.target;
    setSender((prev) => ({ ...prev, [field]: value }));
  };

  const handleRecipientInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    recipientId: string,
    field: keyof SenderReceiverData
  ) => {
    const { value } = e.target;
    setRecipients((prev) =>
      prev.map((recipient) =>
        recipient.id === recipientId
          ? { ...recipient, [field]: value }
          : recipient
      )
    );
  };

  const addRecipient = () => {
    const newRecipient: RecipientData = {
      id: `recipient-${Date.now()}`,
      contact_name: "",
      contact_number: "",
      address: "",
      floor_unit: "",
      note_to_driver: "",
      postal_code: "",
    };
    setRecipients((prev) => [...prev, newRecipient]);
  };

  const removeRecipient = (recipientId: string) => {
    if (recipients.length > 1) {
      setRecipients((prev) => prev.filter((r) => r.id !== recipientId));
    } else {
      toast.error("At least one recipient is required");
    }
  };

  const handleCollectTimeChange = (value: string) => {
    setCollectTimeOption(value as "now" | "schedule");

    if (value === "now") {
      setFormData((prev) => ({
        ...prev,
        collect_time: "ASAP",
        scheduled_time: undefined,
      }));
      setScheduledDate("");
    } else if (value === "schedule") {
      setFormData((prev) => ({
        ...prev,
        collect_time: "SCHEDULED",
      }));
    }
  };

  const handleScheduledDateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const dateValue = e.target.value;
    setScheduledDate(dateValue);

    if (dateValue) {
      const isoDate = new Date(dateValue).toISOString();
      setFormData((prev) => ({
        ...prev,
        scheduled_time: isoDate,
      }));
    }
  };

  const placeOrderAfterCreation = async (
    orderId: string,
    paymentMethod: string,
    paymentMethodId?: string
  ) => {
    try {
      const placeOrderData: any = {
        orderId,
        paymentMethod: paymentMethod,
      };

      if (paymentMethod === "COD" || paymentMethod === "WALLET") {
        placeOrderData.codCollectFrom = "RECEIVER";
      }

      if (paymentMethod === "ONLINE_PAY" && paymentMethodId) {
        placeOrderData.paymentMethodId = paymentMethodId;
      }

      const response = await placeOrder(placeOrderData);

      console.log(response, "respnse" );
      // console.log(first)

      if (response?.data?.success) {
        toast.success("Order confirmed!");
      } else if (response) {
        toast.error(response?.data?.error?.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Order created but failed to place order");
    }
  };

  const handleCreateOrder = async () => {
    // Validate all recipients
    for (let i = 0; i < recipients.length; i++) {
      if (
        !validateForm(
          sender,
          recipients[i],
          selectedDeliveryType,
          selectedVehicle,
          collectTimeOption,
          scheduledDate
        )
      ) {
        toast.error(`Please fill all required fields for recipient ${i + 1}`);
        return;
      }
    }

    setIsSubmitting(true);

    // Prepare destinations without postal_code (backend doesn't accept it)
    const destinations = [
      {
        contact_name: sender.contact_name,
        contact_number: sender.contact_number,
        address: sender.address,
        floor_unit: sender.floor_unit,
        note_to_driver: sender.note_to_driver,
        type: "SENDER",
      },
      ...recipients.map((recipient) => ({
        contact_name: recipient.contact_name,
        contact_number: recipient.contact_number,
        address: recipient.address,
        floor_unit: recipient.floor_unit,
        note_to_driver: recipient.note_to_driver,
        type: "RECEIVER",
      })),
    ];

    // Prepare order data without properties backend doesn't accept
    const orderData: any = {
      route_type: formData.route_type,
      isFixed: formData.isFixed,
      delivery_type: selectedDeliveryType?.name || formData.delivery_type,
      vehicle_type_id: selectedVehicle?.id || formData.vehicle_type_id,
      collect_time: collectTimeOption === "now" ? "ASAP" : "SCHEDULED",
      has_additional_services: formData.has_additional_services,
      destinations,
    };

    if (collectTimeOption === "schedule" && scheduledDate) {
      orderData.scheduled_time = new Date(scheduledDate).toISOString();
    }

    try {
      const response = await createOrder(orderData);

      const orderId = response?.data?.data?.order?.id;
      const totalCostFromBackend = response?.data?.data?.order?.total_cost;
      const total_fee = response?.data?.data?.order?.total_fee;

      console.log(total_fee);

      const totalCostNumber = totalCostFromBackend
        ? typeof totalCostFromBackend === "string"
          ? parseFloat(totalCostFromBackend)
          : Number(totalCostFromBackend)
        : 0;

      if (response?.data?.success === true) {
        toast.success("Order created successfully!");

        setCreatedOrderId(orderId);
        setOrderTotalCost(totalCostNumber);
        setOrderTotalFee(total_fee);
        setOrderCreated(true);
      } else if (response?.data?.error) {
        console.error("Order creation error:", response.data.error);
        toast.error(response.data.error);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmOrder = async () => {
    if (!createdOrderId) {
      toast.error(
        "Order information is missing. Please create the order first."
      );
      return;
    }

    if (formData.pay_type === PayType.ONLINE_PAY) {
      setIsStripeModalOpen(true);
      return;
    }

    await processOrderConfirmation();
  };

  const processOrderConfirmation = async () => {
    setIsSubmitting(true);

    try {
      let paymentMethod = "COD";
      if (formData.pay_type === PayType.WALLET) {
        paymentMethod = "WALLET";
      }

      await placeOrderAfterCreation(createdOrderId!, paymentMethod);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = (paymentMethodId: string) => {
    setIsStripeModalOpen(false);

    if (createdOrderId && paymentMethodId) {
      placeOrderAfterCreation(createdOrderId, "ONLINE_PAY", paymentMethodId);
    }
  };

  const handlePaymentMethodChange = (value: string) => {
    const payType = DISPLAY_TO_PAY_TYPE[value];
    if (payType) {
      setFormData((prev) => ({ ...prev, pay_type: payType }));
    }
  };

  const getDisplayPayType = (): string => {
    const displayValue = PAY_TYPE_DISPLAY[formData.pay_type as PayType];
    if (!displayValue) return "cash";
    return displayValue;
  };

  const getPayTypeLabel = (): string => {
    switch (formData.pay_type) {
      case PayType.COD:
        return "COD";
      case PayType.ONLINE_PAY:
        return "Stripe";
      case PayType.WALLET:
        return "Wallet";
      default:
        return "Select";
    }
  };

  return (
    <div>
      <div className="pt-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
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
                  setFormData((prev) => ({
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
                {deliveryType?.data?.map((item: any) => (
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
                setFormData((prev) => ({ ...prev, route_type: routeType }));
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
                const found = vehicleTypes?.data?.find(
                  (item: any) => String(item.id) === value
                );
                if (found) {
                  setSelectedVehicle(found);
                  setFormData((prev) => ({
                    ...prev,
                    vehicle_type_id: found.id,
                  }));
                }
              }}
            >
              <SelectTrigger className="w-full px-4 py-5 bg-[#FFFAE6] border border-gray-300 rounded">
                <SelectValue placeholder="Select Vehicle">
                  {selectedVehicle
                    ? `${selectedVehicle.vehicle_type} (${selectedVehicle.dimension})`
                    : "Select Vehicle"}
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

      <div className="bg-white rounded-lg p-8 border border-gray-200 mb-6">
        <h3 className="text-lg font-semibold mb-4">Route</h3>
        <RadioGroup
          value={formData.isFixed ? "fixed" : "notfixed"}
          onValueChange={(value) => {
            setFormData((prev) => ({ ...prev, isFixed: value === "fixed" }));
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

      {/* Sender Info */}
      <div className="bg-white rounded-lg p-8 border border-gray-200 mb-6">
        <h3 className="text-lg font-medium mb-4">Sender Info</h3>
        <div className="grid grid-cols-2 gap-6 mb-4">
          <div>
            <Label className="mb-2">Name</Label>
            <Input
              value={sender.contact_name}
              onChange={(e) => handleSenderInputChange(e, "contact_name")}
              placeholder="Enter Name"
              required
            />
          </div>
          <div>
            <Label className="mb-2">Number</Label>
            <Input
              type="tel"
              value={sender.contact_number}
              onChange={(e) => handleSenderInputChange(e, "contact_number")}
              placeholder="Enter Number"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div>
            <Label className="mb-2">Postal Code</Label>
            <Input
              type="number"
              value={sender.postal_code}
              onChange={(e) => handleSenderInputChange(e, "postal_code")}
              placeholder="Enter postal code"
              required
            />
          </div>
          <div>
            <Label className="mb-2">Address</Label>
            <Input
              value={sender.address}
              onChange={(e) => handleSenderInputChange(e, "address")}
              placeholder="Enter Address"
              required
            />
          </div>
          <div>
            <Label className="mb-2">Floor or Unit no.</Label>
            <Input
              value={sender.floor_unit}
              onChange={(e) => handleSenderInputChange(e, "floor_unit")}
              placeholder="Floor or Unit no."
            />
          </div>
        </div>

        <div>
          <Label className="mb-2">Note to driver</Label>
          <Textarea
            value={sender.note_to_driver}
            onChange={(e) => handleSenderInputChange(e, "note_to_driver")}
            className="h-32"
            placeholder="Note to driver"
          />
        </div>
      </div>

      {/* Recipients Info */}
      {recipients.map((recipient, index) => (
        <div
          key={recipient.id}
          className="bg-white rounded-lg p-8 border border-gray-200 mb-6 relative"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">
              Recipient Info {index + 1}
            </h3>
            {recipients.length > 1 && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeRecipient(recipient.id)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <X size={16} />
                
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <Label className="mb-2">Recipient</Label>
              <Input
                value={recipient.contact_name}
                onChange={(e) =>
                  handleRecipientInputChange(e, recipient.id, "contact_name")
                }
                placeholder="Enter Recipient"
                required
              />
            </div>
            <div>
              <Label className="mb-2">Number</Label>
              <Input
                value={recipient.contact_number}
                onChange={(e) =>
                  handleRecipientInputChange(e, recipient.id, "contact_number")
                }
                placeholder="Enter Number"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <Label className="mb-2">Postal Code</Label>
              <Input
                type="number"
                value={recipient.postal_code}
                onChange={(e) =>
                  handleRecipientInputChange(e, recipient.id, "postal_code")
                }
                placeholder="Enter postal code"
                required
              />
            </div>
            <div>
              <Label className="mb-2">Address</Label>
              <Input
                value={recipient.address}
                onChange={(e) =>
                  handleRecipientInputChange(e, recipient.id, "address")
                }
                placeholder="Enter Address"
                required
              />
            </div>
            <div>
              <Label className="mb-2">Floor or Unit no.</Label>
              <Input
                value={recipient.floor_unit}
                onChange={(e) =>
                  handleRecipientInputChange(e, recipient.id, "floor_unit")
                }
                placeholder="Floor or Unit no."
              />
            </div>
          </div>

          <div>
            <Label className="mb-2">Note to driver</Label>
            <Textarea
              value={recipient.note_to_driver}
              onChange={(e) =>
                handleRecipientInputChange(e, recipient.id, "note_to_driver")
              }
              className="h-32"
              placeholder="Note to driver"
            />
          </div>
        </div>
      ))}

      <Button
        type="button"
        onClick={addRecipient}
        className="mb-6 bg-yellow-400 py-3 mx-auto block cursor-pointer text-black hover:bg-yellow-500 rounded-md"
      >
        Add more recipient
      </Button>

      {orderCreated && orderTotalCost !== null && (
        <div className="bg-white rounded-lg p-8 border border-gray-200 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Order Summary
          </h2>
          <div className="space-y-4">
            <div className="border-t pt-2 pb-2.5 flex justify-between text-lg font-semibold text-gray-900">
              <span>Fee</span>
              <span>${orderTotalFee}</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="border-t pt-4 flex justify-between text-lg font-semibold text-gray-900">
              <span>Total</span>
              <span>${orderTotalCost?.toFixed(2)}</span>
            </div>
          </div>

          <div className="mb-6 flex items-center justify-between mt-8">
            <Label className="mb-0">Payment method</Label>
            <Select
              value={getDisplayPayType()}
              onValueChange={handlePaymentMethodChange}
              disabled={isSubmitting}
            >
              <SelectTrigger className="w-[20%]">
                <SelectValue placeholder="Select payment method">
                  {getPayTypeLabel()}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">COD</SelectItem>
                <SelectItem value="stripe">Stripe</SelectItem>
                <SelectItem value="wallet">Wallet</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <Button
          className="w-full bg-yellow-400 cursor-pointer hover:bg-yellow-500 text-gray-900 font-bold py-3"
          onClick={handleCreateOrder}
          disabled={isSubmitting || orderCreated}
        >
          {isSubmitting
            ? "Creating Order..."
            : orderCreated
            ? "Order Created"
            : "Create Order"}
        </Button>

        {orderCreated && orderTotalCost !== null && (
          <Button
            className="w-full bg-yellow-500 cursor-pointer hover:bg-yellow-600 text-white font-bold py-3"
            onClick={handleConfirmOrder}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Confirming..."
              : formData.pay_type === PayType.ONLINE_PAY
              ? "Proceed to Payment"
              : "Confirm Order"}
          </Button>
        )}
      </div>

      {isStripeModalOpen && createdOrderId && orderTotalCost !== null && (
        <Elements stripe={stripePromise}>
          <StripeCheckoutModal
            isOpen={isStripeModalOpen}
            onClose={() => setIsStripeModalOpen(false)}
            totalAmount={orderTotalCost}
            orderId={createdOrderId}
            createdUserId={null}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </Elements>
      )}
    </div>
  );
};

export default IndivisualOrderTab;