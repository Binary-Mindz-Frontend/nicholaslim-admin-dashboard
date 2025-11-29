
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Week 1", completed: 450, cancelled: 40 },
  { name: "Week 2", completed: 520, cancelled: 45 },
  { name: "Week 3", completed: 460, cancelled: 42 },
  { name: "Week 4", completed: 480, cancelled: 47 },
];

export default function DriverPerformanceChart() {
  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height={350}>
  <BarChart data={data} barSize={50}>
  
    <XAxis
      dataKey="name"
      axisLine={true}       
      tickLine={false}     
      tick={{ fill: "#444" }}
    />

    <YAxis
      axisLine={true}       
      tickLine={false}      
      tick={{ fill: "#444" }}
    />

    <Tooltip />

    <Legend
      verticalAlign="bottom"
      align="center"
      iconType="circle"
      wrapperStyle={{ paddingTop: 20 }}
    />

    {/* gradients */}
    <defs>
      <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0CCE4A" />
        <stop offset="100%" stopColor="#0CCE4A10" />
      </linearGradient>

      <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#E53935" />
        <stop offset="100%" stopColor="#E5393510" />
      </linearGradient>
    </defs>

    <Bar
      dataKey="completed"
      fill="url(#greenGradient)"
      radius={[12, 12, 0, 0]}
      name="Completed"
    />

    <Bar
      dataKey="cancelled"
      fill="url(#redGradient)"
      radius={[12, 12, 0, 0]}
      name="Cancelled"
    />
  </BarChart>
</ResponsiveContainer>

    </div>
  );
}
