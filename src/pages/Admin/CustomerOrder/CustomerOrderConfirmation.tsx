/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useGetCustomeOrderConfirmationLogsQuery,
  useGetCustomerOrderConfirmationQuery,
  useGetCustomerOrderConfirmationStatusQuery,
  useUpdateCustomerOrderConfirmationMutation,
} from "@/redux/features/customerOrderConfirmation/customerOrderConfirmationApi";
import { ConfirmationRatioChart } from "./components/ConfirmationRatioChart";
import { ConfirmationRules } from "./components/ConfirmationRules";
import { OverviewCards } from "./components/OverviewCards";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import SimpleChangeLogTable from "@/components/Shared/DynamicChangeLogTable/SimpleChangeLogTable";

interface LocalSettings {
  is_new_customer_weight: number;
  completed_orders_weight: number;
  followers_weight: number;
}

export default function CustomerOrderConfirmation() {
  const [localSettings, setLocalSettings] = useState<LocalSettings>({
    is_new_customer_weight: 0,
    completed_orders_weight: 0,
    followers_weight: 0,
  });

  const {
    data: configData,
    isLoading: configLoading,
    refetch: refetchConfig,
  } = useGetCustomerOrderConfirmationQuery("");

  const { data: statusData, isLoading: statusLoading } =
    useGetCustomerOrderConfirmationStatusQuery("");

  const [updateConfig, { isLoading: updateLoading }] =
    useUpdateCustomerOrderConfirmationMutation();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const { data: logApiResponse, isLoading: isLogsLoading } =
    useGetCustomeOrderConfirmationLogsQuery({
      page,
      limit,
      search: search || undefined,
    });

  const logs = logApiResponse?.data?.data || [];
  const meta = logApiResponse?.data?.meta || {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  useEffect(() => {
    if (configData?.data) {
      const config = configData.data[0];
      setLocalSettings({
        is_new_customer_weight: config.is_new_customer_weight,
        completed_orders_weight: config.completed_orders_weight,
        followers_weight: config.followers_weight,
      });
    }
  }, [configData]);

  const handleSaveSettings = async () => {
    // if (!configData?.data[0]?.id) {
    //   toast.error("Configuration not found");
    //   return;
    // }

    try {
      await updateConfig({
        id: configData.data[0].id,
        data: localSettings,
      }).unwrap();

      await refetchConfig();
      toast.success("Settings updated successfully!");
    } catch (error: any) {
      console.error("Failed to update settings:", error);
      toast.error(error?.data?.message || "Failed to update settings");
    }
  };

  const handleSettingChange = (key: keyof LocalSettings, value: number) => {
    setLocalSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Convert keys for the ConfirmationRules component
  const getComponentSettings = () => ({
    newCustomer: localSettings.is_new_customer_weight,
    completedOrders: localSettings.completed_orders_weight,
    followerWeight: localSettings.followers_weight,
  });

  // Handle setting changes from ConfirmationRules component
  const handleComponentSettingChange = (
    key: "newCustomer" | "completedOrders" | "followerWeight",
    value: number,
  ) => {
    const keyMap = {
      newCustomer: "is_new_customer_weight",
      completedOrders: "completed_orders_weight",
      followerWeight: "followers_weight",
    } as const;

    handleSettingChange(keyMap[key], value);
  };

  const logColumns = [
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
          {index === 0 && (
            <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-bold border border-amber-200">
              LATEST
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Configuration Changes",
      render: (row: any) => (
        <div className="flex flex-col gap-1 min-w-[250px]">
          <div className="flex gap-2">
            <span className="bg-blue-50 text-blue-700 text-[10px] px-1.5 py-0.5 rounded border border-blue-100">
              NC: {row.isNewCustomerWeight}%
            </span>
            <span className="bg-green-50 text-green-700 text-[10px] px-1.5 py-0.5 rounded border border-green-100">
              CO: {row.completedOrdersWeight}%
            </span>
            <span className="bg-purple-50 text-purple-700 text-[10px] px-1.5 py-0.5 rounded border border-purple-100">
              FW: {row.followersWeight}%
            </span>
          </div>
          <p className="text-sm text-slate-600">
            Weights updated for Order Confirmation Rules
          </p>
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
              User ID: {row.changedByUserId}
            </span>
            <span className="text-[10px] text-slate-500 font-bold uppercase leading-none">
              {row.changedByRole}
            </span>
          </div>
        </div>
      ),
    },
  ];

  if (configLoading || statusLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 p-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Customer Order Confirmation
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Overview of how orders are automatically confirmed based on customer
            trust level.
          </p>
        </div>
        <OverviewCards
          metrics={{
            is_new_customer_weight: localSettings.is_new_customer_weight,
            completedOrders: localSettings.completed_orders_weight,
            followerWeight: localSettings.followers_weight,
            autoConfirmed: statusData?.data?.auto_confirmation_count,
          }}
        />
        <ConfirmationRules
          settings={getComponentSettings()}
          onSettingChange={handleComponentSettingChange}
          onSave={handleSaveSettings}
          isLoading={updateLoading}
        />
        <ConfirmationRatioChart
          data={
            statusData?.data || {
              geniune_count: 0,
              manual_check_count: 0,
              suspicious_count: 0,
            }
          }
        />
        <SimpleChangeLogTable
          logs={logs}
          columns={logColumns}
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
    </div>
  );
}
