import type React from "react";
import MetricCard from "./MetricCard";
import { useGetAllIncentiveStatsQuery } from "@/redux/features/incentives/incentivesApi";

interface IncentivesManagementProps {
  onCreateNew: () => void;
}

const IncentivesManagement: React.FC<IncentivesManagementProps> = () => {
  const { data: incentiveStats } = useGetAllIncentiveStatsQuery(undefined);
  const { countAll, countActiveRider, countOngoing, totalAmountGiven } =
    incentiveStats?.data || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Incentives Management
        </h2>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon="package" label="Total Incentives" value={countAll} />
        <MetricCard icon="gift" label="Total Amount Given" value={totalAmountGiven?.toFixed(2)} />
        <MetricCard icon="users" label="Active Drivers" value={countActiveRider} />
        <MetricCard icon="calendar" label="Ongoing Incentives" value={countOngoing} />
      </div>

      {/* Create Button */}
    </div>
  );
};

export default IncentivesManagement;
