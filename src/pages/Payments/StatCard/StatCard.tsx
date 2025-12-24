import {
  CirclePercent,
  ClockFading,
  DollarSign,
//   TrendingUp,
//   TrendingDown,
} from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  percentage: string;
  icon: ReactNode;
  isPositive?: boolean;
  loading?: boolean;
}

// Card Component
const StatCard = ({
  title,
  value,
  percentage,
  icon,
  isPositive = true,
  loading = false,
}: StatCardProps) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 w-full">
        <div className="animate-pulse space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-32"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full">
            <div className="h-full bg-gray-200 rounded-full w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    // <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all duration-300 hover:-translate-y-1 w-[242px]">
    //   <div className="flex items-center justify-between mb-4">
    //     <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
    //     <div
    //       className={cn(
    //         "p-2.5 rounded-lg transition-all duration-300 hover:scale-110",
    //         title.includes("Revenue")
    //           ? "bg-blue-50 border border-blue-100"
    //           : title.includes("Commission")
    //           ? "bg-green-50 border border-green-100"
    //           : "bg-red-50 border border-red-100"
    //       )}
    //     >
    //       {icon}
    //     </div>
    //   </div>

    //   <div className="space-y-3">
    //     <div className="text-2xl md:text-3xl font-bold text-gray-900">
    //       ${value}
    //     </div>
    //     <div className="flex items-center gap-2">
    //       <div
    //         className={cn(
    //           "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full",
    //           isPositive
    //             ? "bg-green-50 text-green-700"
    //             : "bg-red-50 text-red-700"
    //         )}
    //       >
    //         {isPositive ? (
    //           <TrendingUp className="h-3.5 w-3.5" />
    //         ) : (
    //           <TrendingDown className="h-3.5 w-3.5" />
    //         )}
    //         <span>{percentage}</span>
    //       </div>
    //       <span className="text-xs text-gray-400">vs last month</span>
    //     </div>
    //   </div>

    //   {/* Progress bar indicator */}
    //   <div className="mt-5">
    //     <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
    //       <div
    //         className={cn(
    //           "h-full transition-all duration-700",
    //           isPositive
    //             ? "bg-gradient-to-r from-green-400 to-green-500"
    //             : "bg-gradient-to-r from-red-400 to-red-500"
    //         )}
    //         style={{ width: isPositive ? "75%" : "25%" }}
    //       ></div>
    //     </div>
    //   </div>
    // </div>
    <div className="bg-white rounded-xl shadow-sm border p-4 w-full sm:w-[220px] flex flex-col gap-1">
      <h3 className="text-black text-base sm:text-xl font-semibold">{title}</h3>
      <div className="flex items-center justify-between">
        <div className="text-base sm:text-xl font-bold mt-1">${value}</div>
        <div className="p-2 rounded-md bg-yellow-50 border border-yellow-200">
          {icon}
        </div>
      </div>

      <div
        className={cn(
          "text-sm font-medium",
          isPositive ? "text-green-600" : "text-red-600"
        )}
      >
        {percentage}
      </div>
    </div>
  );
};

// Dashboard Stats Component with API Integration
interface DashboardStatsProps {
  statsData?: {
    totalRevenue: number;
    totalCommission: number;
    totalRefunds: number;
  };
  isLoading?: boolean;
}

export default function DashboardStats({
  statsData,
  isLoading = false,
}: DashboardStatsProps) {
  // Format currency values properly
  const formatCurrency = (value: number | undefined) => {
    if (value === undefined || value === null) return "0.00";
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency(statsData?.totalRevenue),
      percentage: "+12.5%",
      //   icon: <DollarSign className="h-5 w-5 text-blue-600" />,
      icon: <DollarSign className="h-5 w-5 text-yellow-600" />,
      isPositive: true,
      loading: isLoading,
    },
    {
      title: "Net Commission",
      value: formatCurrency(statsData?.totalCommission),
      percentage: "+8.2%",
      //   icon: <CirclePercent className="h-5 w-5 text-green-600" />,
      icon: <CirclePercent className="h-5 w-5 text-yellow-600" />,
      isPositive: true,
      loading: isLoading,
    },
    {
      title: "Refunds",
      value: formatCurrency(statsData?.totalRefunds),
      percentage: "-3.2%",
      //   icon: <ClockFading className="h-5 w-5 text-red-600" />,
      icon: <ClockFading className="h-5 w-5 text-yellow-600" />,
      isPositive: false,
      loading: isLoading,
    },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-6">
      {stats.map((item, index) => (
        <StatCard
          key={index}
          title={item.title}
          value={item.value}
          percentage={item.percentage}
          icon={item.icon}
          isPositive={item.isPositive}
          loading={item.loading}
        />
      ))}
    </div>
  );
}
