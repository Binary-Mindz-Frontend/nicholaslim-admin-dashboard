import { useState, useEffect } from "react";
import {
  useAddStandardCommissionRateMutation,
  useDeleteStandardCommissionRateMutation,
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
  useUpdateUserFeeStructureMutation 
} from "@/redux/features/userFeeStructure/userFeeStructureApi";
import { 
  useAddUserDynamicSurgeMutation, 
  useDeleteUserDynamicSurgeMutation, 
  useGetUserDynamicSurgeQuery, 
  useUpdateUserDynamicSurgeMutation 
} from "@/redux/features/userDynamicSurge/userDynamicSurgeApi";
import RaiderTabContent from "./components/RaiderTabContent";
import UserTabContent from "./components/UserTabContent";

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
    refetch: deductionRefetch 
  } = useGetRaiderDeductionFeeQuery("");
  const [addRaiderDeductionFee] = useAddRaiderDeductionFeeMutation();
  const [updateRaiderDeductionFee] = useUpdateRaiderDeductionFeeMutation();
  const [deleteRaiderDeductionFee] = useDeleteRaiderDeductionFeeMutation();

  const raiderDeductionFeeData = raiderDeductionFee?.data;

  // User Fee Structure APIs
  const { 
    data: userFeeStructure, 
    isLoading: isUserFeeStructureLoading, 
    refetch: userFeeStructureRefetch 
  } = useGetUserFeeStructureQuery("");
  const [addUserFeeStructure] = useAddUserFeeStructureMutation();
  const [updateUserFeeStructure] = useUpdateUserFeeStructureMutation();
  const [deleteUserFeeStructure] = useDeleteUserFeeStructureMutation();

  const userFeeStructureData = userFeeStructure?.data;

  // Dynamic Surge Pricing APIs
  const { 
    data: dynamicSurge, 
    isLoading: isDynamicSurgeLoading, 
    refetch: dynamicSurgeRefetch 
  } = useGetUserDynamicSurgeQuery("");
  const [addDynamicSurge] = useAddUserDynamicSurgeMutation();
  const [updateDynamicSurge] = useUpdateUserDynamicSurgeMutation();
  const [deleteDynamicSurge] = useDeleteUserDynamicSurgeMutation();

  const dynamicSurgeData = dynamicSurge?.data;

  useEffect(() => {
    standardRefetch();
    raiderRefetch();
    deductionRefetch();
    userFeeStructureRefetch();
    dynamicSurgeRefetch();
  }, [activeTab, standardRefetch, raiderRefetch, deductionRefetch, userFeeStructureRefetch, dynamicSurgeRefetch]);

  const getTabClasses = (tab: "USER" | "RAIDER") =>
    `px-6 py-2 text-base font-medium rounded-full transition-colors cursor-pointer ${
      activeTab === tab
        ? "bg-yellow-50 text-gray-900 border border-yellow-400 shadow-sm"
        : "text-gray-600 bg-white hover:bg-gray-50 border border-border"
    }`;

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
              disabled={isDataLoading || isRaiderDataLoading || isDeductionDataLoading}
            >
              Driver Commission & Deduction
            </button>

            <button
              onClick={() => setActiveTab("USER")}
              className={getTabClasses("USER")}
              disabled={isDataLoading || isRaiderDataLoading || isDeductionDataLoading || isUserFeeStructureLoading || isDynamicSurgeLoading}
            >
              User Commission & Deduction
            </button>
          </span>
        </div>

        <div className="py-4">
          {activeTab === "RAIDER" ? (
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
                    service_area: data.serviceArea,
                  }).unwrap();
                  if (response?.success) standardRefetch();
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
                    service_area: data.serviceArea,
                  }).unwrap();
                  if (response?.success) standardRefetch();
                  return response;
                } catch (error: any) {
                  console.error("Failed to update commission rate:", error);
                  throw error;
                }
              }}
              onDeleteCommissionRate={async (id: string | number) => {
                try {
                  const response = await deleteStandardCommissionRate(id).unwrap();
                  if (response?.success) standardRefetch();
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
                    service_area: data.serviceArea,
                  }).unwrap();
                  if (response?.success) raiderRefetch();
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
                    service_area: data.serviceArea,
                  }).unwrap();
                  if (response?.success) raiderRefetch();
                  return response;
                } catch (error: any) {
                  console.error("Failed to update compensation rule:", error);
                  throw error;
                }
              }}
              onDeleteCompensationRule={async (id: string | number) => {
                try {
                  const response = await deleteRaiderCompensationRole(id).unwrap();
                  if (response?.success) raiderRefetch();
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
                  if (response?.success) deductionRefetch();
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
                  if (response?.success) deductionRefetch();
                  return response;
                } catch (error: any) {
                  console.error("Failed to update deduction fee:", error);
                  throw error;
                }
              }}
              onDeleteDeductionFee={async (id: string | number) => {
                try {
                  const response = await deleteRaiderDeductionFee(id).unwrap();
                  if (response?.success) deductionRefetch();
                  return response;
                } catch (error: any) {
                  console.error("Failed to delete deduction fee:", error);
                  throw error;
                }
              }}
            />
          ) : (
            <UserTabContent
              activeTab={activeTab}
              userFeeStructureData={userFeeStructureData || []}
              dynamicSurgeData={dynamicSurgeData || []}
              onAddFeeStructure={async (data: any) => {
                try {
                  const response = await addUserFeeStructure({
                    applicable_user: data.applicableUser,
                    fee_name: data.feeName,
                    amount: data.amount,
                    service_area: data.serviceArea,
                    applies_to: data.appliesTo,
                  }).unwrap();
                  if (response?.success) userFeeStructureRefetch();
                  return response;
                } catch (error: any) {
                  console.error("Failed to add fee structure:", error);
                  throw error;
                }
              }}
              onUpdateFeeStructure={async (data: any) => {
                try {
                  const response = await updateUserFeeStructure({
                    id: data.id,
                    applicable_user: data.applicableUser,
                    fee_name: data.feeName,
                    amount: data.amount,
                    service_area: data.serviceArea,
                    applies_to: data.appliesTo,
                  }).unwrap();
                  if (response?.success) userFeeStructureRefetch();
                  return response;
                } catch (error: any) {
                  console.error("Failed to update fee structure:", error);
                  throw error;
                }
              }}
              onDeleteFeeStructure={async (id: string | number) => {
                try {
                  const response = await deleteUserFeeStructure(id).unwrap();
                  if (response?.success) userFeeStructureRefetch();
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
                  if (response?.success) dynamicSurgeRefetch();
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
                  if (response?.success) dynamicSurgeRefetch();
                  return response;
                } catch (error: any) {
                  console.error("Failed to update surge rule:", error);
                  throw error;
                }
              }}
              onDeleteSurgeRule={async (id: string | number) => {
                try {
                  const response = await deleteDynamicSurge(id).unwrap();
                  if (response?.success) dynamicSurgeRefetch();
                  return response;
                } catch (error: any) {
                  console.error("Failed to delete surge rule:", error);
                  throw error;
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}