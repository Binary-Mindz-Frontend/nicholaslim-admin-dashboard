import { FC, JSX } from "react";
import { Gift, DollarSign } from "lucide-react";

interface AnalyticsItem {
  id: number;
  title: string;
  value: string;
  description: string;
  icon: JSX.Element;
}

const analyticsData: AnalyticsItem[] = [
  {
    id: 1,
    title: "Total Incentives Gave",
    value: "$12,400",
    description: "Total value af incentives distributed",
    icon: (
      <div className="bg-gray-100 p-2 rounded-lg inline-flex">
        <Gift className="w-5 h-5 text-gray-700" />
      </div>
    ),
  },
  {
    id: 2,
    title: "Total Incentives Collected",
    value: "$9,700",
    description: "Total incentives redeemed by users",
    icon: (
      <div className="bg-gray-100 p-2 rounded-lg inline-flex">
        <DollarSign className="w-5 h-5 text-gray-700" />
      </div>
    ),
  },
];

const IncentiveAnalytics: FC = () => {
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
