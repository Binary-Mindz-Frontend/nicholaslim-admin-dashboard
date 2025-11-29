

import type React from "react"
import { Button } from "@/components/ui/button"
import { FiTrash } from "react-icons/fi"
import { Switch } from "@/components/ui/switch"

interface PricingRule {
  id: string
  title: string
  timeRange?: string
  days?: string
  charge: string
  enabled: boolean
}

interface PricingRuleCardProps {
  rule: PricingRule
  onToggle: (id: string) => void
  onEdit: (rule: PricingRule) => void
  onDelete: (id: string) => void
}

export const PricingRuleCard: React.FC<PricingRuleCardProps> = ({ rule, onToggle, onEdit, onDelete }) => {
  return (
    <div className="bg-white p-6 rounded-lg  flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-xl text-foreground mb-1">{rule.title}</h3>
          {rule.timeRange && <p className=" text-base mt-4">{rule.timeRange}</p>}
          {rule.days && <p className="text-sm text-gray-600">{rule.days}</p>}
        </div>

         <button
            onClick={() => onToggle(rule.id)}
            className="flex items-center"
          >
            <Switch
              checked={rule.enabled}
              onCheckedChange={() => onToggle(rule.id)}
              className={rule.enabled ? "bg-[#54A312]" : "bg-gray-300"}
            />
          </button>
      </div>

      <div className="mb-4">
        <p className="text-lg font-semibold text-green-600">{rule.charge}</p>
      </div>

      <div className="flex gap-3 mt-auto">
        <Button
          onClick={() => onEdit(rule)}
          className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold cursor-pointer"
        >
          {/* <Edit2 size={16} className="mr-2" /> */}
          Edit
        </Button>
        <button
          onClick={() => onDelete(rule.id)}
          className="p-2 text-[#FF4D4F] hover:bg-red-50 rounded-sm border border-[#FF4D4F] transition-colors cursor-pointer"
        >
          <FiTrash size={16} />
        </button>
      </div>
    </div>
  )
}
