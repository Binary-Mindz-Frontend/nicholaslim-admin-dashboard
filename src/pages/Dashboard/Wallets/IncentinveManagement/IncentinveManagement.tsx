/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState } from "react";
import IncentivesManagement from "./_components/IncentivesManagement";
import IncentivesList from "./_components/IncentivesList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateIncentiveDialog from "./CreateIncentive/CreateIncentiveDialog";
import { useGetAllIncentiveLogsQuery } from "@/redux/features/incentives/incentivesApi";
import { DynamicChangeLogTable } from "@/components/Shared/DynamicChangeLogTable/DynamicChangeLogTable";

const IncentiveManagementPage: React.FC = () => {
  const [openCreate, setOpenCreate] = useState(false);

  const { data: incentiveLogs, isLoading } = useGetAllIncentiveLogsQuery(undefined);

  const incentiveColumns = [
    {
      header: "Date",
      accessor: "createdAt",
      render: (row: any, index: number) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">
            {new Date(row.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
          {index === 0 && (
            <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-bold border border-amber-200">
              LATEST
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Incentive Info",
      accessor: "incentiveName",
      render: (row: any) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">{row.incentiveName}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 w-fit font-bold mt-1">
            {row.type}
          </span>
        </div>
      ),
    },
    {
      header: "Amount",
      accessor: "incentiveAmount",
      align: "right" as const,
      render: (row: any) => (
        <span className="font-bold text-green-600">${row.incentiveAmount}</span>
      ),
    },
    {
      header: "Changed By",
      accessor: "changedByRole",
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold border border-slate-200">
            {row.changedByAdminId}
          </div>
          <span className="text-xs font-semibold text-slate-500 uppercase">
            {row.changedByRole}
          </span>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (row: any) => (
        <span
          className={`px-2 py-1 rounded-full text-[10px] font-bold border ${
            row.status === "ONGOING"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-slate-50 text-slate-600 border-slate-200"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Incentive Management
        </h1>

        <IncentivesManagement onCreateNew={() => setOpenCreate(true)} />

        <div className="flex justify-between items-center mt-12">
          <h3 className="text-lg font-bold text-gray-900">Incentives List</h3>
          <Button
            onClick={() => setOpenCreate(true)}
            className="cursor-pointer font-semibold gap-2 mt-4 sm:mt-0 flex items-center px-4 py-2 bg-yellow-400 rounded-lg hover:bg-yellow-500 text-black transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Incentive
          </Button>
        </div>

        <IncentivesList />

        {/* Dynamic Table Implementation */}
        <DynamicChangeLogTable
          columns={incentiveColumns}
          data={incentiveLogs?.data || []}
          isLoading={isLoading}
        />

        <CreateIncentiveDialog
          open={openCreate}
          onOpenChange={setOpenCreate}
          incentiveToEdit={null}
        />
      </div>
    </main>
  );
};

export default IncentiveManagementPage;
