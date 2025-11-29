import type React from "react"
import MetricCard from "./MetricCard"

interface IncentivesManagementProps {
  onCreateNew: () => void
}

const IncentivesManagement: React.FC<IncentivesManagementProps> = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Incentives Management</h2>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon="package" label="Total Incentives" value="3" />
        <MetricCard icon="gift" label="Total Amount Given" value="$100" />
        <MetricCard icon="users" label="Active Drivers" value="650" />
        <MetricCard icon="calendar" label="Ongoing Incentives" value="2" />
      </div>

      {/* Create Button */}
     
    </div>
  )
}

export default IncentivesManagement
