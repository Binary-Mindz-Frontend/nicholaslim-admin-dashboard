/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useUpdateOrderMutation } from "@/redux/features/orders/ordersApi";
import { Loader2, MapPin, User, Truck, Clock, Hash, FileText } from "lucide-react";
import toast from "react-hot-toast";

interface OrderFormProps {
    initialData?: any;
    isEditMode?: boolean;
}

export default function OrderForm({ initialData, isEditMode }: OrderFormProps) {
    const [updateOrder, { isLoading }] = useUpdateOrderMutation();

    // 1. Local state to hold form values
    const [formData, setFormData] = useState({
        collect_time: "",
        username: "",
        phone: "",
        sender_name: "",
        sender_phone: "",
        receiver_name: "",
        receiver_phone: "",
        pickup_address: "",
        dropoff_address: "",
        preferred_vehicle: "",
    });

    // Safely extract notes/instructions from pickup and drop stops
    const pickupStop = initialData?.orderStops?.find((stop: any) => stop?.type === "PICKUP") || initialData?.orderStops?.[0];
    const dropStop = initialData?.orderStops?.find((stop: any) => stop?.type === "DROP") || initialData?.orderStops?.[1];

    const pickupNotes = pickupStop?.additionalInfo || pickupStop?.destination?.additionalInfo;
    const dropNotes = dropStop?.additionalInfo || dropStop?.destination?.additionalInfo;

    // 2. Sync local state when initialData arrives with proper optional chaining
    useEffect(() => {
        if (initialData) {
            console.log("OrderForm received initialData:", initialData);

            const pStop = initialData?.orderStops?.find((stop: any) => stop?.type === "PICKUP") || initialData?.orderStops?.[0];
            const dStop = initialData?.orderStops?.find((stop: any) => stop?.type === "DROP") || initialData?.orderStops?.[1];

            const senderDest = pStop?.destination || initialData?.destinations?.find((d: any) => d?.type === "SENDER");
            const receiverDest = dStop?.destination || initialData?.destinations?.find((d: any) => d?.type !== "SENDER");

            const pAddr = pStop?.address || pStop?.destination?.address || initialData?.destinations?.find((d: any) => d?.type === "SENDER")?.address || "";
            const pFloor = pStop?.destination?.floor_unit || senderDest?.floor_unit;
            const fullPAddr = pFloor ? `${pAddr} (${pFloor})` : pAddr;

            const dAddr = dStop?.address || dStop?.destination?.address || initialData?.destinations?.find((d: any) => d?.type !== "SENDER")?.address || "";
            const dFloor = dStop?.destination?.floor_unit || receiverDest?.floor_unit;
            const fullDAddr = dFloor ? `${dAddr} (${dFloor})` : dAddr;

            const deliveryTypeName = initialData?.delivery_type?.name;
            const vehicleTypeName =
                initialData?.vehicle?.vehicle_type ||
                initialData?.vehicle?.name ||
                initialData?.vehicle_type?.name ||
                (typeof initialData?.vehicle === "string" ? initialData?.vehicle : null);

            const vehicleVal = vehicleTypeName && deliveryTypeName && vehicleTypeName !== deliveryTypeName
                ? `${vehicleTypeName} (${deliveryTypeName})`
                : vehicleTypeName || deliveryTypeName || "N/A";

            setFormData({
                collect_time: initialData?.collect_time || "ASAP",
                username: initialData?.user?.username || "",
                phone: initialData?.user?.phone || "",
                sender_name: senderDest?.contact_name || initialData?.user?.username || "N/A",
                sender_phone: senderDest?.contact_number || initialData?.user?.phone || "N/A",
                receiver_name: receiverDest?.contact_name || "N/A",
                receiver_phone: receiverDest?.contact_number || "N/A",
                pickup_address: fullPAddr || "N/A",
                dropoff_address: fullDAddr || "N/A",
                preferred_vehicle: vehicleVal,
            });
        }
    }, [initialData]);

    // 3. Handle Input Changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // 4. Submit logic
    const handleSave = async () => {
        try {
            await updateOrder({
                id: initialData?.id,
                data: {
                    collect_time: formData.collect_time,
                }
            }).unwrap();

            toast.success("Order updated successfully!");

        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update order");
        }
    };

    const createdDate = initialData?.created_at
        ? new Date(initialData.created_at).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        })
        : "N/A";

    const inputStyle = isEditMode
        ? "bg-white border-blue-300 focus:ring-blue-500"
        : "bg-gray-50 border-gray-200 cursor-not-allowed";

    return (
        <div className="bg-white py-10 px-4 sm:px-6 lg:px-8 my-8 rounded-2xl border border-gray-200 shadow-sm">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-10">
                    {isEditMode ? "Edit Order Information" : "Order Information"}
                </h1>

                {/* Section 1: General Order Information & Preferred Vehicle */}
                <div className="mb-10">
                    <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2 pb-2 border-b border-gray-100 uppercase tracking-wide">
                        <Hash className="w-4 h-4 text-blue-600" />
                        General Order Details
                    </h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <Label className="text-gray-600 mb-1.5 block text-xs font-semibold uppercase tracking-wider">Order ID</Label>
                            <Input value={initialData?.id ? `#${initialData.id}` : "N/A"} readOnly className="bg-gray-50 border-gray-200 cursor-not-allowed font-medium" />
                        </div>
                        <div>
                            <Label className="text-gray-600 mb-1.5 block text-xs font-semibold uppercase tracking-wider">Created Date</Label>
                            <Input value={createdDate} readOnly className="bg-gray-50 border-gray-200 cursor-not-allowed font-medium" />
                        </div>
                        <div>
                            <Label className="text-gray-600 mb-1.5 block text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-gray-500" /> Requested Time
                            </Label>
                            <Input
                                name="collect_time"
                                value={formData.collect_time}
                                onChange={handleChange}
                                readOnly={!isEditMode}
                                className={`font-medium ${inputStyle}`}
                            />
                        </div>
                        <div>
                            <Label className="text-gray-600 mb-1.5 block text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                                <Truck className="w-3.5 h-3.5 text-blue-600" /> Preferred Vehicle Type
                            </Label>
                            <Input
                                name="preferred_vehicle"
                                value={formData.preferred_vehicle}
                                onChange={handleChange}
                                readOnly={!isEditMode}
                                className={`font-medium ${inputStyle}`}
                            />
                        </div>
                    </div>
                </div>

                {/* Section 2: Route / Address Information */}
                <div className="mb-10">
                    <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2 pb-2 border-b border-gray-100 uppercase tracking-wide">
                        <MapPin className="w-4 h-4 text-red-500" />
                        Location Details
                    </h2>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div className="bg-gray-50/70 p-5 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                                <Label className="text-gray-900 font-bold text-xs uppercase tracking-wide">Pickup Address</Label>
                            </div>
                            <Input
                                name="pickup_address"
                                value={formData.pickup_address}
                                onChange={handleChange}
                                readOnly={!isEditMode}
                                className={`font-medium ${inputStyle}`}
                            />
                            {pickupNotes && (
                                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                    <FileText className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                    <span>Instructions: {pickupNotes}</span>
                                </p>
                            )}
                        </div>

                        <div className="bg-gray-50/70 p-5 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                                <Label className="text-gray-900 font-bold text-xs uppercase tracking-wide">Drop-off Address</Label>
                            </div>
                            <Input
                                name="dropoff_address"
                                value={formData.dropoff_address}
                                onChange={handleChange}
                                readOnly={!isEditMode}
                                className={`font-medium ${inputStyle}`}
                            />
                            {dropNotes && (
                                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                    <FileText className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                    <span>Instructions: {dropNotes}</span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Section 3: Sender & Receiver Information */}
                <div className="mb-8">
                    <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2 pb-2 border-b border-gray-100 uppercase tracking-wide">
                        <User className="w-4 h-4 text-indigo-600" />
                        Sender & Receiver Details
                    </h2>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {/* Sender Info */}
                        <div className="p-5 rounded-xl border border-gray-200 bg-white">
                            <h3 className="font-bold text-gray-800 mb-4 text-xs uppercase tracking-wide flex items-center gap-2 border-b pb-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                Sender Information
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-gray-600 mb-1 block text-xs font-semibold">Sender Name</Label>
                                    <Input
                                        name="sender_name"
                                        value={formData.sender_name}
                                        onChange={handleChange}
                                        readOnly={!isEditMode}
                                        className={inputStyle}
                                    />
                                </div>
                                <div>
                                    <Label className="text-gray-600 mb-1 block text-xs font-semibold">Sender Phone</Label>
                                    <Input
                                        name="sender_phone"
                                        value={formData.sender_phone}
                                        onChange={handleChange}
                                        readOnly={!isEditMode}
                                        className={inputStyle}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Receiver Info */}
                        <div className="p-5 rounded-xl border border-gray-200 bg-white">
                            <h3 className="font-bold text-gray-800 mb-4 text-xs uppercase tracking-wide flex items-center gap-2 border-b pb-2">
                                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                                Receiver Information
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-gray-600 mb-1 block text-xs font-semibold">Receiver Name</Label>
                                    <Input
                                        name="receiver_name"
                                        value={formData.receiver_name}
                                        onChange={handleChange}
                                        readOnly={!isEditMode}
                                        className={inputStyle}
                                    />
                                </div>
                                <div>
                                    <Label className="text-gray-600 mb-1 block text-xs font-semibold">Receiver Phone</Label>
                                    <Input
                                        name="receiver_phone"
                                        value={formData.receiver_phone}
                                        onChange={handleChange}
                                        readOnly={!isEditMode}
                                        className={inputStyle}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Account Holder Details */}
                        <div className="p-5 rounded-xl border border-gray-200 bg-white md:col-span-2 lg:col-span-1">
                            <h3 className="font-bold text-gray-800 mb-4 text-xs uppercase tracking-wide flex items-center gap-2 border-b pb-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                Account Holder Details
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-gray-600 mb-1 block text-xs font-semibold">Account Name</Label>
                                    <Input
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        readOnly={!isEditMode}
                                        className={inputStyle}
                                    />
                                </div>
                                <div>
                                    <Label className="text-gray-600 mb-1 block text-xs font-semibold">Account Phone</Label>
                                    <Input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        readOnly={!isEditMode}
                                        className={inputStyle}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {isEditMode && (
                    <div className="mt-10 flex justify-center">
                        <Button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="w-full sm:w-64 bg-green-600 hover:bg-green-700 text-white text-lg rounded-xl transition-all shadow-md cursor-pointer"
                        >
                            {isLoading ? (
                                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving...</>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}