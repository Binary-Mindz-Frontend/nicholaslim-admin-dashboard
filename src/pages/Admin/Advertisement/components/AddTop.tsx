

import { Eye, Zap, TrendingUp } from "lucide-react";
import { StatCard } from "./StatCard";
import { useGetGlobalStatsQuery } from "@/redux/features/advertise/advertiseApi";

export default function AdvertiseManagementTop({
  activeTab,
}: {
  activeTab: "USER" | "RAIDER";
}) {
  const { data, isLoading } = useGetGlobalStatsQuery({
    role: activeTab,
  });

  if (isLoading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  const stats = data?.data;

  // Safe fallback
  const impressions = stats?.totalImpression ?? 0;
  const clicks = stats?.totalClick ?? 0;
  const ctr = stats?.avgCtr ?? 0;

  return (
    <div className="p-8">
      <div className="flex flex-wrap gap-6 max-w-4xl m-auto">
        <StatCard
          title="Total Impression"
          value={impressions.toLocaleString()}
          change=""
          icon={<Eye className="w-5 h-5" />}
          color="text-yellow-600"
        />

        <StatCard
          title="Total Clicks"
          value={clicks.toLocaleString()}
          change=""
          icon={<Zap className="w-5 h-5" />}
          color="text-yellow-600"
        />

        <StatCard
          title="Click Through Rate"
          value={`${ctr}%`}
          change=""
          icon={<TrendingUp className="w-5 h-5" />}
          color="text-yellow-600"
        />
      </div>
    </div>
  );
}
