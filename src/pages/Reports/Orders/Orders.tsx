// import FilterSection from "@/components/Users/FilterSection/FilterSection";
// import { useState } from "react";
import { useGetReportAndAnalyticsStatsQuery } from "@/redux/features/reportAndAnalytics/reportAndAnalyticsApi";
import OverviewSection from "./OverviewSection/OverViewSection";
import { Button } from "@/components/ui/button";
import useExportData from "@/hooks/useExportData";

export default function Orders() {
  // const [dateFilter, setDateFilter] = useState("");
  // // const [activeFilter, setActiveFilter] = useState("");
  // const [allFilter, setAllFilter] = useState("");

  // const handleResetFilter = () => {
  //     setDateFilter("");
  //     // setActiveFilter("");
  //     setAllFilter("");
  // };

  const { data: reportStatsData } = useGetReportAndAnalyticsStatsQuery("");

  const { exportToCSV } = useExportData({
    fileName: "Orders Report",
  });

  const handleExport = () => {
    const rawData = reportStatsData?.data;

    if (!rawData) {
      alert("No data available to export!");
      return;
    }

    const dataToExport = [
      { Metric: "Total Orders", Value: rawData.totalOrder || 0 },
      { Metric: "Completed Orders", Value: rawData.completedOrder || 0 },
      { Metric: "Cancelled Orders", Value: rawData.cancelledOrder || 0 },
      { Metric: "Disputed Orders", Value: rawData.disputedOrder || 0 },
      { Metric: "Active Orders", Value: rawData.activeOrder || 0 },
      {
        Metric: "Average Order Rating",
        Value: rawData.averageOrderRating || 0,
      },
      { Metric: "Total Revenue", Value: `$${rawData.totalRevenue || 0}` },
    ];

    exportToCSV(dataToExport, "Order_Statistics_Report");
  };
  return (
    <div className="px-8 sm:p-6 bg-[#F5F7FA]">
      <div className="w-full mx-auto space-y-4 mb-6">
        {/* Header Section */}
        <div className="flex flex-wrap items-center justify-between">
          <div className="pt-2 sm:py-2">
            <h1 className="text-black text-2xl font-bold">
              Reports & Analytics{" "}
            </h1>
          </div>

          <Button
            onClick={handleExport}
            className="bg-[#FFCC00] hover:bg-[#E6B800] text-black font-semibold py-2 px-4 rounded flex items-center gap-2 cursor-pointer"
          >
            <span className="text-sm">Download Report</span>
          </Button>
        </div>

        {/* <FilterSection
                    dateFilter={dateFilter}
                    setDateFilter={setDateFilter}
                    // activeFilter={activeFilter}
                    // setActiveFilter={setActiveFilter}
                    allFilter={allFilter}
                    setAllFilter={setAllFilter}
                    handleResetFilter={handleResetFilter}
                /> */}

        <OverviewSection data={reportStatsData} />
      </div>
    </div>
  );
}
