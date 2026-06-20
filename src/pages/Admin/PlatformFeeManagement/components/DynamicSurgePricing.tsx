/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/Shared/LoadingSpinner/LoadingSpinner";
import DeleteConfirmationModal from "@/components/Shared/DeleteConfirmationModal/DeleteConfirmationModal";
import { useGetServiceZonesQuery } from "@/redux/features/serviceZone/serviceZoneApi";
import SelectReact from "react-select";

interface SurgeRule {
  id?: number;
  ruleName: string;
  priceMultiplier: number;
  displayMultiplier: string;
  condition: string;
  timeRange: string;
  applicableUser: "USER" | "RAIDER";
  serviceAreaIds: (string | number)[];
}

interface DynamicSurgePricingProps {
  surgeRulesData: any[];
  applicableUser: "USER" | "RAIDER";
  onAddSurgeRule: (data: {
    ruleName: string;
    priceMultiplier: number;
    condition: string;
    timeRange: string;
    applicableUser: "USER" | "RAIDER";
    serviceAreaIds: (string | number)[];
  }) => Promise<void>;
  onUpdateSurgeRule: (data: {
    id: number;
    ruleName: string;
    priceMultiplier: number;
    condition: string;
    timeRange: string;
    applicableUser: "USER" | "RAIDER";
    serviceAreaIds: (string | number)[];
  }) => Promise<any>;
  onDeleteSurgeRule: (id: number) => Promise<any>;
}

