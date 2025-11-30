import CancelOrderModal from "@/components/OrderConfirmed/CancelOrderModal/CancelOrderModal";
import FinancialDetails from "@/components/OrderConfirmed/FinancialDetails/FinancialDetails";
import OrderForm from "@/components/OrderConfirmed/OrderForm/OrderForm";
import OrderPending from "@/components/OrderConfirmed/OrderPending/OrderPending";
import OrderTrackingTimeline from "@/components/OrderConfirmed/OrderTracking/OrderTracking";
import OrderTrackingMap from "@/components/OrderConfirmed/OrderTrackingMap/OrderTrackingMap";
import RiderDetails from "@/components/OrderConfirmed/RiderDetails/RiderDetails";
import { useState } from "react";
export interface OrderData {
  orderNumber: string;
  deliveryDate: string;
  deliveryTime: string;
  totalAmount: string;
  paymentMethod: string;
  cardLast4: string;
  status: "pending" | "processing" | "completed";
}


const OrderConfirmed = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderData] = useState<OrderData>({
    orderNumber: "#1088",
    deliveryDate: "25 Sep 2025",
    deliveryTime: "11:30 am",
    totalAmount: "$24.00",
    paymentMethod: "Visa",
    cardLast4: "456",
    status: "pending",
  });

  const trackingSteps = [
    {
      title: "Order has been placed",
      date: "25 Aug",
      time: "09:30",
    },
    {
      title: "Collected from (Sender: Athena Lin)",
      subtitle: "Blk 657 Ang Mo Kio Ave 9, S560657",
      date: "25 Aug",
      time: "10:00",
    },
    {
      title: "Deliver to (Recipient: Joseph Low)",
      subtitle: "Blk 222 Sengkang Ave 2, S530222",
      date: "25 Aug",
      time: "10:20",
    },
    {
      title: "Deliver to (Recipient: Annie Tan)",
      subtitle: "Blk 447 Sengkang Ave 4, S530447",
      date: "25 Aug",
      time: "10:40",
    },
    {
      title: "Deliver to (Recipient: Tony Toh)",
      subtitle: "Blk 244 Jurong East St 61, S500244",
      date: "25 Aug",
      time: "11:30",
    },
  ];

  return (
    <div>
      <OrderTrackingMap />
      <OrderForm />
      <RiderDetails />
      <div className="flex justify-between gap-6">
        <OrderPending data={orderData} />
        <OrderTrackingTimeline steps={trackingSteps} />
      </div>
      <div className="flex items-center justify-center bg-gray-100 mt-8">
        <FinancialDetails onCancelClick={() => setIsModalOpen(true)} />
        <CancelOrderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default OrderConfirmed;
