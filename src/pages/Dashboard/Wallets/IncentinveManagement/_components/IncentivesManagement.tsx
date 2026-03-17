import type React from "react";
import MetricCard from "./MetricCard";
import { useGetAllIncentiveStatsQuery } from "@/redux/features/incentives/incentivesApi";

interface IncentivesManagementProps {
  onCreateNew: () => void;
}

const IncentivesManagement: React.FC<IncentivesManagementProps> = () => {
  const { data: incentiveStats, isLoading } =
    useGetAllIncentiveStatsQuery(undefined);

  // Destructuring all fields from your JSON response
  const {
    countAll = 0,
    countActiveRider = 0,
    countOngoing = 0,
    totalAmountGiven = 0,
    totalCollectedIncentives = 0,
  } = incentiveStats?.data || {};

  if (isLoading)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        Loading stats...
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Updated Metrics Grid to 5 columns for better fit */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard icon="package" label="Total Incentives" value={countAll} />

        <MetricCard icon="calendar" label="Ongoing" value={countOngoing} />

        <MetricCard
          icon="users"
          label="Active Drivers"
          value={countActiveRider}
        />

        <MetricCard
          icon="gift"
          label="Amount Given"
          value={`$${Number(totalAmountGiven).toFixed(2)}`}
        />

        <MetricCard
          icon="checkcircle"
          label="Collected"
          value={totalCollectedIncentives}
        />
      </div>
    </div>
  );
};

export default IncentivesManagement;
