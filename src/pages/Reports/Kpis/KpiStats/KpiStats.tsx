import { Clock, DollarSign, CheckCircle, TrendingUp } from "lucide-react";

interface KpiStatsProps {
  avgDeliveryTime: number;
  avgOrderValue: number;
  completionRate: number;
  cancellationRate: number;
  isLoading?: boolean;
}

export default function KpiStats({
  avgDeliveryTime = 0,
  avgOrderValue = 0,
  completionRate = 0,
  cancellationRate = 0,
  isLoading = false,
}: KpiStatsProps) {
  const stats = [
    {
      title: "Avg Delivery Time",
      value: `${Math.round(avgDeliveryTime)} mins`,
      // change: "vs last period",
      isUp: false,
      icon: <Clock size={20} />,
      bg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Avg Order Value",
      value: `$${avgOrderValue.toFixed(2)}`,
      // change: "vs last period",
      isUp: avgOrderValue > 0,
      icon: <DollarSign size={20} />,
      bg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      title: "Completion Rate",
      value: `${completionRate.toFixed(1)}%`,
      // change: "vs last period",
      isUp: completionRate > 0,
      icon: <CheckCircle size={20} />,
      bg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Cancellation Rate",
      value: `${cancellationRate.toFixed(1)}%`,
      // change: "vs last period",
      isUp: false,
      icon: <TrendingUp size={20} />,
      bg: "bg-red-100",
      iconColor: "text-red-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5 w-full">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 animate-pulse"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-md bg-gray-200"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-32"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5 w-full">
      {stats.map((item, index) => (
        <div
          key={index}
          className="bg-white p-5 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-10 h-10 rounded-md flex items-center justify-center ${item.bg}`}
            >
              <span className={item.iconColor}>{item.icon}</span>
            </div>
            <span className="text-base font-bold text-gray-600">
              {item.title}
            </span>
          </div>

          <div className="text-2xl font-semibold mb-2">{item.value}</div>

          <div className="flex items-center text-sm font-medium gap-1">
            {/* {item.isUp ? (
              <ArrowUp size={16} className="text-green-600" />
            ) : (
              <ArrowDown size={16} className="text-red-600" />
            )} 
            <span className={item.isUp ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
              {item.change}
            </span> */}
          </div>
        </div>
      ))}
    </div>
  );
}
