import {
  Package,
  CheckCircle,
  XCircle,
  Shield,
  Star,
  DollarSign,
} from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}

function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center text-center border border-gray-100">
      <div className="mb-3">{icon}</div>
      <h2 className="text-xl sm:text-2xl font-semibold">{value}</h2>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

interface ReportData {
  data: {
    totalOrder: number;
    completedOrder: number;
    cancelledOrder: number;
    disputedOrder: number;
    averageOrderRating: number;
    totalRevenue?: number;
  };
}

interface OverviewSectionProps {
  data: ReportData;
}

export default function OverviewSection({ data }: OverviewSectionProps) {
  // If data is not available yet, show loading or empty state
  if (!data?.data) {
    return (
      <section className="w-full">
        <h2 className="font-semibold text-black text-xl mb-4">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center text-center border border-gray-100 animate-pulse">
              <div className="h-8 w-8 bg-gray-200 rounded-md mb-3"></div>
              <div className="h-6 w-16 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Extract data from API response
  const {
    totalOrder = 0,
    completedOrder = 0,
    cancelledOrder = 0,
    disputedOrder = 0,
    averageOrderRating = 0,
  } = data.data;

  // Format the average rating to 1 decimal place
  const formattedRating = averageOrderRating.toFixed(1);

  // Stats data using actual API data
  const statsData: StatCardProps[] = [
    {
      icon: (
        <Package className="h-8 w-8 text-blue-500 bg-blue-100 p-1.5 rounded-md" />
      ),
      value: totalOrder.toLocaleString(),
      label: "Total Orders",
    },
    {
      icon: (
        <CheckCircle className="h-8 w-8 text-green-500 bg-green-100 p-1.5 rounded-md" />
      ),
      value: completedOrder.toLocaleString(),
      label: "Completed Orders",
    },
    {
      icon: (
        <XCircle className="h-8 w-8 text-red-500 bg-red-100 p-1.5 rounded-md" />
      ),
      value: cancelledOrder.toLocaleString(),
      label: "Cancelled Orders",
    },
    {
      icon: (
        <Shield className="h-8 w-8 text-yellow-500 bg-yellow-100 p-1.5 rounded-md" />
      ),
      value: disputedOrder.toLocaleString(),
      label: "Disputed Orders",
    },
    {
      icon: (
        <Star className="h-8 w-8 text-orange-400 bg-orange-100 p-1.5 rounded-md" />
      ),
      value: formattedRating,
      label: "Avg Rating",
    },
    {
      icon: (
        <DollarSign className="h-8 w-8 text-emerald-500 bg-emerald-100 p-1.5 rounded-md" />
      ),
      value: "$0",
      label: "Total Revenue",
    },
  ];

  return (
    <section className="w-full">
      <h2 className="font-semibold text-black text-xl mb-4">Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
          />
        ))}
      </div>
    </section>
  );
}