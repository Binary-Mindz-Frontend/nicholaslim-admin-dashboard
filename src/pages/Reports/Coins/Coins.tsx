/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-case-declarations */
// import { Download } from "lucide-react";
// import { Button } from "@/components/ui/button";
import CoinSummaryChart from "./CoinsChart/CoinSummaryChart";
import CoinsByActivityChart from "./CoinsChart/CoinsByActivityChart";
import CoinsAnalytics from "./CoinsAnalytics/CoinsAnalytics";
import FilterSection from "../FilterSection/FilterSection";
import { useState, useEffect } from "react";
import { useGetCoinStatsQuery } from "@/redux/features/reportAndAnalytics/reportAndAnalyticsApi";
import { Button } from "@/components/ui/button";
import useExportData from "@/hooks/useExportData";

export default function Coins() {
  const [dateFilter, setDateFilter] = useState("last_30_days");
  const [allFilter, setAllFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);

  // Generate date range based on filter
  const getDateRange = () => {
    const now = new Date();
    const formatDate = (date: Date) => date.toISOString().split("T")[0];

    // If custom date range is selected
    if (dateFilter === "custom" && fromDate && toDate) {
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
        const lastDayOfMonth = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
        );
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

  // Fetch coin stats with date range
  const { data: coinStatsData, isLoading } = useGetCoinStatsQuery(
    dateRange || { from: "", to: "" },
    { skip: !dateRange?.from || !dateRange?.to },
  );

  // Handle date filter change
  useEffect(() => {
    setShowCustomDateRange(dateFilter === "custom");
  }, [dateFilter]);

  const handleResetFilter = () => {
    setDateFilter("last_30_days");
    setAllFilter("all");
    setFromDate("");
    setToDate("");
  };

  // Format date for display
  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const { exportToCSV } = useExportData({
    fileName: "Coin Management Analytics",
  });

  const handleExport = () => {
    const rawData = coinStatsData?.data;

    if (!rawData) {
      alert("No data available to export!");
      return;
    }

    const dataToExport = [];

    dataToExport.push({
      Category: "Overall Stats",
      Label: "Total Coin Given",
      Value: rawData.totalCoinGiven || 0,
    });
    dataToExport.push({
      Category: "Overall Stats",
      Label: "Total Coin Redeem",
      Value: rawData.totalCoinRedeem || 0,
    });
    dataToExport.push({
      Category: "Overall Stats",
      Label: "Total Coin Expired",
      Value: rawData.totalCoinExpired || 0,
    });
    dataToExport.push({
      Category: "Overall Stats",
      Label: "Total Active Users With Coin",
      Value: rawData.totalActiveUsersWithCoin || 0,
    });

    if (rawData.coinSummaryChart?.length > 0) {
      rawData.coinSummaryChart.forEach((item: { label: any; value: any; }) => {
        dataToExport.push({
          Category: "Coin Summary Chart",
          Label: item.label,
          Value: item.value,
        });
      });
    }

    if (rawData.coinByActivityChart?.length > 0) {
      rawData.coinByActivityChart.forEach((item: { event: any; coins: any; }) => {
        dataToExport.push({
          Category: "Activity Stats",
          Label: item.event,
          Value: item.coins,
        });
      });
    }

    if (dataToExport.length > 0) {
      exportToCSV(dataToExport, "Coin_Analytics_Report");
    }
  };

  return (
    <div className="px-8 sm:p-6 bg-[#F5F7FA]">
      <div className="w-full mx-auto space-y-4 mb-6">
        {/* Header Section */}
        <div className="flex flex-wrap items-center justify-between">
          <div className="pt-2 sm:py-2">
            <h1 className="text-black text-2xl font-bold">
              Coin Management Analytics
            </h1>
            <div className="text-base text-[#6B6B6B] flex flex-wrap items-center gap-2">
              {dateRange && (
                <>
                  <span>Showing coin data from</span>
                  <span className="font-medium">
                    {formatDisplayDate(dateRange.from)} to{" "}
                    {formatDisplayDate(dateRange.to)}
                  </span>
                </>
              )}
            </div>
          </div>

          <Button onClick={handleExport} className="bg-[#FFCC00] hover:bg-[#E6B800] text-black font-semibold py-2 px-4 rounded flex items-center gap-2 cursor-pointer">
            <span className="text-sm">Download Report</span>
          </Button>
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

      {/* Coins Analytics Section */}
      <CoinsAnalytics
        coinStatsData={coinStatsData?.data}
        isLoading={isLoading}
      />

      {/* Coins chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CoinSummaryChart
          coinSummaryChart={coinStatsData?.data?.coinSummaryChart}
          isLoading={isLoading}
        />
        <CoinsByActivityChart
          coinByActivityChart={coinStatsData?.data?.coinByActivityChart}
          isLoading={isLoading}
        />
      </div>

      {/* Export Report Section */}
      {/* <div className="w-full bg-white p-6 my-5 rounded-xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-10">
        <div>
          <h2 className="text-lg font-semibold">Download Reports</h2>
          <p className="text-sm text-gray-500">
            Export comprehensive coin analytics reports
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
