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
    <div className="bg-white rounded-xl shadow-sm  p-6 flex flex-col items-center text-center border border-gray-100">
      <div className="mb-3">{icon}</div>

      <h2 className="text-xl sm:text-2xl font-semibold">{value}</h2>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

export default function OverviewSection() {
  // Dummy Data Array
  const statsData: StatCardProps[] = [
    {
      icon: (
        <Package className="h-8 w-8 text-blue-500 bg-blue-100 p-1.5 rounded-md" />
      ),
      value: "2,350",
      label: "Total Orders",
    },
    {
      icon: (
        <CheckCircle className="h-8 w-8 text-green-500 bg-green-100 p-1.5 rounded-md" />
      ),
      value: "2,100",
      label: "Completed Orders",
    },
    {
      icon: (
        <XCircle className="h-8 w-8 text-red-500 bg-red-100 p-1.5 rounded-md" />
      ),
      value: "180",
      label: "Cancelled Orders",
    },
    {
      icon: (
        <Shield className="h-8 w-8 text-yellow-500 bg-yellow-100 p-1.5 rounded-md" />
      ),
      value: "25",
      label: "Disputes",
    },
    {
      icon: (
        <Star className="h-8 w-8 text-orange-400 bg-orange-100 p-1.5 rounded-md" />
      ),
      value: "4.7",
      label: "Avg Rating",
    },
    {
      icon: (
        <DollarSign className="h-8 w-8 text-emerald-500 bg-emerald-100 p-1.5 rounded-md" />
      ),
      value: "$84,200",
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
