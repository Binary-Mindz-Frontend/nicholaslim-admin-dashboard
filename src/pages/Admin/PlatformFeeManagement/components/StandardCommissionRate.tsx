/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/Shared/LoadingSpinner/LoadingSpinner";
import DeleteConfirmationModal from "@/components/Shared/DeleteConfirmationModal/DeleteConfirmationModal";
import {
  CommissionRule,
  StandardCommissionRateProps,
} from "@/types/standardCommissionRateType";
import { useGetServiceZonesQuery } from "@/redux/features/serviceZone/serviceZoneApi";

export default function StandardCommissionRate({
  standardCommissionRateData,
  applicableUser,
  onAddCommissionRate,
  onUpdateCommissionRate,
  onDeleteCommissionRate,
}: StandardCommissionRateProps) {
  const [rules, setRules] = useState<CommissionRule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    ruleId?: number;
    ruleIndex?: number;
    ruleName: string;
  }>({
    isOpen: false,
    ruleId: undefined,
    ruleIndex: undefined,
    ruleName: "",
  });

  const { data: serviceZonesData } = useGetServiceZonesQuery({});
  const serviceZones = serviceZonesData?.data?.data?.data || [];

  useEffect(() => {
    if (standardCommissionRateData) {
      setIsDataLoading(true);
      const filteredRules = standardCommissionRateData
        .filter((rate) => rate.applicable_user === applicableUser)
        .map((rate) => ({
          id: rate.id,
          ruleName: rate.role_name,
          percentage: rate.commission_rate_delivery_fee,
          serviceAreaId: rate.service_area_id,
        }));

      setRules(filteredRules);
      setIsDataLoading(false);
    }
  }, [standardCommissionRateData, applicableUser]);

  const handleAddRule = () => {
    setRules([...rules, { ruleName: "", percentage: 0, serviceAreaId: null }]);
  };

  const openDeleteModal = (index: number) => {
    const rule = rules[index];
    if (rule.id) {
      setDeleteModal({
        isOpen: true,
        ruleId: rule.id,
        ruleIndex: index,
        ruleName: rule.ruleName || "Unnamed Rule",
      });
    } else {
      const newRules = rules.filter((_, i) => i !== index);
      setRules(newRules);
      toast.success("Rule removed");
    }
  };

  const handleDeleteRule = async () => {
    if (
      deleteModal.ruleId === undefined ||
      deleteModal.ruleIndex === undefined
    ) {
      toast.error("Invalid rule data");
      return;
    }

    setIsLoading(true);
    try {
      const response = await onDeleteCommissionRate(deleteModal.ruleId);

      if (response?.success) {
        // toast.success(response.message || "Rule deleted successfully");
        const newRules = rules.filter((_, i) => i !== deleteModal.ruleIndex);
        setRules(newRules);
      } else {
        // toast.error(response?.message || "Failed to delete rule");
      }
    } catch (error: any) {
      console.error("Failed to delete rule:", error);
      // toast.error(error?.data?.message || "Failed to delete rule");
    } finally {
      setDeleteModal({
        isOpen: false,
        ruleId: undefined,
        ruleIndex: undefined,
        ruleName: "",
      });
      setIsLoading(false);
    }
  };

  const handleRuleChange = (
    index: number,
    field: keyof CommissionRule,
    value: string | number | null,
  ) => {
    const newRules = [...rules];

    if (field === "percentage") {
      const numValue = typeof value === "string" ? parseFloat(value) : value as number;
      newRules[index] = {
        ...newRules[index],
        [field]: isNaN(numValue as number) ? 0 : numValue,
      };
    } else if (field === "serviceAreaId") {
      newRules[index] = { ...newRules[index], [field]: Number(value) }; ;
    } else {
      newRules[index] = { ...newRules[index], [field]: value };
    }

    setRules(newRules);
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newRules = rules.filter((rule) => !rule.id);
      const existingRules = rules.filter((rule) => rule.id);

      let newSuccessCount = 0;
      let newErrorCount = 0;
      let updateSuccessCount = 0;
      let updateErrorCount = 0;

      for (const rule of newRules) {
        if (rule.ruleName.trim() && rule.percentage > 0 && rule.serviceAreaId) {
          try {
            await onAddCommissionRate({
              ruleName: rule.ruleName,
              percentage: rule.percentage,
              serviceAreaId: rule.serviceAreaId,
            });
            newSuccessCount++;
          } catch (error) {
            newErrorCount++;
            console.error("Failed to save new rule:", error);
          }
        }
      }

      for (const rule of existingRules) {
        if (
          rule.id &&
          rule.ruleName.trim() &&
          rule.percentage > 0 &&
          rule.serviceAreaId
        ) {
          try {
            await onUpdateCommissionRate({
              id: rule.id,
              ruleName: rule.ruleName,
              percentage: rule.percentage,
              serviceAreaId: rule.serviceAreaId,
            });
            updateSuccessCount++;
          } catch (error) {
            updateErrorCount++;
            console.error("Failed to update rule:", error);
          }
        }
      }

      const messages = [];
      if (newSuccessCount > 0)
        messages.push(`${newSuccessCount} new rule(s) created`);
      if (updateSuccessCount > 0)
        messages.push(`${updateSuccessCount} rule(s) updated`);
      if (newErrorCount > 0)
        messages.push(`Failed to create ${newErrorCount} rule(s)`);
      if (updateErrorCount > 0)
        messages.push(`Failed to update ${updateErrorCount} rule(s)`);

      if (messages.length > 0) {
        // const summary = messages.join(", ");
        if (newSuccessCount > 0 || updateSuccessCount > 0) {
          // toast.success(summary);
        } else {
          // toast.error(summary);
        }
      }
    } catch (error) {
      console.error("Failed to save rules:", error);
      // toast.error("Failed to save commission rates. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses =
    "w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-100 disabled:cursor-not-allowed";

  const numberInputClasses = `${inputClasses} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`;

  const selectClasses =
    "w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white";

  if (isDataLoading) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-gray-200">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-gray-200">
        <div className="flex md:justify-between items-center mb-6 flex-col md:flex-row justify-center gap-4 md:gap-0 text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-900">
            Standard Commission Rate
          </h2>
          <button
            onClick={handleAddRule}
            type="button"
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            Add Rate
          </button>
        </div>

        <form onSubmit={handleSaveAll} className="space-y-4">
          <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_40px] gap-4 mb-2 text-sm font-semibold text-gray-600">
            <div>Rule Name</div>
            <div>Percentage of Delivery Fee</div>
            <div>Service Area</div>
            <div className="w-10"></div>
          </div>

          {rules.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No commission rules found. Click "Add Rate" to create one.
            </div>
          ) : (
            rules.map((rule, index) => (
              <div
                key={rule.id || `new-${index}`}
                className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_40px] gap-4 items-center"
              >
                <input
                  type="text"
                  value={rule.ruleName}
                  onChange={(e) =>
                    handleRuleChange(index, "ruleName", e.target.value)
                  }
                  placeholder="Rule Name"
                  className={inputClasses}
                  required
                  disabled={isLoading}
                />
                <input
                  type="number"
                  value={rule.percentage || ""}
                  onChange={(e) =>
                    handleRuleChange(index, "percentage", e.target.value)
                  }
                  placeholder="Percentage (e.g., 15)"
                  className={numberInputClasses}
                  required
                  disabled={isLoading}
                  min="0"
                  max="100"
                  step="0.01"
                />
                <select
                  value={rule.serviceAreaId || ""}
                  onChange={(e) =>
                    handleRuleChange(
                      index,
                      "serviceAreaId",
                      e.target.value ? Number(e.target.value) : null,
                    )
                  }
                  className={selectClasses}
                  required
                  disabled={isLoading}
                >
                  <option value="">Select Service Area</option>
                  {serviceZones.map((zone: any) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => openDeleteModal(index)}
                  className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Remove rule"
                  disabled={isLoading}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          )}

          {rules.length > 0 && (
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-12 rounded-xl text-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || rules.length === 0}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          )}
        </form>
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={handleDeleteRule}
        title="Delete Commission Rule"
        description={`Are you sure you want to delete "${deleteModal.ruleName}"? This action cannot be undone.`}
        isLoading={isLoading}
      />
    </>
  );
}
