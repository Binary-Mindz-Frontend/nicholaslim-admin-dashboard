// src/components/PerformanceTrend.tsx
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

const data = [
  {
    name: "Week 1",
    impressions: 12000,
    clicks: 2000,
  },
  {
    name: "Week 2",
    impressions: 14000,
    clicks: 4500,
  },
  {
    name: "Week 3",
    impressions: 11000,
    clicks: 2500,
  },
  {
    name: "Week 4",
    impressions: 11500,
    clicks: 3000,
  },
];

export default function PerformanceTrendsChart() {
  return (
    <Card className="mt-10 shadow-lg border-0">
      <CardHeader className="pb-4">
        <div className="flex items-center md:justify-between gap-2 flex-col md:flex-row justify-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Performance Trends
          </CardTitle>
          <Select defaultValue="this-month">
            <SelectTrigger className="w-40 border-gray-300">
              <SelectValue>This Month</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#6b7280", fontSize: 14 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#9ca3af", fontSize: 14 }}
                axisLine={false}
                tickLine={false}
                ticks={[0, 4000, 8000, 12000, 16000]}
                domain={[0, 16000]}
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

              {/* Impressions - Teal Gradient */}
              <Bar
                dataKey="impressions"
                barSize={60}
                radius={[20, 20, 0, 0]}
                fill="url(#impressionsGradient)"
              />

              {/* Clicks - Blue Gradient */}
              <Bar
                dataKey="clicks"
                barSize={60}
                radius={[20, 20, 0, 0]}
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