export default function DynamicSurgePricing({
  surgeRulesData,
  applicableUser,
  onAddSurgeRule,
  onUpdateSurgeRule,
  onDeleteSurgeRule,
}: DynamicSurgePricingProps) {
  const [rules, setRules] = useState<SurgeRule[]>([]);
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

  // Function to parse multiplier string to number
  const parseMultiplierToNumber = (multiplierStr: string): number => {
    if (!multiplierStr) return 0;
    
    // Remove any 'x' and trim whitespace
    const cleaned = multiplierStr.replace(/x/gi, '').trim();
    
    // Convert to number
    const num = parseFloat(cleaned);
    
    // Return 0 if not a valid number
    return isNaN(num) ? 0 : num;
  };

  // Function to format number for display with 'x' suffix
  const formatMultiplierForDisplay = (multiplier: number | string): string => {
    const num = typeof multiplier === 'string' ? parseFloat(multiplier) : multiplier;
    return isNaN(num) ? "" : `${num}x`;
  };

  const { data: serviceZonesData } = useGetServiceZonesQuery({});
  const serviceZones = serviceZonesData?.data?.data?.data || [];

  const getServiceAreaIds = (item: any) => {
    if (Array.isArray(item.serviceAreas)) {
      if (item.serviceAreas.length === 0) {
        return ["ALL"];
      }
      return item.serviceAreas.map((sa: any) => Number(sa.service_area_id || sa.serviceArea?.id || sa.id));
    }
    if (Array.isArray(item.service_area_ids) && item.service_area_ids.length > 0) {
      return item.service_area_ids.map(Number);
    }
    if (item.service_area_id) {
      return [Number(item.service_area_id)];
    }
    if (Array.isArray(item.service_areas) && item.service_areas.length > 0) {
      return item.service_areas.map((a: any) => Number(a.id || a.service_area_id || a));
    }
    if (Array.isArray(item.serviceZones) && item.serviceZones.length > 0) {
      return item.serviceZones.map((z: any) => Number(z.id || z.serviceZoneId || z));
    }
    return ["ALL"];
  };

  // Transform API data to match component state
  useEffect(() => {
    if (surgeRulesData && Array.isArray(surgeRulesData)) {
      setIsDataLoading(true);
      const filteredRules = surgeRulesData
        .filter((rule) => rule.applicable_user === applicableUser)
        .map((rule) => ({
          id: rule.id,
          ruleName: rule.role_name,
          priceMultiplier: rule.price_multiplier,
          displayMultiplier: formatMultiplierForDisplay(rule.price_multiplier),
          condition: rule.condition,
          timeRange: rule.time_range,
          applicableUser: rule.applicable_user,
          serviceAreaIds: getServiceAreaIds(rule),
        }));

      setRules(filteredRules);
      setIsDataLoading(false);
    }
  }, [surgeRulesData, applicableUser]);

  const handleAddRule = () => {
    setRules([
      ...rules,
      { 
        ruleName: "", 
        priceMultiplier: 0,
        displayMultiplier: "",
        condition: "HIGH_DEMAND", 
        timeRange: "", 
        applicableUser: applicableUser,
        serviceAreaIds: ["ALL"],
      },
    ]);
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
      // If no ID, just remove from UI
      const newRules = rules.filter((_, i) => i !== index);
      setRules(newRules);
      toast.success("Rule removed");
    }
  };

  const handleDeleteRule = async () => {
    if (deleteModal.ruleId === undefined || deleteModal.ruleIndex === undefined) {
      toast.error("Invalid rule data");
      return;
    }

    setIsLoading(true);
    try {
      const response = await onDeleteSurgeRule(deleteModal.ruleId);
      
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
    field: keyof SurgeRule,
    value: string | number | any
  ) => {
    const newRules = [...rules];
    
    if (field === "priceMultiplier") {
      const numValue = typeof value === 'string' ? parseMultiplierToNumber(value) : value;
      newRules[index] = { 
        ...newRules[index], 
        priceMultiplier: numValue,
        displayMultiplier: typeof value === 'string' ? value : formatMultiplierForDisplay(value)
      };
    } else if (field === "serviceAreaIds") {
      newRules[index] = { ...newRules[index], [field]: value };
    } else {
      newRules[index] = { ...newRules[index], [field]: value as any };
    }
    
    setRules(newRules);
  };

  const zoneOptions = [
    { value: "ALL", label: "All Service Areas" },
    ...serviceZones.map((zone: any) => ({
      value: zone.id,
      label: zone.name,
    })),
  ];

  const getSelectValue = (ruleServiceAreaIds: (string | number)[]) => {
    if (!ruleServiceAreaIds || ruleServiceAreaIds.length === 0 || ruleServiceAreaIds.includes("ALL")) {
      return [{ value: "ALL", label: "All Service Areas" }];
    }
    return ruleServiceAreaIds.map((id) => {
      const zone = serviceZones.find((z: any) => z.id === id);
      return {
        value: id,
        label: zone ? zone.name : `Area ${id}`,
      };
    });
  };

  const handleZoneChange = (index: number, selectedOptions: any) => {
    let values = selectedOptions ? selectedOptions.map((opt: any) => opt.value) : [];
    
    if (values.includes("ALL") && values.length > 1) {
      const hadAll = (rules[index].serviceAreaIds || []).includes("ALL");
      if (!hadAll) {
        values = ["ALL"];
      } else {
        values = values.filter((val: any) => val !== "ALL");
      }
    }
    
    if (values.length === 0) {
      values = ["ALL"];
    }

    handleRuleChange(index, "serviceAreaIds", values);
  };

  const handleDisplayMultiplierChange = (index: number, value: string) => {
    const newRules = [...rules];
    
    // Validate input (allow numbers, decimals, optional 'x')
    const isValid = /^\d*(\.\d+)?x?$/i.test(value);
    
    if (isValid || value === "") {
      newRules[index] = { 
        ...newRules[index], 
        displayMultiplier: value,
        priceMultiplier: parseMultiplierToNumber(value)
      };
      setRules(newRules);
    }
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

      // Save new rules (without ID)
      for (const rule of newRules) {
        if (rule.ruleName.trim() && rule.priceMultiplier > 0 && rule.condition.trim() && rule.timeRange.trim()) {
          try {
            await onAddSurgeRule({
              ruleName: rule.ruleName,
              priceMultiplier: rule.priceMultiplier,
              condition: rule.condition,
              timeRange: rule.timeRange,
              applicableUser: rule.applicableUser,
              serviceAreaIds: rule.serviceAreaIds,
            });
            newSuccessCount++;
          } catch (error) {
            newErrorCount++;
            console.error("Failed to save new rule:", error);
          }
        }
      }

      // Update existing rules (with ID)
      for (const rule of existingRules) {
        if (rule.id && rule.ruleName.trim() && rule.priceMultiplier > 0 && rule.condition.trim() && rule.timeRange.trim()) {
          try {
            await onUpdateSurgeRule({
              id: rule.id,
              ruleName: rule.ruleName,
              priceMultiplier: rule.priceMultiplier,
              condition: rule.condition,
              timeRange: rule.timeRange,
              applicableUser: rule.applicableUser,
              serviceAreaIds: rule.serviceAreaIds,
            });
            updateSuccessCount++;
          } catch (error) {
            updateErrorCount++;
            console.error("Failed to update rule:", error);
          }
        }
      }

      // Show success/error messages
      const messages = [];
      if (newSuccessCount > 0) messages.push(`${newSuccessCount} new rule(s) created`);
      if (updateSuccessCount > 0) messages.push(`${updateSuccessCount} rule(s) updated`);
      if (newErrorCount > 0) messages.push(`Failed to create ${newErrorCount} rule(s)`);
      if (updateErrorCount > 0) messages.push(`Failed to update ${updateErrorCount} rule(s)`);

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
      toast.error("Failed to save surge pricing rules. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses =
    "w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-100 disabled:cursor-not-allowed";

  const selectClasses =
    "w-full px-4 py-3 border border-gray-300 rounded-lg text-base appearance-none bg-white focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-100 disabled:cursor-not-allowed";

  if (isDataLoading) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-gray-200">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-200">
        <div className="flex md:justify-between items-center mb-6 flex-col md:flex-row justify-center gap-4 md:gap-0 text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-900">
            Dynamic Surge Pricing
          </h2>
          <button
            onClick={handleAddRule}
            type="button"
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            Add Surge Rule
          </button>
        </div>

        <form onSubmit={handleSaveAll} className="space-y-4">
          {/* Header Row */}
          <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_1fr_1.2fr_40px] gap-4 mb-2 text-sm font-semibold text-gray-600">
            <div>Rule Name</div>
            <div>Price Multiplier</div>
            <div>Condition</div>
            <div>Time Range</div>
            <div>Service Area</div>
            <div className="w-10"></div>
          </div>

          {/* Dynamic Rules Rows */}
          {rules.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No surge pricing rules found. Click "Add Surge Rule" to create one.
            </div>
          ) : (
            rules.map((rule, index) => (
              <div
                key={rule.id || `new-${index}`}
                className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr_1.2fr_40px] gap-4 items-center"
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
                  type="text"
                  value={rule.displayMultiplier || ""}
                  onChange={(e) => handleDisplayMultiplierChange(index, e.target.value)}
                  placeholder="Price Multiplier (e.g., 1.5x, 2x)"
                  className={inputClasses}
                  required
                  disabled={isLoading}
                  pattern="^\d+(\.\d+)?x?$"
                  title="Enter a valid multiplier (e.g., 1.5x, 2x)"
                />
                <select
                  value={rule.condition}
                  onChange={(e) =>
                    handleRuleChange(index, "condition", e.target.value)
                  }
                  className={selectClasses}
                  disabled={isLoading}
                >
                  <option value="HIGH_DEMAND">High Demand</option>
                  <option value="VERY_HIGH_DEMAND">Very High Demand</option>
                  <option value="WEEKEND">Weekend</option>
                  {/* <option value="BAD_WEATHER">Bad Weather</option> */}
                </select>
                <input
                  type="text"
                  value={rule.timeRange}
                  onChange={(e) =>
                    handleRuleChange(index, "timeRange", e.target.value)
                  }
                  placeholder="Time Range (e.g., 11:30-1:30 PM)"
                  className={inputClasses}
                  required
                  disabled={isLoading}
                />
                <SelectReact
                  isMulti
                  options={zoneOptions}
                  value={getSelectValue(rule.serviceAreaIds)}
                  onChange={(selected) => handleZoneChange(index, selected)}
                  className="w-full text-sm"
                  isDisabled={isLoading}
                  placeholder="Select Service Areas"
                />
                
                {/* Delete Button Only */}
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
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
        title="Delete Surge Rule"
        description={`Are you sure you want to delete "${deleteModal.ruleName}"? This action cannot be undone.`}
        isLoading={isLoading}
      />
    </>
  );
}