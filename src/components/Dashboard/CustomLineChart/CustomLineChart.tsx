
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { x: 5000, y: 20 },
  { x: 10000, y: 25 },
  { x: 15000, y: 40 },
  { x: 20000, y: 75 },
  { x: 25000, y: 42 },
  { x: 30000, y: 45 },
  { x: 35000, y: 18 },
  { x: 40000, y: 20 },
  { x: 45000, y: 60 },
  { x: 50000, y: 50 },
  { x: 55000, y: 35 },
  { x: 60000, y: 45 },
];

export default function CustomAreaChart() {
  return (
    <div className="p-6 bbg-white shadow-sm border border-border rounded-2xl  mt-8">
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          {/* Grid */}
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />

          {/* Axes */}
          <XAxis
            dataKey="x"
            tickFormatter={(value) => `${value / 1000}k`}
            stroke="#888"
          />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
            stroke="#888"
          />

          {/* Tooltip */}
          <Tooltip formatter={(value:any) => new Intl.NumberFormat().format(value)} />

          {/* Gradient fill */}
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <Area
            type="monotone"
            dataKey="y"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#colorUv)"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
