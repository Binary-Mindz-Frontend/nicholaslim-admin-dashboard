import {
  Plus,
  BarChart2,
  Download,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  CancelledIcons,
  DeliversIcons,
  OrderIcons,
  RevenueIcons,
} from "@/components/Icons/Icons";

export default function OrderInsight() {
  const stats = [
    {
      id: 1,
      value: "75",
      title: "Orders",
      iconBg: "bg-yellow-100",
      icon: <OrderIcons />,
      percent: "4%",
      days: "(30 days)",
      trendColor: "text-green-500",
      trend: "up",
    },
    {
      id: 2,
      value: "357",
      title: "Active Deliveries",
      iconBg: "bg-yellow-100",
      icon: <DeliversIcons />,
      percent: "4%",
      days: "(30 days)",
      trendColor: "text-green-500",
      trend: "up",
    },
    {
      id: 3,
      value: "65",
      title: "Total Cancelled",
      iconBg: "bg-yellow-100",
      icon: <CancelledIcons />,
      percent: "25%",
      days: "(30 days)",
      trendColor: "text-red-500",
      trend: "down",
    },
    {
      id: 4,
      value: "$128",
      title: "Revenue",
      iconBg: "bg-yellow-100",
      icon: <RevenueIcons />,
      percent: "12%",
      days: "(30 days)",
      trendColor: "text-red-500",
      trend: "down",
    },
  ];

  return (
    <div className="">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 sm:pt-5">
        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800 pt-2 sm:pt-0">Order Insight</h2>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button className="flex items-center gap-2 bg-white border px-3 sm:px-4 py-2 rounded-lg shadow-sm hover:bg-gray-100 transition">
            <Plus size={20} />
            <span>New Order</span>
          </button>

          <button className="flex items-center gap-2 bg-white border px-3 sm:px-4 py-2 rounded-lg shadow-sm hover:bg-gray-100 transition">
            <BarChart2 size={20} />
            <span>View Reports</span>
          </button>

          <button className="flex items-center gap-2 bg-primary text-gray-900 px-3 sm:px-4 py-2 rounded-lg shadow hover:bg-primary/80 transition">
            <Download size={20} />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {stats.map((item) => (
          <div
            key={item.id}
            className="bg-white p-6 rounded-2xl shadow-sm border flex justify-center items-center gap-4"
          >
            {/* Icon Left */}
            <div className="w-[85px] h-[85px] rounded-xl flex items-center justify-center">
              {item.icon}
            </div>

            {/* Content Right */}
            <div className="flex flex-col">
              <h3 className="text-3xl font-semibold text-gray-800">
                {item.value}
              </h3>
              <p className="text-gray-500">{item.title}</p>

              {/* Trend */}
              <div className="flex items-center gap-2 text-sm mt-2">
                {item.trend === "up" ? (
                  <TrendingUp size={16} className={item.trendColor} />
                ) : (
                  <TrendingDown size={16} className={item.trendColor} />
                )}

                <span className={`${item.trendColor} font-medium`}>
                  {item.percent}
                </span>

                <span className="text-gray-400">{item.days}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
