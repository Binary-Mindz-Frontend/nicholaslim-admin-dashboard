import { JSX } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

type Point = {
  label: string; // x axis label
  cancelled: number;
  completed: number;
};

const data: Point[] = [
  { label: "0", cancelled: 1700, completed: 1400 },
  { label: "Week 1", cancelled: 600, completed: 2000 },
  { label: "Week 2", cancelled: 2500, completed: 2800 },
  { label: "Week 3", cancelled: 2700, completed: 2100 },
  { label: "Week 4", cancelled: 2000, completed: 700 },
];

export default function IncentivesChart(): JSX.Element {
  return (
    <section className="w-full">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-1">
          Incentives Gave vs Collected Over Time
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Track the trend of incentives distributed and collected
        </p>

        <div className="w-full h-[420px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 24, left: 24, bottom: 24 }}
            >
              <CartesianGrid stroke="#e6e6e6" strokeDasharray="3 3" />

              <XAxis
                dataKey="label"
                axisLine={false}
                tick={{ fontSize: 13, fill: "#111827" }}
                padding={{ left: 10, right: 10 }}
              />

              <YAxis
                axisLine={false}
                tick={{ fontSize: 13, fill: "#111827" }}
                domain={[0, 2800]}
                ticks={[0, 700, 1400, 2100, 2800]}
              />

              <Tooltip
                formatter={(value: number) => value.toLocaleString()}
                labelFormatter={(label: string) => `${label}`}
              />

              {/* Legend without payload — works in Recharts v2 */}
              <Legend
                verticalAlign="bottom"
                align="right"
                wrapperStyle={{ paddingTop: 12 }}
              />

              {/* Cancelled line (blue) */}
              <Line
                type="linear"
                name="Cancelled"
                dataKey="cancelled"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{
                  r: 6,
                  stroke: "#3b82f6",
                  strokeWidth: 2,
                  fill: "#ffffff",
                }}
                activeDot={{ r: 8 }}
                connectNulls
              />

              {/* Completed line (green) */}
              <Line
                type="linear"
                name="Completed"
                dataKey="completed"
                stroke="#10b981"
                strokeWidth={3}
                dot={{
                  r: 6,
                  stroke: "#10b981",
                  strokeWidth: 2,
                  fill: "#ffffff",
                }}
                activeDot={{ r: 8 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
