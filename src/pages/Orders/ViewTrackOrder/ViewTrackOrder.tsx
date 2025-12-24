/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useGetSingleOrderQuery, useUpdateOrderMutation } from "@/redux/features/orders/ordersApi";

import RiderDetails from "./components/RiderDetails";
import OrderPending from "./components/OrderPending";
import OrderTrackingTimeline from "./components/OrderTrackingTimeline";
import FinancialDetails from "./components/FinancialDetails";
import CancelOrderModal from "./components/CancelOrderModal";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import OrderForm from "./components/OrderForm";


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
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    
    // Detect if we are in Edit Mode (URL contains ?edit=true)
    const isEditMode = searchParams.get("edit") === "true";
    
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Redux API Hooks
    const { data: response, isLoading, isError } = useGetSingleOrderQuery(id);
    const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();

    const order = response?.data;

    // --- API Mutation Handler ---
    const handleCancelOrder = async () => {
        try {
            await updateOrder({
                id,
                data: { order_status: "CANCELLED" }
            }).unwrap();
            
            toast.success("Order has been cancelled successfully");
            setIsModalOpen(false);
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to cancel order");
        }
    };

    // --- Guard Clauses to prevent "reading property of undefined" error ---
    if (isLoading) {
        return <div className="p-10 text-center font-medium">Loading order data...</div>;
    }

    if (isError || !order) {
        return (
            <div className="p-10 text-center text-red-500">
                <p>Error: Order not found or failed to load.</p>
                <button onClick={() => navigate(-1)} className="mt-4 text-blue-500 underline">Go Back</button>
            </div>
        );
    }

    // --- Data Mapping ---
    const mappedOrderData: OrderData = {
        orderNumber: `#${order.id}`,
        deliveryDate: new Date(order.created_at).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        }),
        deliveryTime: order.collect_time || "ASAP",
        totalAmount: `$${order.total_cost}`,
        paymentMethod: order.pay_type, // Will handle "COD" logic inside component
        cardLast4: "N/A",
        status: order.order_status?.toLowerCase() || "pending", 
    };

    const trackingSteps = order.destinations?.map((dest: any) => ({
        title: dest.type === "SENDER" 
            ? `Collected from (Sender: ${dest.contact_name})` 
            : `Deliver to (Recipient: ${dest.contact_name})`,
        subtitle: dest.address,
        date: new Date(order.created_at).toLocaleDateString("en-GB", { day: 'numeric', month: 'short' }),
        time: new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })) || [];

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
        <div className="p-4 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-3 items-center text-gray-700">
                    <ArrowLeft className="cursor-pointer hover:text-black transition-colors" onClick={() => navigate(-1)} />
                    <span className="text-lg font-semibold">
                        {isEditMode ? "Edit Order Details" : "Back to Order Tracking"}
                    </span>
                </div>
                {isEditMode && (
                    <div className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-bold animate-pulse">
                        EDITING MODE
                    </div>
                )}
            </div>

            {/* Passing isEditMode to OrderForm to enable/disable inputs */}
            <OrderForm initialData={order} isEditMode={isEditMode} />

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
            </div>

            <CancelOrderModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleCancelOrder}
                isLoading={isUpdating}
            />
        </div>
    );
};

export default ViewTrackOrder;