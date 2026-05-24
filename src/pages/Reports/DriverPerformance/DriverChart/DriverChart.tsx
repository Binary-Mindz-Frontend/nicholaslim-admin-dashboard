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
  performanceData?: any; // API এর পুরো অবজেক্ট অথবা শুধু data অ্যারে দুইটাই হ্যান্ডেল করার জন্য any রাখা হলো
}

export default function DriverPerformanceChart({
  // selectedMonth,
  performanceData,
}: DriverPerformanceChartProps) {
  // ১. API থেকে যদি পুরো রেসপন্স অবজেক্ট আসে (যার ভেতর .data আছে) অথবা সরাসরি অ্যারে আসে, দুইটাই হ্যান্ডেল করার জন্য:
  const rawData =
    performanceData?.data ||
    (Array.isArray(performanceData) ? performanceData : []);

  // ২. API এর সঠিক key (completedOrders, cancelledOrders) ম্যাপ করা হয়েছে
  const chartData =
    rawData.length > 0
      ? rawData.map((item: any) => ({
          name: item.week,
          completed: item.completedOrders || 0, // এখানে কি (key) পরিবর্তন করা হয়েছে
          cancelled: item.cancelledOrders || 0, // এখানে কি (key) পরিবর্তন করা হয়েছে
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
