/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import toast from "react-hot-toast";
import {
  useAddStandardCommissionRateMutation,
  useDeleteStandardCommissionRateMutation,
  useGetAllStandardCommissionRateLogsQuery,
  useGetStandardCommissionRateQuery,
  useUpdateStandardCommissionRateMutation,
} from "@/redux/features/standardCommissionRate/standardCommissionRateApi";
import {
  useAddRaiderCompensationRoleMutation,
  useDeleteRaiderCompensationRoleMutation,
  useGetRaiderCompensationRoleQuery,
  useUpdateRaiderCompensationRoleMutation,
} from "@/redux/features/raiderCompensationRole/raiderCompensationRoleApi";
import {
  useAddRaiderDeductionFeeMutation,
  useDeleteRaiderDeductionFeeMutation,
  useGetRaiderDeductionFeeQuery,
  useUpdateRaiderDeductionFeeMutation,
} from "@/redux/features/raiderDeductionFee/raiderDeductionFeeApi";
import {
  useAddUserFeeStructureMutation,
  useDeleteUserFeeStructureMutation,
  useGetUserFeeStructureQuery,
  useUpdateUserFeeStructureMutation,
} from "@/redux/features/userFeeStructure/userFeeStructureApi";
import {
  useAddUserDynamicSurgeMutation,
  useDeleteUserDynamicSurgeMutation,
  useGetUserDynamicSurgeQuery,
  useUpdateUserDynamicSurgeMutation,
} from "@/redux/features/userDynamicSurge/userDynamicSurgeApi";
import RaiderTabContent from "./components/RaiderTabContent";
import UserTabContent from "./components/UserTabContent";
import { DynamicChangeLogTable } from "@/components/Shared/DynamicChangeLogTable/DynamicChangeLogTable";

