
import { ArrowDown, ArrowUp, Clock, DollarSign, CheckCircle, TrendingUp } from "lucide-react";

export default function KpiStats() {
  const stats = [
    {
      title: "Avg Delivery Time",
      value: "28 mins",
      change: "3 mins from last week",
      isUp: false,
      icon: <Clock size={20} />,
      bg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Avg Order Value",
      value: "$20.55",
      change: "$1.20 From last week",
      isUp: true,
      icon: <DollarSign size={20} />,
      bg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      title: "Completion Rate",
      value: "89.4%",
      change: "2.1% from last week",
      isUp: true,
      icon: <CheckCircle size={20} />,
      bg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Cancellation Rate",
      value: "7.7%",
      change: "1.5% from last week",
      isUp: false,
      icon: <TrendingUp size={20} />,
      bg: "bg-red-100",
      iconColor: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5 w-full">
      {stats.map((item, index) => (
        <div
          key={index}
          className="bg-white p-5 rounded-xl shadow-sm border border-gray-200"
        >
          
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-md flex items-center justify-center ${item.bg}`}>
              <span className={item.iconColor}>{item.icon}</span>
            </div>
            <span className="text-base font-bold text-gray-600">{item.title}</span>
          </div>

          <div className="text-2xl font-semibold mb-2">{item.value}</div>
        
          <div className="flex items-center text-sm font-medium gap-1">
            {item.isUp ? (
              <ArrowUp size={16} className="text-green-600" />
            ) : (
              <ArrowDown size={16} className="text-green-600" />
            )}
            <span className="text-green-600 font-bold">{item.change}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
