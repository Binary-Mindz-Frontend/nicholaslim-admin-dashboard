/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import AdvertiseManagementTop from "./components/AddTop";
import PerformanceTrendsChart from "./components/PerformanceTrend";
import CreateNewCampaign from "./components/CreateNewCampaign";
import AdvertisementsTable from "./components/AdvertismentList";
import { AdvertisementLogTable } from "@/components/Shared/DynamicChangeLogTable/AdvertisementLogTable";
import PullToRefresh from "react-simple-pull-to-refresh";
import { useGetAdvertisementsQuery } from "@/redux/features/advertise/advertiseApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";

export default function Advertisement() {
  const [activeTab, setActiveTab] = useState<"USER" | "RAIDER">("USER");
  const [selectedAdId, setSelectedAdId] = useState<string>("ALL");

  const { data: adsResponse } = useGetAdvertisementsQuery(undefined);
  const adsList = adsResponse?.data?.data || adsResponse?.data || [];

  // Filter ads for the current tab
  const tabAds = Array.isArray(adsList)
    ? adsList.filter((ad: any) => ad.create_for === activeTab)
    : [];

  // Find selected ad object to get its title
  const selectedAdObj = tabAds.find(
    (ad: any) => String(ad.id) === String(selectedAdId)
  );
  const selectedAdTitle = selectedAdObj ? selectedAdObj.ad_title : undefined;

  const handleTabChange = (tab: "USER" | "RAIDER") => {
    setActiveTab(tab);
    setSelectedAdId("ALL");
  };

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
  
  const handleRefresh = async () => {
    // উইন্ডো রিলোড করতে চাইলে:
    window.location.reload();

    // অথবা আপনি যদি চান শুধু ডেটা আপডেট হবে (বিনা রিলোডে),
    // তবে এখানে রি-ফেচ লজিক কল করতে পারেন।
    // তবে মেইন পেজে window.location.reload() দেওয়াটাই সবচেয়ে নিরাপদ।
    return Promise.resolve();
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="bg-gray-50 px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Advertise Management
        </h1>

        {/* Controls Bar: Role Tab Navigation & Advertisement Selector */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          {/* Tab Navigation */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-700">Target Role:</span>
            <span className="rounded-full p-1 border border-black flex gap-1 justify-center">
              <button
                onClick={() => handleTabChange("USER")}
                className={getTabClasses("USER")}
              >
                User
              </button>
              <button
                onClick={() => handleTabChange("RAIDER")}
                className={getTabClasses("RAIDER")}
              >
                Driver
              </button>
            </span>
          </div>

          {/* Advertisement Filter Dropdown */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
              <Filter className="w-4 h-4 text-amber-500" />
              <span>Select Advertisement:</span>
            </div>
            <Select
              value={selectedAdId}
              onValueChange={(val) => setSelectedAdId(val)}
            >
              <SelectTrigger className="w-64 md:w-80 bg-white border-gray-300">
                <SelectValue placeholder="All Advertisements" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">
                  All Advertisements (Aggregate)
                </SelectItem>
                {tabAds.map((ad: any) => (
                  <SelectItem key={ad.id} value={String(ad.id)}>
                    #{ad.id} - {ad.ad_title} {ad.status ? "(Active)" : "(Inactive)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedAdId !== "ALL" && (
              <button
                onClick={() => setSelectedAdId("ALL")}
                className="text-xs text-blue-600 hover:text-blue-800 underline font-medium cursor-pointer ml-1"
              >
                Reset to All
              </button>
            )}
          </div>
        </div>

        <AdvertiseManagementTop
          activeTab={activeTab}
          selectedAdId={selectedAdId}
          selectedAdTitle={selectedAdTitle}
        />
        <PerformanceTrendsChart
          activeTab={activeTab}
          selectedAdId={selectedAdId}
          selectedAdTitle={selectedAdTitle}
        />
        <div className="py-4">
          <CreateNewCampaign activeTab={activeTab} />
        </div>

        <AdvertisementsTable
          activeTab={activeTab}
          selectedAdId={selectedAdId}
          onSelectAd={(id: string) => setSelectedAdId(id)}
        />

        <div className="mt-12">
          <AdvertisementLogTable
            columns={advertiseLogColumns}
            createFor={activeTab}
          />
        </div>
      </div>
    </PullToRefresh>
  );
}
