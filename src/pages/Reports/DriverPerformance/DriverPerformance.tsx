/* eslint-disable @typescript-eslint/no-explicit-any */
import DriverPerformanceChart from "./DriverChart/DriverChart";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useDriverColumns } from "./DriverTable/DriverTable";
import {
  useGetDriverPerformanceGraphQuery,
  useGetDriverPerformanceTopQuery,
} from "@/redux/features/reportAndAnalytics/reportAndAnalyticsApi";
import { useState } from "react";
import CustomTable from "./DriverTable/CustomTable";
import { Button } from "@/components/ui/button";
import useExportData from "@/hooks/useExportData";

export default function DriverPerformance() {
  const [selectedMonth, setSelectedMonth] = useState("THIS_MONTH");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    data: performanceData,
    isLoading: isChartLoading,
    isError: isChartError,
    error: chartError,
  } = useGetDriverPerformanceGraphQuery(selectedMonth);

  const {
    data: topDriversResponse,
    isLoading: isTableLoading,
    isError: isTableError,
  } = useGetDriverPerformanceTopQuery(500);

  const columns = useDriverColumns();

  const topDriversData = topDriversResponse?.data || [];

  const transformDriverData = (apiData: any[]): any[] => {
    if (!apiData || !Array.isArray(apiData)) return [];

    return apiData.map((driver) => ({
      id: driver.driverId || driver.id || 0,
      name: driver.driverName || driver.name || "Unknown Driver",
      orders: driver.totalOrders || driver.orders || 0,
      completed: driver.completedOrders || driver.completed || 0,
      cancelled: driver.cancelledOrders || driver.cancelled || 0,
      rating:
        typeof driver.avgRating === "number"
          ? driver.avgRating
          : typeof driver.rating === "number"
            ? driver.rating
            : 0,
      revenue: driver.revenue
        ? `$${
            typeof driver.revenue === "number"
              ? driver.revenue.toFixed(2)
              : driver.revenue
          }`
        : "$0.00",
      complaints: driver.disputes || driver.complaints || 0,
    }));
  };

  const transformedData = transformDriverData(topDriversData);

  const totalPages = Math.ceil(transformedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedData = transformedData.slice(startIndex, endIndex);

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
  };

  const { exportToCSV } = useExportData({
    fileName: "Driver Performance",
  });

  const handleExport = () => {
    const dataToExport = performanceData?.data || [];
    if (dataToExport.length > 0) {
      exportToCSV(dataToExport);
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
          </div>

          <Button
            onClick={handleExport}
            className="bg-[#FFCC00] hover:bg-[#E6B800] text-black font-semibold py-2 px-4 rounded flex items-center gap-2 cursor-pointer"
          >
            <span className="text-sm">Download Report</span>
          </Button>
        </div>

        {/* Header  */}
        <div className="w-full my-10 sm:flex sm:justify-between sm:items-center">
          <div className="flex items-center justify-between sm:justify-between pb-3">
            <h2 className="text-base font-semibold">Driver Performance</h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
            {/* MONTH SELECT */}
            <Select value={selectedMonth} onValueChange={handleMonthChange}>
              <SelectTrigger className="w-full sm:w-[120px] h-9 text-sm border-gray-300">
                <SelectValue placeholder="This Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="THIS_MONTH">This Month</SelectItem>
                <SelectItem value="LAST_MONTH">Last Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          {isChartLoading ? (
            <div className="h-[350px] flex items-center justify-center">
              <div className="text-gray-500">Loading chart data...</div>
            </div>
          ) : isChartError ? (
            <div className="h-[350px] flex items-center justify-center">
              <div className="text-red-500">Error loading chart data</div>
              <div className="text-xs text-red-400 mt-2">
                {chartError?.toString()}
              </div>
            </div>
          ) : (
            <DriverPerformanceChart
              selectedMonth={selectedMonth}
              performanceData={performanceData}
            />
          )}
        </div>
      </div>

      <h1 className="text-base sm:text-xl font-bold mt-10 mb-5">
        Top Driver Performance ({topDriversData.length} drivers)
      </h1>

      {isTableLoading ? (
        <div className="w-full h-[200px] flex items-center justify-center">
          <div className="text-gray-500">Loading driver data...</div>
        </div>
      ) : isTableError ? (
        <div className="w-full h-[200px] flex items-center justify-center">
          <div className="text-red-500">Error loading driver data</div>
        </div>
      ) : (
        <div className="space-y-4">
          <CustomTable columns={columns} data={paginatedData} />

          {totalPages > 1 && (
            <div className="flex items-center justify-end gap-2 pt-2 bg-white p-4 rounded-lg shadow-sm">
              <span className="text-sm text-gray-600 mr-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="disabled:opacity-50 cursor-pointer"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="disabled:opacity-50 cursor-pointer"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
