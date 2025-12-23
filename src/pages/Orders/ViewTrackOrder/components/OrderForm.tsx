/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

// Define the interface based on your API response structure
interface OrderFormProps {
    initialData?: any;
}

export default function OrderForm({ initialData }: OrderFormProps) {
    // Use the total_cost from API if available, otherwise fallback to "2.5"
    const [selectedPrice, setSelectedPrice] = useState(initialData?.total_cost || "2.5")

    const priceOptions = [
        { value: "1.2", label: "S$1.2" },
        { value: "2.5", label: "S$2.5" },
        { value: "4.5", label: "S$4.5" },
        { value: "6.5", label: "S$6.5" },
    ]

    // Extract locations from the destinations array
    // const pickup = initialData?.destinations?.find((d: any) => d.type === "SENDER")?.address || "N/A";
    // const delivery = initialData?.destinations?.find((d: any) => d.type === "RECEIVER")?.address ||
    //     initialData?.destinations[1]?.address || "N/A";

    // Format the date
    const createdDate = initialData?.created_at
        ? new Date(initialData.created_at).toLocaleDateString()
        : "N/A";

    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 my-8 rounded-2xl border border-gray-200">
            <div className="">
                {/* Header */}
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-12">
                    Order Information
                </h1>

                {/* Order Information Section */}
                <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <Label>Order Id</Label>
                        <Input value={initialData?.id || "N/A"} readOnly />
                    </div>
                    <div>
                        <Label>Created</Label>
                        <Input value={createdDate} readOnly />
                    </div>
                    <div className="sm:col-span-2 flex flex-col items-center mt-6">
                        <Label className="mb-2">Requested Time</Label>
                        <Input value={initialData?.collect_time || "ASAP"} readOnly className="text-center sm:w-64" />
                    </div>
                </div>

                {/* Customer Details Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
                        Customer Details
                    </h2>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
                        <div>
                            <Label className="mb-2">Name</Label>
                            <Input value={initialData?.user?.username || "N/A"} readOnly />
                        </div>
                        <div>
                            <Label className="mb-2">Phone</Label>
                            <Input value={initialData?.user?.phone || "N/A"} readOnly />
                        </div>
                    </div>

                    {/* <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <Label className="mb-2">Pickup Location</Label>
                            <Input value={pickup} readOnly />
                        </div>
                        <div>
                            <Label className="mb-2">Delivery Location</Label>
                            <Input value={delivery} readOnly />
                        </div>
                    </div> */}
                </div>

                {/* Finding Your Rider Section */}
                <div className="border border-gray-300 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
                        Finding your rider
                    </h3>

                    {/* Message */}
                    <div className="text-center mb-6">
                        <div className="inline-block bg-yellow-400 px-3 py-1 rounded-full mb-2">
                            <span className="text-xs font-semibold text-gray-900"></span>
                        </div>
                        <p className="text-sm font-medium text-gray-700">
                            Good Fare, Your Request Gets Priority 2:00
                        </p>
                    </div>

                    {/* Price Options */}
                    <div className="flex justify-center items-center gap-4 flex-wrap mb-6">
                        {priceOptions.map((option) => (
                            <Button
                                key={option.value}
                                variant={selectedPrice === option.value ? "default" : "outline"}
                                className={`px-4 py-2 rounded font-medium transition-colors ${selectedPrice === option.value
                                        ? "bg-yellow-400 text-gray-900 shadow-md"
                                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                    }`}
                                onClick={() => setSelectedPrice(option.value)}
                            >
                                {option.label}
                            </Button>
                        ))}
                    </div>

                    {/* Add Amount Link */}
                    <div className="text-center mb-6">
                        <Button variant="link" className="text-gray-500 hover:text-gray-700 text-sm">
                            Add Amount +
                        </Button>
                    </div>

                    {/* Priority Order Button */}
                    <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-lg transition-colors">
                        Priority order
                    </Button>
                </div>
            </div>
        </div>
    )
}