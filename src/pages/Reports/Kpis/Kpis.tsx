import { useState, useEffect } from "react";
import EarningsOverTime from "./KpiChart/EarningsOverTime";
import TopPerformingDrivers from "./KpiChart/TopPerformingDrivers";
import KpiStats from "./KpiStats/KpiStats";
import { useGetKpiStatsQuery } from "@/redux/features/reportAndAnalytics/reportAndAnalyticsApi";
import FilterSection from "../FilterSection/FilterSection";

export default function Kpis() {
  const [dateFilter, setDateFilter] = useState("last_30_days");
  const [allFilter, setAllFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);

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
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return {
          from: `${formatDate(firstDayOfMonth)}T00:00:00.000Z`,
          to: `${formatDate(lastDayOfMonth)}T23:59:59.999Z`,
        };
      default:
        return null;
    }
  };

  // Get date range
  const dateRange = getDateRange();

  // Fetch KPI stats with date range
  const { data: kpiStatsData, isLoading } = useGetKpiStatsQuery(
    dateRange || { from: "", to: "" },
    { skip: !dateRange?.from || !dateRange?.to }
  );

  // Handle date filter change
  useEffect(() => {
    setShowCustomDateRange(dateFilter === 'custom');
  }, [dateFilter]);

  const handleResetFilter = () => {
    setDateFilter("last_30_days");
    setAllFilter("all");
    setFromDate("");
    setToDate("");
  };

//   // Format date for display
//   const formatDisplayDate = (dateString: string) => {
//     if (!dateString) return '';
//     return new Date(dateString).toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

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

      {/* Revenue and kpis chart */}
      <div className="w-full">
        <h2 className="text-xl font-semibold mb-4">
          Revenue & Performance KPIs
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EarningsOverTime 
            revenueByDay={kpiStatsData?.data?.revenueByDay || []}
            isLoading={isLoading}
          />
          <TopPerformingDrivers 
            topDrivers={kpiStatsData?.data?.topDrivers || []}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* KPI stats */}
      <KpiStats 
        avgDeliveryTime={kpiStatsData?.data?.avgDeliveryTime || 0}
        avgOrderValue={kpiStatsData?.data?.avgOrderValue || 0}
        completionRate={kpiStatsData?.data?.completionRate || 0}
        cancellationRate={kpiStatsData?.data?.cancellationRate || 0}
        isLoading={isLoading}
      />

      {/* <div className="w-full bg-white p-6 my-5 rounded-xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-10">
        <div>
          <h2 className="text-lg font-semibold">Download Reports</h2>
          <p className="text-sm text-gray-500">
            Export comprehensive analytics reports
          </p>
        </div>

        <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download PDF Report
        </Button>
      </div> */}
    </div>
  );
}