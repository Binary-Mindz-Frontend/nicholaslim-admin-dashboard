"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface DeliveryType {
  id: string
  name: string
  percentage: number
  pickupTime: number
  pickupUnit: "Min" | "Hour"
  deliveryTime: number
  deliveryUnit: "Min" | "Hour"
}

interface TypesDeliveryCardProps {
  delivery: DeliveryType
  onSave?: (data: DeliveryType) => void
}

const TypesDeliveryCard: React.FC<TypesDeliveryCardProps> = ({ delivery, onSave }) => {
  const [formData, setFormData] = useState<DeliveryType>(delivery)

  const handleSave = () => {
    onSave?.(formData)
    console.log("Saving delivery type:", formData)
  }

  return (
    <div className="bg-white   rounded-lg p-6 shadow-sm">
      <div className="max-w-3xl mx-auto">
        {/* Title */}
      <h3 className="text-center text-xl font-semibold text-gray-900 mb-6">{formData.name}</h3>

      {/* Percentage Field */}
      <div className="mb-6  w-full sm:w-[50%] mx-auto">
        <label className="block text-base font-medium text-gray-700 mb-2">Percentage</label>
        <input
          type="number"
          value={formData.percentage}
          onChange={(e) => setFormData({ ...formData, percentage: Number(e.target.value) })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent outline-none"
          placeholder="30"
        />
      </div>

      {/* Pickup Time and Delivery Time Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Pickup Time */}
        <div className=" space-y-1">
        <div className="flex  justify-between items-center">
            <label className="block text-base font-medium text-gray-700 mb-2">Pickup Time</label>
           <Select value={formData.pickupUnit} onValueChange={(value: any) => setFormData({ ...formData, pickupUnit: value })}>
              <SelectTrigger className="w-24 border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Min">Min</SelectItem>
                <SelectItem value="Hour">Hour</SelectItem>
              </SelectContent>
            </Select>
        </div>
          <div className="flex gap-2">
            <input
              type="number"
              value={formData.pickupTime}
              onChange={(e) => setFormData({ ...formData, pickupTime: Number(e.target.value) })}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent outline-none"
              placeholder="15"
            />
           
          </div>
        </div>

        {/* Delivery Time */}
        <div className="space-y-1">
         <div className="flex justify-between items-center">
           <label className="block text-base font-medium text-gray-700 mb-2">Delivery Time</label>
          <Select value={formData.deliveryUnit} onValueChange={(value: any) => setFormData({ ...formData, deliveryUnit: value })}>
              <SelectTrigger className="w-24 border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Min">Min</SelectItem>
                <SelectItem value="Hour">Hour</SelectItem>
              </SelectContent>
            </Select>
         </div>
          <div className="flex gap-2">
            <input
              type="number"
              value={formData.deliveryTime}
              onChange={(e) => setFormData({ ...formData, deliveryTime: Number(e.target.value) })}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FFCC00] focus:border-transparent outline-none"
              placeholder="1"
            />
            
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleSave}
          className="bg-[#FFCC00] hover:bg-[#E6B800] text-black font-semibold text-lg px-8 py-2 rounded transition-colors cursor-pointer"
        >
          Save
        </Button>
      </div>
      </div>
    </div>
  )
}

export default TypesDeliveryCard
