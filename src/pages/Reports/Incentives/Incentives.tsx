import IncentivesChart from "./IncentivesChart/IncentivesChart";
import IncentiveAnalytics from "./IncentiveAnalytics/IncentiveAnalytics";
import FilterSection from "../FilterSection/FilterSection";
import { useGetIncentiveStatsQuery } from "@/redux/features/reportAndAnalytics/reportAndAnalyticsApi";
import { useState, useEffect } from "react";

export default function Incentive() {
  const [dateFilter, setDateFilter] = useState("");
  const [allFilter, setAllFilter] = useState("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [showCustomDateRange, setShowCustomDateRange] = useState(true);
  const [queryParams, setQueryParams] = useState<{ from?: string; to?: string } | null>(null);

  // Generate date range based on filter
  const getDateRange = () => {
    const now = new Date();
    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    // If custom date range is selected
    if (dateFilter === 'custom' && fromDate && toDate) {
      return {
        from: `${fromDate}T00:00:00.000Z`,
        to: `${toDate}T23:59:59.999Z`,
      };
    }

    switch (dateFilter) {
      case "today":
        const today = new Date();
        return {
          from: `${formatDate(today)}T00:00:00.000Z`,
          to: `${formatDate(today)}T23:59:59.999Z`,
        };
      case "yesterday":
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        return {
          from: `${formatDate(yesterday)}T00:00:00.000Z`,
          to: `${formatDate(yesterday)}T23:59:59.999Z`,
        };
      case "last_7_days":
        const last7Days = new Date(now);
        last7Days.setDate(last7Days.getDate() - 7);
        return {
          from: `${formatDate(last7Days)}T00:00:00.000Z`,
          to: `${formatDate(now)}T23:59:59.999Z`,
        };
      case "last_30_days":
        const last30Days = new Date(now);
        last30Days.setDate(last30Days.getDate() - 30);
        return {
          from: `${formatDate(last30Days)}T00:00:00.000Z`,
          to: `${formatDate(now)}T23:59:59.999Z`,
        };
      case "last_month":
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        return {
          from: `${formatDate(firstDayOfMonth)}T00:00:00.000Z`,
          to: `${formatDate(lastDayOfMonth)}T23:59:59.999Z`,
        };
      default:
        return null;
    }
  };

  const handleResetFilter = () => {
    setDateFilter("");
    setAllFilter("");
    setFromDate("");
    setToDate("");
    setShowCustomDateRange(false);
    setQueryParams(null);
  };

  // Update query params when filters change
  useEffect(() => {
    const dateRange = getDateRange();
    if (dateRange) {
      setQueryParams(dateRange);
    } else {
      setQueryParams(null);
    }
  }, [dateFilter, fromDate, toDate]);

  // Use the query hook with parameters
  const { data: reportStatsData, isLoading, isFetching, error } = useGetIncentiveStatsQuery(
    queryParams || ""
  );

  // Handle error state
  if (error) {
    return (
      <div className="px-8 sm:p-6 bg-[#F5F7FA] min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-700">Error Loading Data</h2>
          <p className="text-red-600 mt-2">Failed to fetch incentive statistics. Please try again.</p>
        </div>
      </div>
    );
  }

  // Extract data from API response or use defaults
  const incentiveData = reportStatsData?.data || {
    totalGiven: 0,
    totalCollected: 0,
    weeklyGraph: []
  };

  return (
    <div className="px-8 sm:p-6 bg-[#F5F7FA]">
      <div className="w-full mx-auto space-y-4 mb-6">
        {/* Header Section */}
        <div className="pt-2 sm:py-2">
          <h1 className="text-black text-2xl font-bold">
            Reports & Analytics
          </h1>
        </div>

        <FilterSection
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          allFilter={allFilter}
          setAllFilter={setAllFilter}
          handleResetFilter={handleResetFilter}
          fromDate={fromDate}
          toDate={toDate}
          setFromDate={setFromDate}
          setToDate={setToDate}
          showCustomDateRange={showCustomDateRange}
        />
      </div>

      {/* Incentive Analytics Section - Pass API data */}
      <IncentiveAnalytics 
        totalGiven={incentiveData.totalGiven} 
        totalCollected={incentiveData.totalCollected} 
        isLoading={isLoading || isFetching}
      />

      {/* Incentives chart - Pass API data */}
      <IncentivesChart 
        weeklyData={incentiveData.weeklyGraph} 
        isLoading={isLoading || isFetching}
      />
    </div>
  );
}