/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetCoinLogsQuery } from "@/redux/features/coinManagement/coinManagementApi";
import CoinSystem from "./_components/coint-system/CoinSystem";
import UserCoinAudit from "./_components/user-coins/UserCoinAudit";
import { DynamicChangeLogTable } from "@/components/Shared/DynamicChangeLogTable/DynamicChangeLogTable";

const CoinPage = () => {
  const { data: coinLogs, isLoading } = useGetCoinLogsQuery(null);

  const coinColumns = [
    {
      header: "Date",
      accessor: "createdAt",
      render: (row: any, index: number) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-700">
            {new Date(row.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
          {index === 0 && (
            <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-bold border border-amber-200 uppercase">
              Latest
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Event Key",
      accessor: "key",
      render: (row: any) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">{row.key}</span>
          <span className="text-[11px] text-slate-500 italic">
            {row.description}
          </span>
        </div>
      ),
    },
    {
      header: "Reward Details",
      accessor: "coinAmount",
      render: (row: any) => (
        <div className="flex flex-col">
          <span className="font-bold text-blue-600">
            {row.coinAmount} Coins
          </span>
          <span className="text-[11px] text-slate-500">
            Value: {row.coinValueInCent}¢
          </span>
        </div>
      ),
    },
    {
      header: "Expiry",
      accessor: "expireDays",
      render: (row: any) => (
        <span className="text-sm font-medium text-orange-600">
          {row.expireDays} Days
        </span>
      ),
    },
    {
      header: "Changed By",
      accessor: "changedByRole",
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold border border-slate-200">
            U:{row.changedByUserId}
          </div>
          <span className="text-xs font-semibold text-slate-500 uppercase">
            {row.changedByRole}
          </span>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "isActive",
      render: (row: any) => (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
            row.isActive
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-600 border-red-200"
          }`}
        >
          {row.isActive ? "ACTIVE" : "INACTIVE"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8 p-6">
      <CoinSystem />
      <UserCoinAudit />

      <div className="mx-6 sm:mx-12">
        <DynamicChangeLogTable
          columns={coinColumns}
          data={coinLogs?.data || []}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default CoinPage;
