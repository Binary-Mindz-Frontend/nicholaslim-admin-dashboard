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
import SimpleChangeLogTable from "@/components/Shared/DynamicChangeLogTable/SimpleChangeLogTable";

const IncentiveManagementPage: React.FC = () => {
  const [openCreate, setOpenCreate] = useState(false);

  // Pagination and Search State (matching the Customer Order file)
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const { data: logApiResponse, isLoading: isLogsLoading } =
    useGetAllIncentiveLogsQuery({
      page,
      limit,
      search: search || undefined,
    });

  // Extract logs and meta from the API response structure provided
  const logs = logApiResponse?.data?.data || [];
  const meta = logApiResponse?.data?.meta || {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  const incentiveColumns = [
    {
      header: "Date",
      render: (row: any, index: number) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-700 whitespace-nowrap">
            {new Date(row.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {index === 0 && page === 1 && (
            <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-bold border border-amber-200">
              LATEST
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Incentive Info",
      render: (row: any) => (
        <div className="flex flex-col gap-1 min-w-[200px]">
          <span className="font-bold text-slate-900 leading-none">
            {row.incentiveData?.name || "N/A"}
          </span>
          <div className="flex gap-1 items-center mt-1">
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100 font-bold">
              ID: {row.incentiveId}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-bold uppercase">
              {row.incentiveData?.claim_type}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Reward",
      render: (row: any) => (
        <div className="flex flex-col">
          <span className="font-bold text-green-600">
            {row.incentiveData?.reward_type === "FIXED" ? "$" : ""}
            {row.incentiveData?.reward_value}
            {row.incentiveData?.reward_type === "PERCENTAGE" ? "%" : ""}
          </span>
          <span className="text-[10px] text-gray-400 font-medium">
            {row.incentiveData?.reward_type}
          </span>
        </div>
      ),
    },
    {
      header: "Changed By",
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-bold border border-slate-200 uppercase text-slate-600">
            {row.changedByRole?.substring(0, 2) || "AD"}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-900">
              ID: {row.changedByAdminId || "SYS"}
            </span>
            <span className="text-[10px] text-slate-500 font-bold uppercase leading-none">
              {row.changedByRole}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
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

        {/* Updated Change Logs Section using SimpleChangeLogTable */}
        <div className="pt-8">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900">
              Configuration Logs
            </h3>
            <p className="text-sm text-gray-500">
              History of incentive adjustments and creation.
            </p>
          </div>

          <SimpleChangeLogTable
            logs={logs}
            columns={incentiveColumns}
            meta={meta}
            isLoading={isLogsLoading}
            page={page}
            limit={limit}
            search={search}
            onPageChange={setPage}
            onLimitChange={setLimit}
            onSearchChange={setSearch}
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
