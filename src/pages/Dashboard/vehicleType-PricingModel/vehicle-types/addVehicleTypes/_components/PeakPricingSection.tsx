import type React from "react";
import { useState, useEffect } from "react";
import { PricingRuleCard } from "./_common/PricingRuleCard";
import {
  useDeleteUserDynamicSurgeMutation,
  useGetUserDynamicSurgeQuery,
  useUpdateUserDynamicSurgeMutation,
  useUpdateUserDynamicSurgeStatusMutation,
} from "@/redux/features/userDynamicSurge/userDynamicSurgeApi";
import toast from "react-hot-toast";
import { UpdateDynamicSurgeModal } from "./_common/UpdateDynamicSurgeModal";
import { PricingRule } from "@/types/dynamicSurgeTypes";

export const PeakPricingSection: React.FC = () => {
  // Fetch all dynamic surge rules
  const { 
    data: userDynamicSurgeResponse, 
    refetch: refetchDynamicSurge,
    isLoading: isLoadingDynamicSurge 
  } = useGetUserDynamicSurgeQuery("");
  
  // API mutations
  const [updateUserDynamicSurge] = useUpdateUserDynamicSurgeMutation();
  const [updateUserDynamicSurgeStatus] = useUpdateUserDynamicSurgeStatusMutation();
  const [deleteUserDynamicSurge] = useDeleteUserDynamicSurgeMutation();

  // State
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [updateModal, setUpdateModal] = useState({
    isOpen: false,
    rule: null as any,
  });

  // Transform API data to local state
  useEffect(() => {
    if (userDynamicSurgeResponse?.data) {
      const apiRules = userDynamicSurgeResponse.data.map((item: any) => ({
        id: item.id.toString(),
        title: item.role_name,
        timeRange: item.time_range,
        charge: `${item.price_multiplier}x Charge`,
        enabled: item.is_active,
        applicable_user: item.applicable_user,
        role_name: item.role_name,
        price_multiplier: item.price_multiplier,
        condition: item.condition,
        time_range: item.time_range,
        status: item.status,
      }));
      setRules(apiRules);
    }
  }, [userDynamicSurgeResponse]);

  const handleToggle = async (id: string) => {
    try {
      const rule = rules.find(r => r.id === id);
      if (!rule) return;

      const newStatus = rule.is_active ? true : false;
      
      const response = await updateUserDynamicSurgeStatus(id).unwrap();
      
      if (response?.success) {
        // Update local state
        setRules(prevRules =>
          prevRules.map(rule =>
            rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
          )
        );
        
        toast.success(`Rule ${newStatus === true ? "enabled" : "disabled"} successfully`);
        refetchDynamicSurge();
      }
    } catch (error: any) {
      console.error("Failed to toggle rule status:", error);
      toast.error(error?.data?.message || "Failed to update rule status");
    }
  };

  const handleEdit = (rule: PricingRule) => {
    setUpdateModal({
      isOpen: true,
      rule: {
        id: rule.id,
        role_name: rule.role_name || rule.title,
        price_multiplier: rule.price_multiplier || 1,
        condition: rule.condition || "",
        time_range: rule.time_range || rule.timeRange || "",
        applicable_user: rule.applicable_user || "RAIDER",
      },
    });
  };

  const handleUpdateRule = async (id: string | number, data: any) => {
    try {
      const response = await updateUserDynamicSurge({
        id,
        ...data,
      }).unwrap();

      if (response?.success) {
        // Update local state
        setRules(prevRules =>
          prevRules.map(rule =>
            rule.id === id.toString()
              ? {
                  ...rule,
                  title: data.role_name,
                  timeRange: data.time_range,
                  charge: `${data.price_multiplier}x Charge`,
                  role_name: data.role_name,
                  price_multiplier: data.price_multiplier,
                  condition: data.condition,
                  time_range: data.time_range,
                  applicable_user: data.applicable_user,
                }
              : rule
          )
        );
        
        refetchDynamicSurge();
        return response;
      }
      return response;
    } catch (error: any) {
      console.error("Failed to update rule:", error);
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this rule? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await deleteUserDynamicSurge(id).unwrap();
      
      if (response?.success) {
        // Update local state
        setRules(prevRules => prevRules.filter(rule => rule.id !== id));
        toast.success("Rule deleted successfully");
        refetchDynamicSurge();
      } else {
        toast.error(response?.message || "Failed to delete rule");
      }
    } catch (error: any) {
      console.error("Failed to delete rule:", error);
      toast.error(error?.data?.message || "Failed to delete rule");
    }
  };

  if (isLoadingDynamicSurge) {
    return (
      <div className="mt-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Peak Pricing & Surcharge Rules
        </h1>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading rules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Peak Pricing & Surcharge Rules
      </h1>

      {rules.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl shadow-lg border border-gray-200">
          <p className="text-gray-500">No dynamic surge rules found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rules.map((rule) => (
            <PricingRuleCard
              key={rule.id}
              rule={rule}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Update Modal */}
      <UpdateDynamicSurgeModal
        isOpen={updateModal.isOpen}
        onClose={() => setUpdateModal({ isOpen: false, rule: null })}
        rule={updateModal.rule}
        onUpdate={handleUpdateRule}
      />
    </div>
  );
};