export default function PlatformFeeManagement() {
  const [activeTab, setActiveTab] = useState<"USER" | "RAIDER">("RAIDER");

  // Standard Commission Rate APIs
  const {
    data: standardCommissionRate,
    isLoading: isDataLoading,
    refetch: standardRefetch,
  } = useGetStandardCommissionRateQuery("");
  const [addStandardCommissionRate] = useAddStandardCommissionRateMutation();
  const [updateStandardCommissionRate] =
    useUpdateStandardCommissionRateMutation();
  const [deleteStandardCommissionRate] =
    useDeleteStandardCommissionRateMutation();

  const { data: standardCommissionRateLogs, isLoading } =
    useGetAllStandardCommissionRateLogsQuery("");

  const standardCommissionRateData = standardCommissionRate?.data;

  // Driver Compensation Rules APIs
  const {
    data: raiderCompensationRole,
    isLoading: isRaiderDataLoading,
    refetch: raiderRefetch,
  } = useGetRaiderCompensationRoleQuery("");
  const [addRaiderCompensationRole] = useAddRaiderCompensationRoleMutation();
  const [updateRaiderCompensationRole] =
    useUpdateRaiderCompensationRoleMutation();
  const [deleteRaiderCompensationRole] =
    useDeleteRaiderCompensationRoleMutation();

  const raiderCompensationRoleData = raiderCompensationRole?.data;

  // Deduction Fees APIs
  const {
    data: raiderDeductionFee,
    isLoading: isDeductionDataLoading,
    refetch: deductionRefetch,
  } = useGetRaiderDeductionFeeQuery("");
  const [addRaiderDeductionFee] = useAddRaiderDeductionFeeMutation();
  const [updateRaiderDeductionFee] = useUpdateRaiderDeductionFeeMutation();
  const [deleteRaiderDeductionFee] = useDeleteRaiderDeductionFeeMutation();

  const raiderDeductionFeeData = raiderDeductionFee?.data;

  // User Fee Structure APIs
  const {
    data: userFeeStructure,
    isLoading: isUserFeeStructureLoading,
    refetch: userFeeStructureRefetch,
  } = useGetUserFeeStructureQuery("");
  const [addUserFeeStructure] = useAddUserFeeStructureMutation();
  const [updateUserFeeStructure] = useUpdateUserFeeStructureMutation();
  const [deleteUserFeeStructure] = useDeleteUserFeeStructureMutation();

  const userFeeStructureData = userFeeStructure?.data;

  // Dynamic Surge Pricing APIs
  const {
    data: dynamicSurge,
    isLoading: isDynamicSurgeLoading,
    refetch: dynamicSurgeRefetch,
  } = useGetUserDynamicSurgeQuery("");
  const [addDynamicSurge] = useAddUserDynamicSurgeMutation();
  const [updateDynamicSurge] = useUpdateUserDynamicSurgeMutation();
  const [deleteDynamicSurge] = useDeleteUserDynamicSurgeMutation();

  const dynamicSurgeData = dynamicSurge?.data;

  const getTabClasses = (tab: "USER" | "RAIDER") =>
    `px-6 py-2 text-base font-medium rounded-full transition-colors cursor-pointer ${
      activeTab === tab
        ? "bg-yellow-50 text-gray-900 border border-yellow-400 shadow-sm"
        : "text-gray-600 bg-white hover:bg-gray-50 border border-border"
    }`;

  const feeLogColumns = [
    {
      header: "Date",
      accessor: "created_at",
      render: (row: any, index: number) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-700">
            {new Date(row.created_at).toLocaleDateString("en-GB", {
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
      header: "Log Type & Area",
      accessor: "log_type",
      render: (row: any) => (
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded w-fit mb-1 leading-none uppercase">
            {row.log_type.replace(/_/g, " ")}
          </span>
          <span className="text-sm font-semibold text-slate-900">
            {row.service_area} Area
          </span>
        </div>
      ),
    },
    {
      header: "Snapshot Info",
      accessor: "snapshot",
      render: (row: any) => {
        const s = row.snapshot;
        return (
          <div className="text-[11px] text-slate-600 space-y-0.5">
            <div className="font-bold text-slate-800">
              {s.fee_name || s.deduction_name || s.role_name || "N/A"}
            </div>
            <div>
              {s.amount !== undefined ? `Amt: ${s.amount}` : ""}
              {s.commission_rate_delivery_fee
                ? `Rate: ${s.commission_rate_delivery_fee}%`
                : ""}
            </div>
            {s.applies_to && (
              <div className="italic">Applies: {s.applies_to}</div>
            )}
          </div>
        );
      },
    },
    {
      header: "Changed By",
      accessor: "changed_by_role",
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold border border-slate-200">
            ID:{row.changed_by_id}
          </div>
          <span className="text-xs font-semibold text-slate-500 uppercase">
            {row.changed_by_role}
          </span>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="bg-gray-50 px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Platform Fee Management
        </h1>

        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-10">
          <span className="rounded-full p-2 md:border border-black flex gap-2 flex-col md:flex-row justify-center">
            <button
              onClick={() => setActiveTab("RAIDER")}
              className={getTabClasses("RAIDER")}
              disabled={
                isDataLoading || isRaiderDataLoading || isDeductionDataLoading
              }
            >
              Driver Commission & Deduction
            </button>

            <button
              onClick={() => setActiveTab("USER")}
              className={getTabClasses("USER")}
              disabled={
                isDataLoading ||
                isRaiderDataLoading ||
                isDeductionDataLoading ||
                isUserFeeStructureLoading ||
                isDynamicSurgeLoading
              }
            >
              User Commission & Deduction
            </button>
          </span>
        </div>

        <div className="py-4">
          {activeTab === "RAIDER" ? (
            <div className="space-y-6">
              <RaiderTabContent
                activeTab={activeTab}
                standardCommissionRateData={standardCommissionRateData || []}
                raiderCompensationRoleData={raiderCompensationRoleData || []}
                raiderDeductionFeeData={raiderDeductionFeeData || []}
                onAddCommissionRate={async (data: any) => {
                  try {
                    const response = await addStandardCommissionRate({
                      applicable_user: activeTab,
                      role_name: data.ruleName,
                      commission_rate_delivery_fee: data.percentage,
                      service_area_id: data.serviceAreaId,
                    }).unwrap();
                    if (!response?.success) {
                      toast.error(response?.message || "Failed to add commission rate");
                      return response;
                    }
                    toast.success(response?.message || "Commission rate added successfully");
                    standardRefetch();
                    return response;
                  } catch (error: any) {
                    console.error("Failed to add commission rate:", error);
                    throw error;
                  }
                }}
                onUpdateCommissionRate={async (data: any) => {
                  try {
                    const response = await updateStandardCommissionRate({
                      id: data.id,
                      applicable_user: activeTab,
                      role_name: data.ruleName,
                      commission_rate_delivery_fee: data.percentage,
                      service_area_id: data.serviceAreaId,
                    }).unwrap();
                    if (!response?.success) {
                      toast.error(response?.message || "Failed to update commission rate");
                      return response;
                    }
                    toast.success(response?.message || "Commission rate updated successfully");
                    standardRefetch();
                    return response;
                  } catch (error: any) {
                    console.error("Failed to update commission rate:", error);
                    throw error;
                  }
                }}
                onDeleteCommissionRate={async (id: string | number) => {
                  try {
                    const response =
                      await deleteStandardCommissionRate(id).unwrap();
                    if (!response?.success) {
                      toast.error(response?.message || "Failed to delete commission rate");
                      return response;
                    }
                    toast.success(response?.message || "Commission rate deleted successfully");
                    standardRefetch();
                    return response;
                  } catch (error: any) {
                    console.error("Failed to delete commission rate:", error);
                    throw error;
                  }
                }}
                onAddCompensationRule={async (data: any) => {
                  try {
                    const response = await addRaiderCompensationRole({
                      applicable_user: data.applicableUser,
                      scenario: data.scenario,
                      commission_rate_delivery_fee: data.percentage,
                      service_area_id: data.serviceAreaId,
                    }).unwrap();
                    if (!response?.success) {
                      toast.error(response?.message || "Failed to add compensation rule");
                      return response;
                    }
                    toast.success(response?.message || "Compensation rule added successfully");
                    raiderRefetch();
                    return response;
                  } catch (error: any) {
                    console.error("Failed to add compensation rule:", error);
                    throw error;
                  }
                }}
                onUpdateCompensationRule={async (data: any) => {
                  try {
                    const response = await updateRaiderCompensationRole({
                      id: data.id,
                      applicable_user: data.applicableUser,
                      scenario: data.scenario,
                      commission_rate_delivery_fee: data.percentage,
                      service_area_id: data.serviceAreaId,
                    }).unwrap();
                    if (!response?.success) {
                      toast.error(response?.message || "Failed to update compensation rule");
                      return response;
                    }
                    toast.success(response?.message || "Compensation rule updated successfully");
                    raiderRefetch();
                    return response;
                  } catch (error: any) {
                    console.error("Failed to update compensation rule:", error);
                    throw error;
                  }
                }}
                onDeleteCompensationRule={async (id: string | number) => {
                  try {
                    const response =
                      await deleteRaiderCompensationRole(id).unwrap();
                    if (!response?.success) {
                      toast.error(response?.message || "Failed to delete compensation rule");
                      return response;
                    }
                    toast.success(response?.message || "Compensation rule deleted successfully");
                    raiderRefetch();
                    return response;
                  } catch (error: any) {
                    console.error("Failed to delete compensation rule:", error);
                    throw error;
                  }
                }}
                onAddDeductionFee={async (data: any) => {
                  try {
                    const response = await addRaiderDeductionFee({
                      applicable_user: data.applicableUser,
                      deduction_name: data.deductionName,
                      amount: data.amount,
                      type: data.type,
                    }).unwrap();
                    if (!response?.success) {
                      toast.error(response?.message || "Failed to add deduction fee");
                      return response;
                    }
                    toast.success(response?.message || "Deduction fee added successfully");
                    deductionRefetch();
                    return response;
                  } catch (error: any) {
                    console.error("Failed to add deduction fee:", error);
                    throw error;
                  }
                }}
                onUpdateDeductionFee={async (data: any) => {
                  try {
                    const response = await updateRaiderDeductionFee({
                      id: data.id,
                      applicable_user: data.applicableUser,
                      deduction_name: data.deductionName,
                      amount: data.amount,
                      type: data.type,
                    }).unwrap();
                    if (!response?.success) {
                      toast.error(response?.message || "Failed to update deduction fee");
                      return response;
                    }
                    toast.success(response?.message || "Deduction fee updated successfully");
                    deductionRefetch();
                    return response;
                  } catch (error: any) {
                    console.error("Failed to update deduction fee:", error);
                    throw error;
                  }
                }}
                onDeleteDeductionFee={async (id: string | number) => {
                  try {
                    const response =
                      await deleteRaiderDeductionFee(id).unwrap();
                    if (!response?.success) {
                      toast.error(response?.message || "Failed to delete deduction fee");
                      return response;
                    }
                    toast.success(response?.message || "Deduction fee deleted successfully");
                    deductionRefetch();
                    return response;
                  } catch (error: any) {
                    console.error("Failed to delete deduction fee:", error);
                    throw error;
                  }
                }}
              />
              <DynamicChangeLogTable
                columns={feeLogColumns}
                data={
                  standardCommissionRateLogs?.data?.filter(
                    (item: { applicable_user: string }) =>
                      item.applicable_user === "RAIDER",
                  ) || []
                }
                isLoading={isLoading}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <UserTabContent
                activeTab={activeTab}
                userFeeStructureData={userFeeStructureData || []}
                dynamicSurgeData={dynamicSurgeData || []}
                onAddFeeStructure={async (data: any) => {
                  try {
                    const response =
                      await addUserFeeStructure(data).unwrap();
                    if (!response?.success) {
                      toast.error(response?.message || "Failed to add/update fee structure");
                      return response;
                    }
                    toast.success(response?.message || "Fee structure action successful");
                    userFeeStructureRefetch();
                    return response;
                  } catch (error: any) {
                    console.error("Failed to add fee structure:", error);
                    throw error;
                  }
                }}
                onUpdateFeeStructure={async (data: any) => {
                  try {
                    const response =
                      await updateUserFeeStructure(data).unwrap();
                    if (!response?.success) {
                      toast.error(response?.message || "Failed to add/update fee structure");
                      return response;
                    }
                    toast.success(response?.message || "Fee structure action successful");
                    userFeeStructureRefetch();
                    return response;
                  } catch (error: any) {
                    console.error("Failed to update fee structure:", error);
                    throw error;
                  }
                }}
                onDeleteFeeStructure={async (id: string | number) => {
                  try {
                    const response = await deleteUserFeeStructure(id).unwrap();
                    if (!response?.success) {
                      toast.error(response?.message || "Failed to delete fee structure");
                      return response;
                    }
                    toast.success(response?.message || "Fee structure deleted successfully");
                    userFeeStructureRefetch();
                    return response;
                  } catch (error: any) {
                    console.error("Failed to delete fee structure:", error);
                    throw error;
                  }
                }}
                onAddSurgeRule={async (data: any) => {
                  try {
                    const response = await addDynamicSurge({
                      applicable_user: data.applicableUser,
                      role_name: data.ruleName,
                      price_multiplier: data.priceMultiplier,
                      condition: data.condition,
                      time_range: data.timeRange,
                    }).unwrap();
                    if (!response?.success) {
                      toast.error(response?.message || "Failed to add/update surge rule");
                      return response;
                    }
                    toast.success(response?.message || "Surge rule action successful");
                    dynamicSurgeRefetch();
                    return response;
                  } catch (error: any) {
                    console.error("Failed to add surge rule:", error);
                    throw error;
                  }
                }}
                onUpdateSurgeRule={async (data: any) => {
                  try {
                    const response = await updateDynamicSurge({
                      id: data.id,
                      applicable_user: data.applicableUser,
                      role_name: data.ruleName,
                      price_multiplier: data.priceMultiplier,
                      condition: data.condition,
                      time_range: data.timeRange,
                    }).unwrap();
                    if (!response?.success) {
                      toast.error(response?.message || "Failed to add/update surge rule");
                      return response;
                    }
                    toast.success(response?.message || "Surge rule action successful");
                    dynamicSurgeRefetch();
                    return response;
                  } catch (error: any) {
                    console.error("Failed to update surge rule:", error);
                    throw error;
                  }
                }}
                onDeleteSurgeRule={async (id: string | number) => {
                  try {
                    const response = await deleteDynamicSurge(id).unwrap();
                    if (!response?.success) {
                      toast.error(response?.message || "Failed to delete surge rule");
                      return response;
                    }
                    toast.success(response?.message || "Surge rule deleted successfully");
                    dynamicSurgeRefetch();
                    return response;
                  } catch (error: any) {
                    console.error("Failed to delete surge rule:", error);
                    throw error;
                  }
                }}
              />
              <DynamicChangeLogTable
                columns={feeLogColumns}
                data={
                  standardCommissionRateLogs?.data?.filter(
                    (item: { applicable_user: string }) =>
                      item.applicable_user === "USER",
                  ) || []
                }
                isLoading={isLoading}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
