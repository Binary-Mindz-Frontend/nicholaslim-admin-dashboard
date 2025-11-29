

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export default function OrderForm() {
  const [selectedPrice, setSelectedPrice] = useState("2.5")

  const priceOptions = [
    { value: "1.2", label: "S$1.2" },
    { value: "2.5", label: "S$2.5" },
    { value: "4.5", label: "S$4.5" },
    { value: "6.5", label: "S$6.5" },
  ]

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 mt-8">
      <div className="">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Order Information
        </h1>

        {/* Order Information Section */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <Label>Order Id</Label>
            <Input value="1088" readOnly />
          </div>
          <div>
            <Label>Created</Label>
            <Input value="10/10/25" readOnly />
          </div>
          <div className="sm:col-span-2 flex justify-center mt-6">
               <Label className="mb-2">Requested Time</Label>
            <Input value="2:30 PM" readOnly className="text-center sm:w-64" />
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
              <Input value="Athena Lin" readOnly />
            </div>
            <div>
              <Label className="mb-2">Phone</Label>
              <Input value="+65 455247" readOnly />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label className="mb-2">Pickup Location</Label>
              <Input value="Blk 657 Ang  Mo Kio Ave 9, S560657" readOnly />
            </div>
            <div>
              <Label className="mb-2">Delivery Location</Label>
              <Input value="Blk 222 Sengkang Ave 2, S530222" readOnly />
            </div>
          </div>
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
                className={`px-4 py-2 rounded font-medium transition-colors ${
                  selectedPrice === option.value
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
