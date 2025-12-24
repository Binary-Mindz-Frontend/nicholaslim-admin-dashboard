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

type WeeklyDataPoint = {
  week: string;
  given: number;
  collected: number;
};

interface IncentivesChartProps {
  weeklyData?: WeeklyDataPoint[];
  isLoading?: boolean;
}

export default function IncentivesChart({ 
  weeklyData = [], 
  isLoading = false 
}: IncentivesChartProps): JSX.Element {
  
  // Loading skeleton that matches the chart container size
  if (isLoading) {
    return (
      <section className="w-full">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-1">
            Incentives Gave vs Collected Over Time
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Track the trend of incentives distributed and collected
          </p>
          
          {/* Chart container skeleton */}
          <div className="w-full h-[420px] min-w-0 bg-gray-50 animate-pulse rounded-lg">
            {/* Chart area skeleton */}
            <div className="h-full flex flex-col">
              {/* Top padding */}
              <div className="h-8"></div>
              
              {/* Main chart area with grid lines */}
              <div className="flex-1 flex">
                {/* Y-axis area */}
                <div className="w-12 flex flex-col justify-between py-4 px-2">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded w-8"></div>
                  ))}
                </div>
                
                {/* Chart grid area */}
                <div className="flex-1 relative border-l border-b border-gray-200">
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex flex-col justify-between">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-px bg-gray-200 w-full"></div>
                    ))}
                  </div>
                  
                  {/* Data line skeletons */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-1 bg-gradient-to-r from-blue-200 to-green-200 rounded-full opacity-50"></div>
                  </div>
                  
                  {/* X-axis labels */}
                  <div className="absolute -bottom-8 w-full flex justify-between px-4">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-4 bg-gray-200 rounded w-16"></div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Legend skeleton */}
              <div className="flex justify-end gap-6 mt-8 pr-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-blue-200 rounded-full"></div>
                  <div className="h-3 w-20 bg-gray-200 rounded"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-green-200 rounded-full"></div>
                  <div className="h-3 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Transform API data to match chart format
  const chartData = weeklyData.map(item => ({
    label: item.week,
    gave: item.given,
    collected: item.collected
  }));

  // If no data, show empty state
  if (chartData.length === 0) {
    return (
      <section className="w-full">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-1">
            Incentives Gave vs Collected Over Time
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Track the trend of incentives distributed and collected
          </p>
          <div className="w-full h-[420px] min-w-0 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-gray-400 mb-2">📊</div>
              <p className="text-gray-500">No data available for the selected date range</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Calculate max value for Y-axis
  const maxValue = Math.max(
    ...weeklyData.map(item => Math.max(item.given, item.collected)),
    100 // Minimum max value
  );

  // Generate Y-axis ticks
  const generateYTicks = (max: number) => {
    const step = Math.ceil(max / 4);
    const ticks = [];
    for (let i = 0; i <= max; i += step) {
      ticks.push(i);
    }
    return ticks;
  };

  const yTicks = generateYTicks(maxValue);

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
              data={chartData}
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
                domain={[0, maxValue]}
                ticks={yTicks}
              />

              <Tooltip
                formatter={(value: number) => value.toLocaleString()}
                labelFormatter={(label: string) => `${label}`}
              />

              <Legend
                verticalAlign="bottom"
                align="right"
                wrapperStyle={{ paddingTop: 12 }}
              />

              {/* Incentives Gave line (blue) */}
              <Line
                type="linear"
                name="Incentives Gave"
                dataKey="gave"
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

              {/* Incentives Collected line (green) */}
              <Line
                type="linear"
                name="Incentives Collected"
                dataKey="collected"
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