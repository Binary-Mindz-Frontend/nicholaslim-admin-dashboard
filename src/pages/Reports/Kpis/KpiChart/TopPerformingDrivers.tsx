import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

interface TopDriver {
  driverId: number;
  driverName: string;
  revenue: number;
}

interface TopPerformingDriversProps {
  topDrivers: TopDriver[];
  isLoading?: boolean;
}

export default function TopPerformingDrivers({
  topDrivers,
  isLoading,
}: TopPerformingDriversProps) {
  // Format data for chart
  const formatChartData = () => {
    if (!topDrivers || topDrivers.length === 0) {
      return [
        { name: "No Data", value: 0 },
        { name: "No Data", value: 0 },
        { name: "No Data", value: 0 },
        { name: "No Data", value: 0 },
        { name: "No Data", value: 0 },
      ].reverse();
    }

    // Get top 5 drivers
    const top5 = topDrivers.slice(0, 5);

    return top5
      .map((driver) => ({
        name: driver.driverName || "Unknown",
        value: driver.revenue || 0,
        driverId: driver.driverId,
      }))
      .reverse();
  };

  const data = formatChartData();

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 w-full">
        <h3 className="text-lg font-semibold mb-2">Top Performing Drivers</h3>
        <p className="text-sm text-gray-500 mb-4">By revenue generated</p>
        <div className="w-full h-[260px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 w-full">
      <h3 className="text-lg font-semibold mb-2">Top Performing Drivers</h3>
      <p className="text-sm text-gray-500 mb-4">By revenue generated</p>

      <div className="w-full h-[260px] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 8, right: 20, left: 10, bottom: 8 }}
          >
            <XAxis
              type="number"
              axisLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value}`}
            />

            <YAxis
              dataKey="name"
              type="category"
              axisLine={false}
              tick={{ fontSize: 12 }}
              width={80}
            />

            <Tooltip
              formatter={(value, name, props) => [
                `$${value}`,
                name,
                props.payload.name,
              ]}
              labelFormatter={(label) => `Driver ID: ${label}`}
            />

            <defs>
              <linearGradient id="barGreen" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#34D399" />
              </linearGradient>
            </defs>

            <Bar dataKey="value" barSize={18} radius={[8, 8, 8, 8]}>
              {data.slice(0, 5).map((index) => (
                <Cell key={`cell-${index}`} fill="url(#barGreen)" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
