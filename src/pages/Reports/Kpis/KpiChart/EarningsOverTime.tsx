
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const earningsData = [
  { day: "Mon", value: 3000 },
  { day: "Tue", value: 9500 },
  { day: "Wed", value: 11000 },
  { day: "Thu", value: 8000 },
  { day: "Fri", value: 6000 },
  { day: "Sat", value: 7000 },
  { day: "Sun", value: 10000 },
];

export default function EarningsOverTime() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 w-full">
      <h3 className="text-lg font-semibold mb-2">Earnings Over Time</h3>
      <p className="text-sm text-gray-500 mb-4">Daily revenue performance</p>

      <div className="w-full h-[260px] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={earningsData}
            margin={{ top: 10, right: 16, left: 8, bottom: 8 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} />
            <YAxis tick={{ fontSize: 12 }} axisLine={false} />

            <Tooltip formatter={(value) => [`$${value}`, "Earnings"]} />

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
