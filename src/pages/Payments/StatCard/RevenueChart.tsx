"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import { Calendar, TrendingUp } from "lucide-react";

// Helper function to get month name
const getMonthName = (monthNumber: number) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[monthNumber - 1] || months[0];
};

interface MonthlyGraphData {
  month: number;
  revenue: number;
}

interface RevenueChartProps {
  graphData?: {
    year: number;
    monthlyGraph: MonthlyGraphData[];
  };
  isLoading?: boolean;
  selectedYear: string;
  onYearChange: (year: string) => void;
  years?: number[];
}

export default function RevenueChart({
  graphData,
  isLoading = false,
  selectedYear,
  onYearChange,
  years = [2030, 2029, 2028, 2027, 2026, 2025, 2024, 2023, 2022, 2021, 2020],
}: RevenueChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);

  // Transform API data for chart
  useEffect(() => {
    if (graphData?.monthlyGraph) {
      // Create data for current year
      const currentYearData = graphData.monthlyGraph.map((item) => ({
        month: getMonthName(item.month),
        revenue: item.revenue,
        year: graphData.year.toString(),
      }));
      setChartData(currentYearData);
    } else {
      // Fallback dummy data with zeros
      const fallbackData = [
        { month: "Jan", revenue: 0, year: selectedYear },
        { month: "Feb", revenue: 0, year: selectedYear },
        { month: "Mar", revenue: 0, year: selectedYear },
        { month: "Apr", revenue: 0, year: selectedYear },
        { month: "May", revenue: 0, year: selectedYear },
        { month: "Jun", revenue: 0, year: selectedYear },
        { month: "Jul", revenue: 0, year: selectedYear },
        { month: "Aug", revenue: 0, year: selectedYear },
        { month: "Sept", revenue: 0, year: selectedYear },
        { month: "Oct", revenue: 0, year: selectedYear },
        { month: "Nov", revenue: 0, year: selectedYear },
        { month: "Dec", revenue: 0, year: selectedYear },
      ];
      setChartData(fallbackData);
    }
  }, [graphData, selectedYear]);

  // Find max value for Y-axis
  const maxValue = Math.max(...chartData.map((item) => item.revenue || 0));

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-32"></div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="h-72 bg-gray-100 rounded"></div>

          {/* Month Labels */}
          <div className="flex justify-between">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="h-2 bg-gray-200 rounded w-2 mb-1"></div>
                <div className="h-2 bg-gray-200 rounded w-6"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-yellow-600" />
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              Revenue Overview
            </h1>
          </div>
          <p className="text-gray-500 text-sm">
            Monthly revenue statistics for {selectedYear}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Legend */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm font-medium text-gray-700">
              {selectedYear} Revenue
            </span>
          </div>

          {/* Year Selector */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              className="pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white cursor-pointer appearance-none hover:border-gray-400 transition-colors"
              value={selectedYear}
              onChange={(e) => onYearChange(e.target.value)}
            >
              {years.map((year) => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-72 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f0f0f0"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              domain={[0, maxValue * 1.1 || 1000]}
            />
            <Tooltip
              formatter={(value: number) => [
                `$${value.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`,
                "Revenue",
              ]}
              labelFormatter={(label) => `${label}, ${selectedYear}`}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                padding: "12px 16px",
              }}
              labelStyle={{
                fontWeight: "600",
                color: "#374151",
                marginBottom: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#0ea5e9"
              strokeWidth={3}
              dot={{
                r: 4,
                strokeWidth: 2,
                stroke: "#0ea5e9",
                fill: "white",
                strokeOpacity: 0.8,
              }}
              activeDot={{
                r: 8,
                strokeWidth: 2,
                fill: "#0ea5e9",
                stroke: "white",
              }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Month Labels */}
      <div className="flex justify-between mt-4 px-2">
        {chartData.slice(0, 12).map((item, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div
              className={`w-2 h-2 rounded-full mb-1 transition-all duration-300 ${
                item.revenue > 0
                  ? "bg-blue-500 hover:scale-125 hover:bg-blue-600"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            ></div>
            <span className="text-xs text-gray-500 font-medium">
              {item.month}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
