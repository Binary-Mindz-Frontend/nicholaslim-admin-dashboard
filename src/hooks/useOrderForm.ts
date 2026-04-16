/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayType,DISPLAY_TO_PAY_TYPE,PAY_TYPE_DISPLAY } from "@/types/orderplaceType";
import { useState, useCallback } from "react";
// import { PayType, PAY_TYPE_DISPLAY, DISPLAY_TO_PAY_TYPE } from "../types";

export const useOrderForm = () => {
  const [formData, setFormData] = useState({
    route_type: "ONE_WAY",
    isFixed: false,
    delivery_type_id: 1,
    vehicle_type_id: 1,
    collect_time: "ASAP",
    total_cost: 0,
    has_additional_services: false,
    is_promo_used: false,
    notify_favorite_raider: false,
    pay_type: PayType.COD,
    destinations: [],
  });

  const [sender, setSender] = useState({
    contact_name: "",
    contact_number: "",
    address: "",
    floor_unit: "",
    note_to_driver: "",
    postal_code: "",
  });

  const [recipients, setRecipients] = useState([
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

  const [selectedDeliveryType, setSelectedDeliveryType] = useState<any>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [collectTimeOption, setCollectTimeOption] = useState<"now" | "schedule">("now");
  const [scheduledDate, setScheduledDate] = useState("");
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [orderTotalCost, setOrderTotalCost] = useState<number | null>(null);
  const [orderTotalFee, setOrderTotalFee] = useState<number | null>(null);
  const [orderCreated, setOrderCreated] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);

  const initializeFormData = useCallback((data: any) => {
    if (data && Object.keys(data).length > 0) {
      const updatedFormData = {
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

      setFormData((prev) => ({ ...prev, ...updatedFormData }));

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
              ...receiverData,
            }))
          );
        }
      }
    }
  }, []);

  const handlePaymentMethodChange = useCallback((value: string) => {
    const payType = DISPLAY_TO_PAY_TYPE[value];
    if (payType) {
      setFormData((prev) => ({ ...prev, pay_type: payType }));
    }
  }, []);

  const getDisplayPayType = useCallback(() => {
    const displayValue = PAY_TYPE_DISPLAY[formData.pay_type as PayType];
    return displayValue || "cash";
  }, [formData.pay_type]);

  const getPayTypeLabel = useCallback(() => {
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
  }, [formData.pay_type]);

  const addRecipient = useCallback(() => {
    const newRecipient = {
      id: `recipient-${Date.now()}`,
      contact_name: "",
      contact_number: "",
      address: "",
      floor_unit: "",
      note_to_driver: "",
      postal_code: "",
    };
    setRecipients((prev) => [...prev, newRecipient]);
  }, []);

  const removeRecipient = useCallback((recipientId: string) => {
    setRecipients((prev) => prev.filter((r) => r.id !== recipientId));
  }, []);

  const handleCollectTimeChange = useCallback((value: string) => {
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
  }, []);

  const handleScheduledDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const dateValue = e.target.value;
      setScheduledDate(dateValue);
      if (dateValue) {
        const isoDate = new Date(dateValue).toISOString();
        setFormData((prev) => ({
          ...prev,
          scheduled_time: isoDate,
        }));
      }
    },
    []
  );

  const handleSenderInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
      const { value } = e.target;
      setSender((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleRecipientInputChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      recipientId: string,
      field: string
    ) => {
      const { value } = e.target;
      setRecipients((prev) =>
        prev.map((recipient) =>
          recipient.id === recipientId
            ? { ...recipient, [field]: value }
            : recipient
        )
      );
    },
    []
  );

  return {
    formData,
    setFormData,
    sender,
    setSender,
    recipients,
    setRecipients,
    selectedDeliveryType,
    setSelectedDeliveryType,
    selectedVehicle,
    setSelectedVehicle,
    collectTimeOption,
    setCollectTimeOption,
    scheduledDate,
    setScheduledDate,
    createdOrderId,
    setCreatedOrderId,
    orderTotalCost,
    setOrderTotalCost,
    orderTotalFee,
    setOrderTotalFee,
    orderCreated,
    setOrderCreated,
    isSubmitting,
    setIsSubmitting,
    isStripeModalOpen,
    setIsStripeModalOpen,
    initializeFormData,
    handlePaymentMethodChange,
    getDisplayPayType,
    getPayTypeLabel,
    addRecipient,
    removeRecipient,
    handleCollectTimeChange,
    handleScheduledDateChange,
    handleSenderInputChange,
    handleRecipientInputChange,
  };
};