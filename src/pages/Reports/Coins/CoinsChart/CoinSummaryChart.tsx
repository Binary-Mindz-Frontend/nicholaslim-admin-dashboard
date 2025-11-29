
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function CoinSummaryChart() {
  const data = [
    { name: "Gave", value: 18000 },
    { name: "Redeemed", value: 13000 },
    { name: "Expired", value: 1500 },
  ];

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold">Coin Summary Chart</h3>
      <p className="text-sm text-gray-500 mb-4">
        Overview of coins gave, redeemed, and expired
      </p>

      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <defs>
              {/* Yellow gradient */}
              <linearGradient id="coinGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="20%" stopColor="#FACC15" />
                <stop offset="100%" stopColor="#FACC15" stopOpacity={0.2} />
              </linearGradient>
            </defs>

            <Bar
              dataKey="value"
              fill="url(#coinGradient)"
              barSize={60}
              radius={[10, 10, 0, 0]}
            />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
