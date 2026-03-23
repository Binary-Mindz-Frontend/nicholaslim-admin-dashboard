/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useGetVehicleTypesQuery } from "@/redux/features/vehicleType/vehicleTypeApi";
import { useGetDeliveryTypesQuery } from "@/redux/features/deliveryTypes/deliveryTypesApi";
import {
  useCreateOrderMutation,
  usePlaceOrderMutation,
} from "@/redux/features/orderPlacement/orderPlacementApi";
import { validateForm } from "@/types/orderValidation";
import StripeCheckoutModal from "@/components/Stripe/StripeCheckoutModal";
import { OrderFormData, PayType } from "@/types/orderplaceType";
import OrderSummary from "./OrderSummary";
import RecipientManagement from "./RecipientManagement";
import OrderConfiguration from "./OrderConfiguration";
import { useOrderForm } from "@/hooks/useOrderForm";
// import OrderConfiguration from "./components/OrderConfiguration";
// import RecipientManagement from "./components/RecipientManagement";
// import OrderSummary from "./components/OrderSummary";
// import { useOrderForm } from "./hooks/useOrderForm";
// import { PayType, PAY_TYPE_DISPLAY, DISPLAY_TO_PAY_TYPE } from "./types";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface IndivisualOrderTabProps {
  data?: Partial<OrderFormData>;
}

const IndivisualOrderTab = ({ data = {} }: IndivisualOrderTabProps) => {
  // API Queries
  const { data: deliveryType } = useGetDeliveryTypesQuery(undefined);
  const { data: vehicleTypes } = useGetVehicleTypesQuery(undefined);
  const [createOrder] = useCreateOrderMutation();
  const [placeOrder] = usePlaceOrderMutation();

  // Custom hook for form state management
  const {
    formData,
    setFormData,
    sender,
    // setSender,
    recipients,
    // setRecipients,
    selectedDeliveryType,
    setSelectedDeliveryType,
    selectedVehicle,
    setSelectedVehicle,
    collectTimeOption,
    // setCollectTimeOption,
    scheduledDate,
    // setScheduledDate,
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
  } = useOrderForm();

  // Effects for initial data loading
  useEffect(() => {
    initializeFormData(data);
  }, [data, initializeFormData]);

  useEffect(() => {
    if (vehicleTypes?.data?.data) {
      const vehicleId = formData.vehicle_type_id;
      const vehicle = vehicleTypes.data.data.find(
        (item: any) => item.id === vehicleId
      );
      if (vehicle) {
        setSelectedVehicle(vehicle);
      }
    }
  }, [vehicleTypes, formData.vehicle_type_id]);

  useEffect(() => {
    if (deliveryType?.data?.data) {
      const deliveryName = formData.delivery_type;
      const delivery = deliveryType.data.data.find(
        (item: any) => item.name === deliveryName
      );
      if (delivery) {
        setSelectedDeliveryType(delivery);
      } else if (deliveryType.data.data.length > 0) {
        setSelectedDeliveryType(deliveryType.data.data[0]);
        setFormData((prev: any) => ({
          ...prev,
          delivery_type: deliveryType.data.data[0].name,
        }));
      }
    }
  }, [deliveryType, formData.delivery_type]);

  // Order placement function
  const placeOrderAfterCreation = useCallback(
    async (
      orderId: string,
      paymentMethod: string,
      paymentMethodId?: string
    ) => {
      try {
        const placeOrderData: any = {
          orderId,
          paymentMethod,
        };

        if (paymentMethod === "COD" || paymentMethod === "WALLET") {
          placeOrderData.codCollectFrom = "RECEIVER";
        }

        if (paymentMethod === "ONLINE_PAY" && paymentMethodId) {
          placeOrderData.paymentMethodId = paymentMethodId;
        }

        const response = await placeOrder(placeOrderData);

        if (response?.data?.success) {
         toast.success("Your order is confirmed and being prepared for shipment.");
        } else if (response) {
          toast.error(
            response?.data?.error?.message || "Failed to place order"
          );
        }
      } catch (error) {
        console.error("Error placing order:", error);
        toast.error("Order created but failed to place order");
      }
    },
    [placeOrder]
  );

  // Order creation handler
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

    // Prepare destinations
    const destinations = [
      {
        contact_name: sender.contact_name,
        contact_number: sender.contact_number,
        address: sender.address,
        floor_unit: sender.floor_unit,
        note_to_driver: sender.note_to_driver,
        type: "SENDER",
      },
      ...recipients.map((recipient: any) => ({
        contact_name: recipient.contact_name,
        contact_number: recipient.contact_number,
        address: recipient.address,
        floor_unit: recipient.floor_unit,
        note_to_driver: recipient.note_to_driver,
        type: "RECEIVER",
      })),
    ];

    // Prepare order data
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
        toast.error(response.data.error);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Order confirmation handler
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
      const paymentMethod =
        formData.pay_type === PayType.WALLET ? "WALLET" : "COD";
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

  return (
    <div>
      <OrderConfiguration
        deliveryType={deliveryType?.data?.data}
        vehicleTypes={vehicleTypes?.data?.data}
        selectedDeliveryType={selectedDeliveryType}
        selectedVehicle={selectedVehicle}
        formData={formData}
        setSelectedDeliveryType={setSelectedDeliveryType}
        setSelectedVehicle={setSelectedVehicle}
        setFormData={setFormData}
        collectTimeOption={collectTimeOption}
        scheduledDate={scheduledDate}
        handleCollectTimeChange={handleCollectTimeChange}
        handleScheduledDateChange={handleScheduledDateChange}
      />

      <RecipientManagement
        sender={sender}
        recipients={recipients}
        handleSenderInputChange={handleSenderInputChange}
        handleRecipientInputChange={handleRecipientInputChange}
        addRecipient={addRecipient}
        removeRecipient={removeRecipient}
      />

      {orderCreated && (
        <OrderSummary
          orderTotalFee={orderTotalFee}
          orderTotalCost={orderTotalCost}
          isSubmitting={isSubmitting}
          payType={formData.pay_type}
          payTypeDisplay={getDisplayPayType()}
          payTypeLabel={getPayTypeLabel()}
          onPaymentMethodChange={handlePaymentMethodChange}
          onCreateOrder={handleCreateOrder}
          onConfirmOrder={handleConfirmOrder}
          orderCreated={orderCreated}
        />
      )}

      {!orderCreated && (
        <div className="space-y-4">
          <button
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-md transition-colors"
            onClick={handleCreateOrder}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Order..." : "Create Order"}
          </button>
        </div>
      )}

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
