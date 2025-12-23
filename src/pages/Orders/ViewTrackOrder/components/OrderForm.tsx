/* eslint-disable @typescript-eslint/no-explicit-any */

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Define the interface based on your API response structure
interface OrderFormProps {
    initialData?: any;
}

export default function OrderForm({ initialData }: OrderFormProps) {
    // Use the total_cost from API if available, otherwise fallback to "2.5"
    // const [selectedPrice, setSelectedPrice] = useState(initialData?.total_cost || "2.5")

    // const priceOptions = [
    //     { value: "1.2", label: "S$1.2" },
    //     { value: "2.5", label: "S$2.5" },
    //     { value: "4.5", label: "S$4.5" },
    //     { value: "6.5", label: "S$6.5" },
    // ]

    // Extract locations from the destinations array
    // const pickup = initialData?.destinations?.find((d: any) => d.type === "SENDER")?.address || "N/A";
    // const delivery = initialData?.destinations?.find((d: any) => d.type === "RECEIVER")?.address ||
    //     initialData?.destinations[1]?.address || "N/A";

    // Format the date
    const createdDate = initialData?.created_at
        ? new Date(initialData.created_at).toLocaleDateString()
        : "N/A";

    return (
        <div className=" bg-white py-12 px-4 sm:px-6 lg:px-8 my-8 rounded-2xl border border-gray-200">
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

               
            </div>
        </div>
    )
}