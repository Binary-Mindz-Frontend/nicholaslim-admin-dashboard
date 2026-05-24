
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useGetSingleOrderQuery } from "@/redux/features/orders/ordersApi";

import RiderDetails from "./components/RiderDetails";
import OrderPending from "./components/OrderPending";
import OrderTrackingTimeline from "./components/OrderTrackingTimeline";
import FinancialDetails from "./components/FinancialDetails";
import { ArrowLeft } from "lucide-react";
import OrderForm from "./components/OrderForm";
import { Button } from "@/components/ui/button";

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
    const isEditMode = searchParams.get("edit") === "true";

    // Redux API Hooks
    const { data: response, isLoading, isError } = useGetSingleOrderQuery(id);

    // Bring this back so OrderForm can use it to save changes
    // const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();

    const order = response?.data;
    // console.log("Order data:", order);
    // console.log("Rider ID Value:", order?.assign_rider_id);

    if (isLoading) return <div className="p-10 text-center">Loading...</div>;
    if (isError || !order) return <div className="p-10 text-center">Order not found.</div>;

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

            <OrderForm
                initialData={order}
                isEditMode={isEditMode}

            />

            {order?.assign_rider_id !== null && order?.assign_rider_id !== undefined && (
                <RiderDetails
                    riderData={order}
                    vehicleData={order.vehicle}
                />
            )}


            <div className="flex flex-col lg:flex-row justify-between gap-6">
                <OrderPending data={mappedOrderData} />
                <OrderTrackingTimeline steps={finalSteps} />
            </div>

            <div className="flex items-center justify-center bg-gray-100 mt-8 p-4 rounded-lg">
                <FinancialDetails
                    totalAmount={order.total_cost}
                    orderData={order}
                // Removed onCancelClick since the modal is gone
                />

            </div>
            <div className="flex items-center justify-center mt-6">
                {order.assign_rider_id === null ? (
                    <Button
                        className="text-black py-3 px-8 text-base cursor-pointer"
                        // onClick={() => navigate(`/assign-driver/${order.id}`)}
                        onClick={() => navigate(`/assign-driver/${order.id}`)}
                    >
                        Assign Driver
                    </Button>
                ) : (
                    <div className="bg-green-100 text-green-700 px-6 py-2 rounded-lg font-bold border border-green-200 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Driver Assigned Already
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewTrackOrder;