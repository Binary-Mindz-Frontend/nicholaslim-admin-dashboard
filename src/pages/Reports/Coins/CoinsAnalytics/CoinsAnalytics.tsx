import { FC } from "react";
import { Coins, DollarSign, Timer, Users } from "lucide-react";

interface CoinStatsData {
  totalCoinGiven: number;
  totalCoinRedeem: number;
  totalCoinExpired: number;
  totalActiveUsersWithCoin: number;
}

interface CoinsAnalyticsProps {
  coinStatsData?: CoinStatsData;
  isLoading?: boolean;
}

const CoinsAnalytics: FC<CoinsAnalyticsProps> = ({ coinStatsData, isLoading }) => {
  const analyticsData = [
    {
      id: 1,
      title: "Total Coins Given",
      value: coinStatsData?.totalCoinGiven?.toLocaleString() || "0",
      description: "Total coins distributed to users",
      icon: (
        <div className="bg-gray-100 p-2 rounded-lg inline-flex">
          <Coins className="w-5 h-5 text-gray-700" />
        </div>
      ),
    },
    {
      id: 2,
      title: "Total Coins Redeemed",
      value: coinStatsData?.totalCoinRedeem?.toLocaleString() || "0",
      description: "Coins used by users for rewards",
      icon: (
        <div className="bg-gray-100 p-2 rounded-lg inline-flex">
          <DollarSign className="w-5 h-5 text-gray-700" />
        </div>
      ),
    },
    {
      id: 3,
      title: "Total Coins Expired",
      value: coinStatsData?.totalCoinExpired?.toLocaleString() || "0",
      description: "Coins that expired over time",
      icon: (
        <div className="bg-gray-100 p-2 rounded-lg inline-flex">
          <Timer className="w-5 h-5 text-gray-700" />
        </div>
      ),
    },
    {
      id: 4,
      title: "Active Users with Coins",
      value: coinStatsData?.totalActiveUsersWithCoin?.toLocaleString() || "0",
      description: "Number of users currently holding coins",
      icon: (
        <div className="bg-gray-100 p-2 rounded-lg inline-flex">
          <Users className="w-5 h-5 text-gray-700" />
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="w-full mb-5 sm:mb-10">
        <h2 className="text-xl text-black font-bold mb-4">Coins Analytics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-white border rounded-xl p-6 shadow-sm animate-pulse"
            >
              <div className="bg-gray-200 p-2 rounded-lg inline-flex w-9 h-9"></div>
              <div className="h-4 bg-gray-200 rounded mt-3 w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded mt-2 w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded mt-2 w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mb-5 sm:mb-10">
      <h2 className="text-xl text-black font-bold mb-4">Coins Analytics</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {analyticsData.map((item) => (
          <div
            key={item.id}
            className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition"
          >
            {item.icon}
            <p className="text-sm text-gray-600 mt-3">{item.title}</p>
            <h3 className="text-2xl font-semibold mt-1">{item.value}</h3>
            <p className="text-sm text-gray-500 mt-2">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoinsAnalytics;