/* eslint-disable @typescript-eslint/no-explicit-any */
// import FilterSection from "@/components/Users/FilterSection/FilterSection";
// import { useState } from "react";
// import { Download } from "lucide-react";
// import { Button } from "@/components/ui/button";
import OrdersByTime from "./CustomerChart/OrdersByTime";
import OrdersByArea from "./CustomerChart/OrdersByArea";
import DeliveryHeatmap from "./DeliveryHeatmap/DeliveryHeatmap";
import { useGetReportAndAnalyticsQuery } from "@/redux/features/reportAndAnalytics/reportAndAnalyticsApi";
import { Button } from "@/components/ui/button";
import useExportData from "@/hooks/useExportData";

export default function CustomerReport() {
  // const [dateFilter, setDateFilter] = useState("");
  // // const [activeFilter, setActiveFilter] = useState("");
  // const [allFilter, setAllFilter] = useState("");

  // const handleResetFilter = () => {
  //     setDateFilter("");
  //     // setActiveFilter("");
  //     setAllFilter("");
  // };

  const { data: reportData } = useGetReportAndAnalyticsQuery("");

  const timeOfDayStats = reportData?.data?.timeOfDayStats;
  const zoneStats = reportData?.data?.zoneStats;
  const heatmapData = reportData?.data?.heatmap;

  const { exportToCSV } = useExportData({
    fileName: "Customer Report",
  });

  const handleExport = () => {
    const rawData = reportData?.data;

    if (!rawData) {
      alert("No data available to export!");
      return;
    }

    const dataToExport: any[] = [];

    Object.entries(rawData).forEach(([key, list]) => {
      if (Array.isArray(list)) {
        list.forEach((item) => {
          dataToExport.push({
            Category: key,
            Details: Object.entries(item)
              .map(
                ([k, v]) =>
                  `${k}: ${typeof v === "object" ? JSON.stringify(v) : v}`,
              )
              .join(" | "),
          });
        });
      }
    });

    if (dataToExport.length > 0) {
      exportToCSV(dataToExport, "Analytics_Full_Report");
    } else {
      alert("No data found to export!");
    }
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
            <p className="text-base text-[#6B6B6B]">
              Overview of daily performance, earnings, and user activity
            </p>
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
      </div>
      {/* Chart section  */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Customer Behavior & Usage Reports
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <OrdersByTime timeOfDayStats={timeOfDayStats} />
          <OrdersByArea zoneStats={zoneStats} />
        </div>
      </div>

      {/* Delivary Heat Map section  */}
      <DeliveryHeatmap heatmapData={heatmapData} />

      {/* Download report  */}
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
