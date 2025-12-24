/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useUpdateOrderMutation } from "@/redux/features/orders/ordersApi";
import { Loader2 } from "lucide-react";
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
    });

    // 2. Sync local state when initialData arrives
    useEffect(() => {
        if (initialData) {
            setFormData({
                collect_time: initialData.collect_time || "ASAP",
                username: initialData.user?.username || "",
                phone: initialData.user?.phone || "",
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
        // ONLY send fields that the Order API accepts
        // Based on the error, we remove the 'user' object entirely
        await updateOrder({
            id: initialData.id,
            data: {
                collect_time: formData.collect_time,
                // Do NOT include user: { ... } here
            }
        }).unwrap();
        
        toast.success("Order updated successfully!");
    } catch (error: any) {
        toast.error(error?.data?.message || "Failed to update order");
    }
};

    const createdDate = initialData?.created_at
        ? new Date(initialData.created_at).toLocaleDateString()
        : "N/A";

    const inputStyle = isEditMode
        ? "bg-white border-blue-300 focus:ring-blue-500"
        : "bg-gray-50 border-gray-200 cursor-not-allowed";

    return (
        <div className="bg-white py-12 px-4 sm:px-6 lg:px-8 my-8 rounded-2xl border border-gray-200 shadow-sm">
            <div>
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-12">
                    {isEditMode ? "Edit Order Information" : "Order Information"}
                </h1>

                <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <Label className="text-gray-600 mb-1 block">Order Id</Label>
                        <Input value={initialData?.id || "N/A"} readOnly className="bg-gray-100 cursor-not-allowed" />
                    </div>
                    <div>
                        <Label className="text-gray-600 mb-1 block">Created</Label>
                        <Input value={createdDate} readOnly className="bg-gray-100 cursor-not-allowed" />
                    </div>
                    <div className="sm:col-span-2 flex flex-col items-center mt-6">
                        <Label className="mb-2 text-gray-600">Requested Time</Label>
                        <Input
                            name="collect_time"
                            value={formData.collect_time}
                            onChange={handleChange}
                            readOnly={!isEditMode}
                            className={`text-center sm:w-64 ${inputStyle}`}
                        />
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 text-center border-t pt-8">
                        Customer Details
                    </h2>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
                        <div>
                            <Label className="mb-2 text-gray-600">Name</Label>
                            <Input
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                readOnly={!isEditMode}
                                className={inputStyle}
                            />
                        </div>
                        <div>
                            <Label className="mb-2 text-gray-600">Phone</Label>
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

                {isEditMode && (
                    <div className="mt-10 flex justify-center">
                        <Button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="w-full sm:w-64 bg-green-600 hover:bg-green-700 text-white text-lg rounded-xl transition-all shadow-md"
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