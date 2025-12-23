/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetSingleOrderQuery } from "@/redux/features/orders/ordersApi";
import OrderForm from "./components/orderForm";
import RiderDetails from "./components/RiderDetails";
import OrderPending from "./components/OrderPending";
import OrderTrackingTimeline from "./components/OrderTrackingTimeline";
import FinancialDetails from "./components/FinancialDetails";
import CancelOrderModal from "./components/CancelOrderModal";

export interface OrderData {
    orderNumber: string;
    deliveryDate: string;
    deliveryTime: string;
    totalAmount: string;
    paymentMethod: string;
    cardLast4: string;
    status: string;
}
const ViewTrackOrder = () => {
    const { id } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 1. Get status variables from the hook
    const { data: response, isLoading, isError } = useGetSingleOrderQuery(id);
    
    // 2. Log the response to see the structure in your browser console
    console.log("Full API Response:", response);
    
    const order = response?.data;
    console.log("Order Data:", order);

    // 3. CRITICAL: If data is still loading, show a loading state
    if (isLoading) {
        return <div className="p-10 text-center">Loading order data...</div>;
    }

    // 4. CRITICAL: If there's an error or no order found, show an error state
    if (isError || !order) {
        return <div className="p-10 text-center text-red-500">Error: Order not found.</div>;
    }

    // --- Only runs if 'order' is defined ---

    const mappedOrderData: OrderData = {
        orderNumber: `#${order.id}`,
        deliveryDate: new Date(order.created_at).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        }),
        deliveryTime: order.collect_time || "ASAP",
        totalAmount: `$${order.total_cost}`,
        paymentMethod: order.pay_type,
        cardLast4: "N/A",
        status: order.order_status?.toLowerCase() || "pending", 
    };

    const trackingSteps = order.destinations?.map((dest: any) => ({
        title: dest.type === "SENDER" ? `Collected from (Sender: ${dest.contact_name})` : `Deliver to (Recipient: ${dest.contact_name})`,
        subtitle: dest.address,
        date: new Date(order.created_at).toLocaleDateString("en-GB", { day: 'numeric', month: 'short' }),
        time: new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })) || [];

    // Use a copy to avoid mutating the original array if it's strictly typed
    const finalSteps = [
        {
            title: "Order has been placed",
            subtitle: "System recorded",
            date: new Date(order.created_at).toLocaleDateString("en-GB", { day: 'numeric', month: 'short' }),
            time: new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        ...trackingSteps
    ];

    return (
        <div className="p-4">
            <OrderForm initialData={order} />
            <RiderDetails
                userData={order.user}
                vehicleData={order.vehicle}
            />
            <div className="flex flex-col lg:flex-row justify-between gap-6">
                <OrderPending data={mappedOrderData} />
                <OrderTrackingTimeline steps={finalSteps} />
            </div>

            <div className="flex items-center justify-center bg-gray-100 mt-8 p-4 rounded-lg">
                <FinancialDetails
                    totalAmount={order.total_cost}
                    orderData={order}
                    onCancelClick={() => setIsModalOpen(true)}
                />
                <CancelOrderModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            </div>
        </div>
    );
};

export default ViewTrackOrder;