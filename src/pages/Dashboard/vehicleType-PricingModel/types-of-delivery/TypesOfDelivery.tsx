
import type React from "react"
import { useState } from "react"
import TypesDeliveryCard, { DeliveryType } from "./_components/TypesDeliveryCard"

const DeliveryTypesPage: React.FC = () => {
  const [deliveryTypes, setDeliveryTypes] = useState<DeliveryType[]>([
    {
      id: "1",
      name: "Express",
      percentage: 30,
      pickupTime: 15,
      pickupUnit: "Min",
      deliveryTime: 1,
      deliveryUnit: "Hour",
    },
    {
      id: "2",
      name: "Standard",
      percentage: 20,
      pickupTime: 30,
      pickupUnit: "Min",
      deliveryTime: 2,
      deliveryUnit: "Hour",
    },
    {
      id: "3",
      name: "Economy",
      percentage: 10,
      pickupTime: 45,
      pickupUnit: "Min",
      deliveryTime: 4,
      deliveryUnit: "Hour",
    },
  ])

  const handleSave = (updatedDelivery: DeliveryType) => {
    setDeliveryTypes((prev) => prev.map((delivery) => (delivery.id === updatedDelivery.id ? updatedDelivery : delivery)))
    console.log("Delivery type saved:", updatedDelivery)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Type of Delivery</h1>

        {/* Grid of Delivery Cards */}
        <div className="flex flex-col gap-6">
          {deliveryTypes.map((delivery) => (
            <TypesDeliveryCard key={delivery.id} delivery={delivery} onSave={handleSave} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default DeliveryTypesPage
