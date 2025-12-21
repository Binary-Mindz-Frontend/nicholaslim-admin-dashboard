import type React from "react"
import {DollarSign, Gift, Users, Calendar } from "lucide-react"


interface MetricCardProps {
  icon: "package" | "gift" | "users" | "calendar"
  label: string
  value: string | number
}

const iconMap = {
  package: Gift,
  gift:DollarSign ,
  users: Users,
  calendar: Calendar,
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value }) => {
  const IconComponent = iconMap[icon]

  

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm flex flex-col items- gap-3">
      <div className="p-1.5 bg-gray-100 w-min rounded-sm ">
        <IconComponent className="w-7 h-7 text-gray-600" />
      </div>
      <p className="text-sm text-gray-600 font-medium">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

export default MetricCard
