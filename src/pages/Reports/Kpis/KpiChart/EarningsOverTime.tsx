import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface RevenueByDay {
  date: string;
  revenue: number;
}

interface EarningsOverTimeProps {
  revenueByDay: RevenueByDay[];
  isLoading?: boolean;
}

export default function EarningsOverTime({ revenueByDay, isLoading }: EarningsOverTimeProps) {
  // Format data for chart
  const formatChartData = () => {
    if (!revenueByDay || revenueByDay.length === 0) {
      return Array.from({ length: 7 }).map((_, i) => ({
        day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
        value: 0,
      }));
    }

    // If revenueByDay has actual data, format it
    return revenueByDay.map(item => {
      const date = new Date(item.date);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      return {
        day: dayName,
        value: item.revenue || 0,
        fullDate: date.toLocaleDateString(),
      };
    });
  };

  const chartData = formatChartData();

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 w-full">
        <h3 className="text-lg font-semibold mb-2">Earnings Over Time</h3>
        <p className="text-sm text-gray-500 mb-4">Daily revenue performance</p>
        <div className="w-full h-[260px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 w-full">
      <h3 className="text-lg font-semibold mb-2">Earnings Over Time</h3>
      <p className="text-sm text-gray-500 mb-4">Daily revenue performance</p>

      <div className="w-full h-[260px] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 16, left: 8, bottom: 8 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="day" 
              tick={{ fontSize: 12 }} 
              axisLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }} 
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />

            <Tooltip 
              formatter={(value) => [`$${value}`, "Earnings"]}
              labelFormatter={(label, payload) => {
                if (payload && payload[0] && payload[0].payload.fullDate) {
                  return payload[0].payload.fullDate;
                }
                return label;
              }}
            />

            <Line
              type="monotone"
              dataKey="value"
              stroke="#fbbf24"
              strokeWidth={3}
              dot={{ r: 4, fill: "#facc15" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}