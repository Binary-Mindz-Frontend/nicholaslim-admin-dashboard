
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

const drivers = [
  { name: "Adib", value: 115 },
  { name: "Siras", value: 105 },
  { name: "Sadat", value: 98 },
  { name: "Jihad", value: 92 },
  { name: "Nill", value: 85 },
];

export default function TopPerformingDrivers() {
  const data = [...drivers].reverse(); // Highest at top

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
              domain={[0, 120]}
              axisLine={false}
              tick={{ fontSize: 12 }}
            />

            <YAxis
              dataKey="name"
              type="category"
              axisLine={false}
              tick={{ fontSize: 12 }}
              width={80}
            />

            <Tooltip formatter={(value) => [`${value}`, "Score"]} />

            <defs>
              <linearGradient id="barGreen" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#34D399" />
              </linearGradient>
            </defs>

            <Bar dataKey="value" barSize={18} radius={[8, 8, 8, 8]}>
              {data.map((item) => (
                <Cell key={item.name} fill="url(#barGreen)" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
