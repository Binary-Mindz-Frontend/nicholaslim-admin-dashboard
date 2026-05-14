// DriverChart/DriverChart.tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface DriverPerformanceChartProps {
  selectedMonth?: string;
  performanceData?: any[];
}

export default function DriverPerformanceChart({
  // selectedMonth,
  performanceData = [],
}: DriverPerformanceChartProps) {
  const chartData =
    performanceData.length > 0
      ? performanceData.map((item: any) => ({
          name: item.week,
          completed: item.completedOrders || 0,
          cancelled: item.cancelledOrders || 0,
        }))
      : [
          { name: "Week 1", completed: 0, cancelled: 0 },
          { name: "Week 2", completed: 0, cancelled: 0 },
          { name: "Week 3", completed: 0, cancelled: 0 },
          { name: "Week 4", completed: 0, cancelled: 0 },
        ];

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData} barSize={50}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            axisLine={true}
            tickLine={false}
            tick={{ fill: "#444" }}
          />
          <YAxis axisLine={true} tickLine={false} tick={{ fill: "#444" }} />
          <Tooltip
            formatter={(value: any) => [value, "Orders"]}
            labelFormatter={(label) => `Week: ${label}`}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "8px",
            }}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            wrapperStyle={{ paddingTop: 20 }}
          />

          <defs>
            <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0CCE4A" />
              <stop offset="100%" stopColor="#0CCE4A80" />
            </linearGradient>

            <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E53935" />
              <stop offset="100%" stopColor="#E5393580" />
            </linearGradient>
          </defs>

          <Bar
            dataKey="completed"
            fill="url(#greenGradient)"
            radius={[12, 12, 0, 0]}
            name="Completed Orders"
            maxBarSize={50}
          />

          <Bar
            dataKey="cancelled"
            fill="url(#redGradient)"
            radius={[12, 12, 0, 0]}
            name="Cancelled Orders"
            maxBarSize={50}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
