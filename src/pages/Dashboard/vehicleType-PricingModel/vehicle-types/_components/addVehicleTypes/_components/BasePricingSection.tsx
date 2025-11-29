
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BasePricingData {
  vehicleType: string
  baseFare: string
  perKmFee: string
}

interface BasePricingSectionProps {
  onEdit: (data: BasePricingData) => void
  initialData?: BasePricingData
}

const vehicleTypes = ["Bike", "Car", "Auto", "Truck"]

export const BasePricingSection: React.FC<BasePricingSectionProps> = ({
  onEdit,
  initialData = {
    vehicleType: "Bike",
    baseFare: "",
    perKmFee: "",
  },
}) => {
  const [data, setData] = useState<BasePricingData>(initialData)

  const handleEdit = () => {
    onEdit(data)
  }

  return (
    <div className=" 0 mb-8">
      {/* <h2 className="text-lg font-semibold text-foreground mb-6"></h2> */}
             <h1 className="text-3xl font-bold text-gray-900 mb-6">Vehicle Types- Pricing Models</h1>

      <div className=" bg-white p-6 rounded-lg border border-gray-20 ">
        <div className="max-w-3xl mx-auto space-y-6" >
            <div>
          <label className="block text-base font-medium text-foreground mb-2">Vehicle Type</label>
          <Select  value={data.vehicleType} onValueChange={(value) => setData({ ...data, vehicleType: value })}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {vehicleTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-base font-medium text-foreground mb-2">Base Fare</label>
            <input
              type="number"
              value={data.baseFare}
              onChange={(e) => setData({ ...data, baseFare: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1  focus:ring-yellow-400"
              placeholder="$10.00"
            />
          </div>

          <div>
            <label className="block text-base font-medium text-foreground mb-2">Per Kilometer Fee</label>
            <input
              type="number"
              value={data.perKmFee}
              onChange={(e) => setData({ ...data, perKmFee: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-400"
              placeholder="$1.3"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Button onClick={handleEdit} className="bg-yellow-400 hover:bg-yellow-500 text-black text-lg cursor-pointer font-bold px-8">
            Edit
          </Button>
        </div>
        </div>
      </div>
    </div>
  )
}
