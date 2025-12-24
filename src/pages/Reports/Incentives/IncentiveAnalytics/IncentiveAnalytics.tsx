import { FC, JSX } from "react";
import { Gift, DollarSign } from "lucide-react";

interface AnalyticsItem {
  id: number;
  title: string;
  value: string;
  description: string;
  icon: JSX.Element;
}

interface IncentiveAnalyticsProps {
  totalGiven?: number;
  totalCollected?: number;
  isLoading?: boolean;
}

const IncentiveAnalytics: FC<IncentiveAnalyticsProps> = ({ 
  totalGiven = 0, 
  totalCollected = 0,
  isLoading = false
}) => {
  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  const analyticsData: AnalyticsItem[] = [
    {
      id: 1,
      title: "Total Incentives Gave",
      value: formatCurrency(totalGiven),
      description: "Total value of incentives distributed",
      icon: (
        <div className="bg-gray-100 p-2 rounded-lg inline-flex">
          <Gift className="w-5 h-5 text-gray-700" />
        </div>
      ),
    },
    {
      id: 2,
      title: "Total Incentives Collected",
      value: formatCurrency(totalCollected),
      description: "Total incentives redeemed by users",
      icon: (
        <div className="bg-gray-100 p-2 rounded-lg inline-flex">
          <DollarSign className="w-5 h-5 text-gray-700" />
        </div>
      ),
    },
  ];

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="w-full mb-5 sm:mb-10">
        <h2 className="text-xl text-black font-bold mb-4">Incentives Analytics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="bg-white border rounded-xl p-6 shadow-sm"
            >
              {/* Icon skeleton */}
              <div className="bg-gray-200 animate-pulse w-10 h-10 rounded-lg"></div>
              
              {/* Title skeleton */}
              <div className="mt-3">
                <div className="bg-gray-200 animate-pulse h-4 w-32 rounded"></div>
              </div>

              {/* Value skeleton */}
              <div className="mt-1">
                <div className="bg-gray-200 animate-pulse h-8 w-24 rounded"></div>
              </div>

              {/* Description skeleton */}
              <div className="mt-2">
                <div className="bg-gray-200 animate-pulse h-3 w-40 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mb-5 sm:mb-10">
      <h2 className="text-xl text-black font-bold mb-4">Incentives Analytics</h2>

      {/* 2 Cards Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

export default IncentiveAnalytics;