import { Eye, Zap, TrendingUp, RotateCw } from "lucide-react";
import { StatCard } from "./StatCard";
import { useGetGlobalStatsQuery } from "@/redux/features/advertise/advertiseApi";

interface AdvertiseManagementTopProps {
  activeTab: "USER" | "RAIDER";
  selectedAdId?: string;
  selectedAdTitle?: string;
}

export default function AdvertiseManagementTop({
  activeTab,
  selectedAdId,
  selectedAdTitle,
}: AdvertiseManagementTopProps) {
  const isGlobal = !selectedAdId || selectedAdId === "ALL";

  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useGetGlobalStatsQuery({
    role: activeTab,
    advertiseId: !isGlobal ? selectedAdId : undefined,
  });

  const stats = data?.data;

  // Safe fallback
  const impressions = Number(stats?.totalImpression ?? stats?.impression ?? 0);
  const clicks = Number(stats?.totalClick ?? stats?.click ?? 0);
  const ctr =
    stats?.avgCtr !== undefined
      ? stats.avgCtr
      : stats?.ctr !== undefined
      ? stats.ctr
      : impressions > 0
      ? Number(((clicks / impressions) * 100).toFixed(1))
      : 0;

  return (
    <div className="p-4 md:p-8">
      {/* Header with Ad Info & Refresh Button */}
      <div className="flex justify-between items-center max-w-4xl m-auto mb-6 flex-wrap gap-2">
        <div className="text-sm font-medium text-gray-700 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-xs">
          {isGlobal ? (
            <span>
              Showing: <strong className="text-amber-600">All Advertisements ({activeTab === "USER" ? "User" : "Driver"})</strong>
            </span>
          ) : (
            <span>
              Showing Ad: <strong className="text-amber-600">{selectedAdTitle || `#${selectedAdId}`}</strong>
            </span>
          )}
        </div>

        <button
          onClick={() => refetch()}
          disabled={isLoading || isFetching}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-all disabled:opacity-50 cursor-pointer"
        >
          <RotateCw
            className={`w-4 h-4 text-gray-600 ${isLoading || isFetching ? "animate-spin" : ""}`}
          />
          <span className="text-sm font-medium text-gray-600">
            {isFetching ? "Refreshing..." : "Refresh"}
          </span>
        </button>
      </div>

      {isLoading ? (
        <p className="text-center py-10 text-gray-500 font-medium">Loading stats...</p>
      ) : (
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
      )}
    </div>
  );
}
