
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface OrdersByTimeProps {
  timeOfDayStats: [
    {
      timeSlot: string;
      total: number;
    }
  ]
}

export default function OrdersByTime({ timeOfDayStats }: OrdersByTimeProps) {
  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-1">Orders by Time</h3>
      <p className="text-sm text-gray-500 mb-4">Distribution throughout the day</p>

      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={timeOfDayStats}>
            <CartesianGrid vertical={false} stroke="#f3f3f3" />
            <XAxis dataKey="timeSlot" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar
              dataKey="total"
              radius={[6, 6, 0, 0]}
              fill="url(#colorGradient)"
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.85} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.2} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
