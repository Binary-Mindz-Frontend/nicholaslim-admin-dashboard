import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface CoinSummaryChartItem {
  label: string;
  value: number;
}

interface CoinSummaryChartProps {
  coinSummaryChart?: CoinSummaryChartItem[];
  isLoading?: boolean;
}

export default function CoinSummaryChart({ coinSummaryChart, isLoading }: CoinSummaryChartProps) {
  // Prepare chart data
  const chartData = coinSummaryChart || [
    { label: "Gave", value: 0 },
    { label: "Redeemed", value: 0 },
    { label: "Expired", value: 0 },
  ];

  // Define colors for each bar
  // const colors = ["#FACC15", "#22C55E", "#EF4444"];

  if (isLoading) {
    return (
      <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold">Coin Summary Chart</h3>
        <p className="text-sm text-gray-500 mb-4">
          Overview of coins gave, redeemed, and expired
        </p>
        <div className="w-full h-[300px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold">Coin Summary Chart</h3>
      <p className="text-sm text-gray-500 mb-4">
        Overview of coins gave, redeemed, and expired
      </p>

      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <defs>
              <linearGradient id="coinGaveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="20%" stopColor="#FACC15" />
                <stop offset="100%" stopColor="#FACC15" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="coinRedeemedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="20%" stopColor="#22C55E" />
                <stop offset="100%" stopColor="#22C55E" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="coinExpiredGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="20%" stopColor="#EF4444" />
                <stop offset="100%" stopColor="#EF4444" stopOpacity={0.2} />
              </linearGradient>
            </defs>

            <Bar
              dataKey="value"
              barSize={60}
              radius={[10, 10, 0, 0]}
            >
              {chartData.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === 0 ? "url(#coinGaveGradient)" : 
                        index === 1 ? "url(#coinRedeemedGradient)" : 
                        "url(#coinExpiredGradient)"}
                />
              ))}
            </Bar>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`${value?.toLocaleString()} coins`, ""]}
              labelFormatter={(label) => label}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}