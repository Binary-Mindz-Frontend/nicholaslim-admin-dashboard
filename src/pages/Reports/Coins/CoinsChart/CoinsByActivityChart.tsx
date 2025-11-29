
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function CoinsByActivityChart() {
  const data = [
    { name: "Share on Social", value: 500 },
    { name: "Completed Orders", value: 700 },
    { name: "Referral", value: 950 },
    { name: "Daily Login", value: 350 },
    { name: "First Sign-up", value: 520 },
  ];

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold">Coins Earned by Activity Type</h3>
      <p className="text-sm text-gray-500 mb-4">
        Distribution of coins across different activities
      </p>

      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <defs>
              {/* Green gradient */}
              <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="20%" stopColor="#22C55E" />
                <stop offset="100%" stopColor="#22C55E" stopOpacity={0.2} />
              </linearGradient>
            </defs>

            <Bar
              dataKey="value"
              fill="url(#activityGradient)"
              barSize={50}
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
