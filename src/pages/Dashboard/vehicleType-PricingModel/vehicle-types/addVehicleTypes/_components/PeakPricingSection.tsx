
import type React from "react"
import { useState } from "react"
import { PricingRuleCard } from "./_common/PricingRuleCard"

export interface PricingRule {
  id: string
  title: string
  timeRange?: string
  days?: string
  charge: string
  enabled: boolean
}

export interface PeakPricingSectionProps {
  onRuleEdit: (rule: PricingRule) => void
  onRuleDelete: (id: string) => void
}

export const PeakPricingSection: React.FC<PeakPricingSectionProps> = ({ onRuleEdit, onRuleDelete }) => {
  const [rules, setRules] = useState<PricingRule[]>([
    {
      id: "1",
      title: "Peak Hours Weekday",
      timeRange: "Mon-Fri: 7:00-9:00 AM, 5:00-7:00 PM",
      charge: "+20% Charge",
      enabled: true,
    },
    {
      id: "2",
      title: "Weekend Premium",
      days: "Sat-Sun All Day",
      charge: "+15% Charge",
      enabled: true,
    },
    {
      id: "3",
      title: "Late Night Fee",
      timeRange: "Daily, 11:00 PM-6:00 AM",
      charge: "+$05.00 Charge",
      enabled: true,
    },
    {
      id: "4",
      title: "Holiday Surcharge",
      days: "Public Holidays",
      charge: "+25% Charge",
      enabled: true,
    },
  ])

  const handleToggle = (id: string) => {
    setRules(rules.map((rule) => (rule.id === id ? { ...rule, enabled: !rule.enabled } : rule)))
  }

  const handleEdit = (rule: PricingRule) => {
    onRuleEdit(rule)
  }

  const handleDelete = (id: string) => {
    setRules(rules.filter((rule) => rule.id !== id))
    onRuleDelete(id)
  }

  return (
    <div className="mt-16">
      {/* <h2 className="text-lg font-semibold text-foreground mb-6"></h2> */}
                   <h1 className="text-3xl font-bold text-gray-900 mb-6">Peak Pricing & Surcharge Rules</h1>

      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rules.map((rule) => (
          <PricingRuleCard
            key={rule.id}
            rule={rule}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
      </div>
    </div>
  )
}
