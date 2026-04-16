"use client";

import { Eye, Zap, TrendingUp, RotateCw } from "lucide-react"; // RotateCw ইমপোর্ট করুন
import { StatCard } from "./StatCard";
import { useGetGlobalStatsQuery } from "@/redux/features/advertise/advertiseApi";
// import { useState } from "react";

export default function AdvertiseManagementTop({
  activeTab,
}: {
  activeTab: "USER" | "RAIDER";
}) {
  // refetch ফাংশনটি বের করে আনুন
  const { data, isLoading, isFetching, refetch } = useGetGlobalStatsQuery({
    role: activeTab,
  });

  const stats = data?.data;

  // Safe fallback
  const impressions = stats?.totalImpression ?? 0;
  const clicks = stats?.totalClick ?? 0;
  const ctr = stats?.avgCtr ?? 0;

  return (
    <div className="p-8">
      {/* Header with Refresh Button */}
      <div className="flex justify-end items-center max-w-4xl m-auto mb-6">
        {/* <h2 className="text-lg font-semibold text-gray-700">Quick Stats</h2> */}

        <button
          onClick={() => refetch()}
          disabled={isLoading || isFetching}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-all disabled:opacity-50"
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
        <p className="text-center py-10">Loading...</p>
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
