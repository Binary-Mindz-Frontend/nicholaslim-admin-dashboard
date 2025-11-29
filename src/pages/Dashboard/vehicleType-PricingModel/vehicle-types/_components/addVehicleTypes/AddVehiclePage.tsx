
import type React from "react"
import { BackButton } from "./_components/BackButton"
import { BasePricingSection } from "./_components/BasePricingSection"
import { PeakPricingSection } from "./_components/PeakPricingSection"


interface PricingRule {
  id: string
  title: string
  timeRange?: string
  days?: string
  charge: string
  enabled: boolean
}

export const AddVehiclePage: React.FC = () => {
  const handleBack = () => {
    window.history.back()
  }

  const handleBasePricingEdit = (data: any) => {
    console.log("Edit base pricing:", data)
    // Handle edit logic
  }

  const handleRuleEdit = (rule: PricingRule) => {
    console.log("Edit rule:", rule)
    // Handle edit logic
  }

  const handleRuleDelete = (id: string) => {
    console.log("Delete rule:", id)
    // Handle delete logic
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className=" mx-auto">
        <BackButton onClick={handleBack} />

        <BasePricingSection onEdit={handleBasePricingEdit} />

        <PeakPricingSection onRuleEdit={handleRuleEdit} onRuleDelete={handleRuleDelete} />
      </div>
    </div>
  )
}

export default AddVehiclePage
