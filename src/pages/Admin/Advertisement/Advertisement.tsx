/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import AdvertiseManagementTop from "./components/AddTop";
import PerformanceTrendsChart from "./components/PerformanceTrend";
import CreateNewCampaign from "./components/CreateNewCampaign";
import AdvertisementsTable from "./components/AdvertismentList";
import { useGetAllAdvertisesLogsQuery } from "@/redux/features/advertise/advertiseApi";
import { DynamicChangeLogTable } from "@/components/Shared/DynamicChangeLogTable/DynamicChangeLogTable";

export default function Advertisement() {
  const [activeTab, setActiveTab] = useState<"USER" | "RAIDER">("USER");

  const { data: allAdvertisesLogs, isLoading } =
    useGetAllAdvertisesLogsQuery("");

  const advertiseLogColumns = [
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
            <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-bold border border-amber-200">
              LATEST
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Ad Preview",
      accessor: "adImage",
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-12 rounded bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
            <img
              src={row.adImage}
              alt="ad"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 line-clamp-1">
              {row.adTitle}
            </span>
            <span className="text-[10px] font-bold text-blue-600">
              {row.createFor}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Duration",
      accessor: "startDate",
      render: (row: any) => (
        <div className="text-[11px] text-slate-600">
          <div className="flex gap-1">
            <span className="font-bold">S:</span>{" "}
            {new Date(row.startDate).toLocaleDateString()}
          </div>
          <div className="flex gap-1">
            <span className="font-bold">E:</span>{" "}
            {new Date(row.endDate).toLocaleDateString()}
          </div>
        </div>
      ),
    },
    {
      header: "Changed By",
      accessor: "changedByRole",
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold border border-slate-200">
            {row.changedByUserId}
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
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
            row.status
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-slate-50 text-slate-500 border-slate-200"
          }`}
        >
          {row.status ? "PUBLISHED" : "INACTIVE"}
        </span>
      ),
    },
  ];

  const getTabClasses = (tab: "USER" | "RAIDER") =>
    `px-6 py-2 text-base font-medium rounded-full transition-colors cursor-pointer ${
      activeTab === tab
        ? "bg-yellow-50 text-gray-900 border border-yellow-400 shadow-sm"
        : "text-gray-600 bg-white hover:bg-gray-50 border border-gray-300"
    }`;

  return (
    <div className="bg-gray-50 px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Advertise Management
      </h1>

      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-10 ">
        <span className="rounded-full p-2 md:border border-black flex gap-2 flex-col md:flex-row justify-center">
          <button
            onClick={() => setActiveTab("USER")}
            className={getTabClasses("USER")}
          >
            User
          </button>
          <button
            onClick={() => setActiveTab("RAIDER")}
            className={getTabClasses("RAIDER")}
          >
            Driver
          </button>
        </span>
      </div>

      <AdvertiseManagementTop activeTab={activeTab} />
      <PerformanceTrendsChart activeTab={activeTab} />
      <div className="py-4">
        <CreateNewCampaign activeTab={activeTab} />
      </div>

      <AdvertisementsTable activeTab={activeTab} />

      {activeTab === "USER" &&
        allAdvertisesLogs?.data?.filter(
          (item: { createFor: string }) => item.createFor === "USER",
        ) && (
          <div className="mt-12">
            <DynamicChangeLogTable
              columns={advertiseLogColumns}
              data={
                allAdvertisesLogs?.data?.filter(
                  (item: { createFor: string }) => item.createFor === "USER",
                ) || []
              }
              isLoading={isLoading}
            />
          </div>
        )}

      {activeTab === "RAIDER" &&
        allAdvertisesLogs?.data?.filter(
          (item: { createFor: string }) => item.createFor === "RAIDER",
        ) && (
          <div className="mt-12">
            <DynamicChangeLogTable
              columns={advertiseLogColumns}
              data={
                allAdvertisesLogs?.data?.filter(
                  (item: { createFor: string }) => item.createFor === "RAIDER",
                ) || []
              }
              isLoading={isLoading}
            />
          </div>
        )}
    </div>
  );
}
