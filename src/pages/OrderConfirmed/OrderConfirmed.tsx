import CancelOrderModal from "@/components/OrderConfirmed/CancelOrderModal/CancelOrderModal";
import FinancialDetails from "@/components/OrderConfirmed/FinancialDetails/FinancialDetails";
import OrderForm from "@/components/OrderConfirmed/OrderForm/OrderForm";
import OrderTrackingMap from "@/components/OrderConfirmed/OrderTrackingMap/OrderTrackingMap";
import { useState } from "react";

const OrderConfirmed = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div>
      <OrderTrackingMap />
      <OrderForm />
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
