import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface CoinByActivityItem {
  event: string;
  coins: number;
}

interface CoinsByActivityChartProps {
  coinByActivityChart?: CoinByActivityItem[];
  isLoading?: boolean;
}

export default function CoinsByActivityChart({ coinByActivityChart, isLoading }: CoinsByActivityChartProps) {
  // Prepare chart data
  const formatActivityName = (event: string) => {
    // Convert event names to readable format
    const nameMap: Record<string, string> = {
      "FIRST_SIGNUP": "First Sign-up",
      "DAILY_LOGIN": "Daily Login",
      "ORDER_COMPLETION": "Completed Orders",
      "SOCIAL_SHARE": "Share on Social",
      "REFERRAL": "Referral",
      "OTHER": "Other Activities"
    };
    return nameMap[event] || event.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  // Sort by coins value descending
  const sortedData = coinByActivityChart 
    ? [...coinByActivityChart].sort((a, b) => b.coins - a.coins)
    : [];

  const chartData = sortedData.length > 0 
    ? sortedData.slice(0, 5) // Show top 5 activities
    : [
        { event: "FIRST_SIGNUP", coins: 0, name: "First Sign-up" },
        { event: "DAILY_LOGIN", coins: 0, name: "Daily Login" },
        { event: "ORDER_COMPLETION", coins: 0, name: "Completed Orders" },
        { event: "SOCIAL_SHARE", coins: 0, name: "Share on Social" },
        { event: "REFERRAL", coins: 0, name: "Referral" },
      ].map(item => ({ ...item, name: formatActivityName(item.event) }));

  if (isLoading) {
    return (
      <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold">Coins Earned by Activity Type</h3>
        <p className="text-sm text-gray-500 mb-4">
          Distribution of coins across different activities
        </p>
        <div className="w-full h-[300px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold">Coins Earned by Activity Type</h3>
      <p className="text-sm text-gray-500 mb-4">
        Distribution of coins across different activities (Top {chartData.length})
      </p>

      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <defs>
              <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="20%" stopColor="#22C55E" />
                <stop offset="100%" stopColor="#22C55E" stopOpacity={0.2} />
              </linearGradient>
            </defs>

            <Bar
              dataKey="coins"
              fill="url(#activityGradient)"
              barSize={50}
              radius={[10, 10, 0, 0]}
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 60%)`} />
              ))}
            </Bar>
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              interval={0}
              angle={0}
              height={60}
            />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`${value?.toLocaleString()} coins`, "Coins Earned"]}
              labelFormatter={(label) => `Activity: ${label}`}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}