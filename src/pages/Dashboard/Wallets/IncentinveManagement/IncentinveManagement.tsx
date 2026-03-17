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

  const { data: incentiveLogs, isLoading } =
    useGetAllIncentiveLogsQuery(undefined);

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
              hour: "2-digit",
              minute: "2-digit",
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
      accessor: "incentiveData", // Accessing the nested object
      render: (row: any) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">
            {row.incentiveData?.name || "N/A"}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 w-fit font-bold mt-1">
            {row.incentiveData?.driver_type || "N/A"}
          </span>
        </div>
      ),
    },
    {
      header: "Reward",
      accessor: "reward_value",
      render: (row: any) => (
        <div className="flex flex-col">
          <span className="font-bold text-green-600">
            {row.incentiveData?.reward_type === "FIXED" ? "$" : ""}
            {row.incentiveData?.reward_value}
            {row.incentiveData?.reward_type === "PERCENTAGE" ? "%" : ""}
          </span>
          <span className="text-[9px] text-gray-400">
            {row.incentiveData?.reward_type}
          </span>
        </div>
      ),
    },
    {
      header: "Changed By",
      accessor: "changedByRole",
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold border border-slate-200">
            ID: {row.changedByAdminId || "SYS"}
          </div>
          <span className="text-xs font-semibold text-slate-500 uppercase">
            {row.changedByRole}
          </span>
        </div>
      ),
    },
    {
      header: "Log Status",
      accessor: "status",
      render: (row: any) => (
        <span
          className={`px-2 py-1 rounded-full text-[10px] font-bold border ${
            row.incentiveData?.status === "ACTIVE"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-600 border-red-200"
          }`}
        >
          {row.incentiveData?.status || "UNKNOWN"}
        </span>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-lg md:text-xl lg:text-3xl font-bold text-gray-900 my-6">
          Incentive Management
        </h1>

        <IncentivesManagement onCreateNew={() => setOpenCreate(true)} />

        <div className="flex justify-between items-center mt-12">
          <h3 className="text-lg font-bold text-gray-900">Active Incentives</h3>
          <Button
            onClick={() => setOpenCreate(true)}
            className="bg-[#FFCC00] hover:bg-[#e5ba0d] cursor-pointer text-black font-semibold gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Incentive
          </Button>
        </div>

        <IncentivesList />

        {/* Change Logs Section */}
        <div className="pt-8">
          <DynamicChangeLogTable
            columns={incentiveColumns}
            data={incentiveLogs?.data || []}
            isLoading={isLoading}
          />
        </div>

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
