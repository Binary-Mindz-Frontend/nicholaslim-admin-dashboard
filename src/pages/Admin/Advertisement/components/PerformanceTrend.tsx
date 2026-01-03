/* eslint-disable @typescript-eslint/no-explicit-any */


import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useGetPerformanceTrendsQuery } from "@/redux/features/advertise/advertiseApi";

export default function PerformanceTrendsChart({
  activeTab,
}: {
  activeTab: "USER" | "RAIDER";
}) {
  const [months, setMonths] = useState(1);
   // or dynamically from props

  // Fetch weekly stats using RTK Query
  const { data, isLoading } = useGetPerformanceTrendsQuery({ role:activeTab, months });
  

  if (isLoading) return <p>Loading...</p>;

  // Default to empty array if API returns nothing
  const weeklyStats = data?.data?.weeklyStats || [];  

  // Map data for recharts
  const chartData = weeklyStats.map((stat: any) => ({
    week: stat.week,
    impressions: stat.impression,
    clicks: stat.click,
  }));

  return (
    <Card className="mt-10 shadow-lg border-0">
      <CardHeader className="pb-4">
        <div className="flex items-center md:justify-between gap-2 flex-col md:flex-row justify-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Performance Trends
          </CardTitle>

          {/* Month selector */}
          <Select
            defaultValue="1"
            onValueChange={(value) => setMonths(Number(value))}
          >
            <SelectTrigger className="w-40 border-gray-300">
              <SelectValue>{months} Months</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Month</SelectItem>
              <SelectItem value="2">2 Months</SelectItem>
              <SelectItem value="3">3 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="week"
                tick={{ fill: "#6b7280", fontSize: 14 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#9ca3af", fontSize: 14 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "10px",
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: "30px" }}
                iconType="circle"
                formatter={(value) => (
                  <span className="text-sm font-medium text-gray-700">
                    {value}
                  </span>
                )}
              />

              {/* Impressions */}
              <Bar
                dataKey="impressions"
                barSize={40}
                radius={[10, 10, 0, 0]}
                fill="url(#impressionsGradient)"
              />
              {/* Clicks */}
              <Bar
                dataKey="clicks"
                barSize={40}
                radius={[10, 10, 0, 0]}
                fill="url(#clicksGradient)"
              />

              {/* Gradient Definitions */}
              <defs>
                <linearGradient
                  id="impressionsGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#5eead4" />
                  <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
                <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1e40af" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
