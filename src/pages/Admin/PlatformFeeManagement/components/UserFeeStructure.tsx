/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/Shared/LoadingSpinner/LoadingSpinner";
import DeleteConfirmationModal from "@/components/Shared/DeleteConfirmationModal/DeleteConfirmationModal";
import {
  FeeStructure,
  UserFeeStructureProps,
} from "@/types/userFeeStructureType";
import { useGetServiceZonesQuery } from "@/redux/features/serviceZone/serviceZoneApi";
import SelectReact from "react-select";

// No longer using fixed order types

export default function UserFeeStructure({
  feeStructureData,
  applicableUser,
  onAddFeeStructure,
  onUpdateFeeStructure,
  onDeleteFeeStructure,
}: UserFeeStructureProps) {
  const [fees, setFees] = useState<FeeStructure[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    feeId?: number;
    feeIndex?: number;
    feeName: string;
  }>({
    isOpen: false,
    feeId: undefined,
    feeIndex: undefined,
    feeName: "",
  });

  const { data: serviceZonesData } = useGetServiceZonesQuery({});
  const serviceZones = serviceZonesData?.data?.data?.data || [];

  // Function to parse amount string to number
  const parseAmountToNumber = (amountStr: string): number => {
    if (!amountStr) return 0;
    const cleaned = amountStr.replace(/[$,%]/g, "").trim();
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

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
    if (feeStructureData && Array.isArray(feeStructureData)) {
      setIsDataLoading(true);
      const filteredFees = feeStructureData
        .filter((fee) => fee.applicable_user === applicableUser)
        .map((fee) => ({
          id: fee.id,
          feeName: fee.fee_name,
          amount: fee.amount,
          displayAmount: fee.amount.toString(),
          serviceAreaIds: getServiceAreaIds(fee),
          appliesTo: fee.applies_to,
          applicableUser: fee.applicable_user,
          conditionValue: fee.condition_value || 0,
          ruleKey: fee.rule_key || "",
          ruleOperator: fee.rule_operator || "",
          ruleValue: fee.rule_value || "",
          conditionUnit: fee.condition_unit || "BDT",
          isActive: fee.is_active ?? true,
        }));

      setFees(filteredFees);
      setIsDataLoading(false);
    }
  }, [feeStructureData, applicableUser]);

  const handleAddFee = () => {
    setFees([
      ...fees,
      {
        feeName: "",
        amount: 0,
        displayAmount: "",
        serviceAreaIds: ["ALL"],
        appliesTo: "DELIVERY_TYPE",
        applicableUser: applicableUser,
        conditionValue: 0,
        ruleKey: "delivery_type",
        ruleOperator: "=",
        ruleValue: "",
        conditionUnit: "BDT",
        isActive: true,
      },
    ]);
  };

  const openDeleteModal = (index: number) => {
    const fee = fees[index];
    if (fee.id) {
      setDeleteModal({
        isOpen: true,
        feeId: fee.id,
        feeIndex: index,
        feeName: fee.feeName || "Unnamed Fee",
      });
    } else {
      const newFees = fees.filter((_, i) => i !== index);
      setFees(newFees);
      toast.success("Fee removed");
    }
  };

  const handleDeleteFee = async () => {
    if (deleteModal.feeId === undefined || deleteModal.feeIndex === undefined) {
      toast.error("Invalid fee data");
      return;
    }

    setIsLoading(true);
    try {
      const response = await onDeleteFeeStructure(deleteModal.feeId);

      if (response?.success) {
        toast.success(response.message || "Fee deleted successfully");
        const newFees = fees.filter((_, i) => i !== deleteModal.feeIndex);
        setFees(newFees);
      } else {
        toast.error(response?.message || "Failed to delete fee");
      }
    } catch (error: any) {
      console.error("Failed to delete fee:", error);
      toast.error(error?.data?.message || "Failed to delete fee");
    } finally {
      setDeleteModal({
        isOpen: false,
        feeId: undefined,
        feeIndex: undefined,
        feeName: "",
      });
      setIsLoading(false);
    }
  };

  const handleFeeChange = (
    index: number,
    field: keyof FeeStructure,
    value: string | number | null | boolean | any,
  ) => {
    const newFees = [...fees];

    if (field === "amount") {
      const numValue =
        typeof value === "string"
          ? parseAmountToNumber(value)
          : (value as number);
      newFees[index] = {
        ...newFees[index],
        amount: numValue,
        displayAmount:
          typeof value === "string" ? value : (value?.toString() ?? ""),
      };
    } else if (field === "appliesTo") {
      newFees[index] = {
        ...newFees[index],
        [field]: value as string,
      };
    } else if (field === "serviceAreaIds") {
      newFees[index] = { ...newFees[index], [field]: value };
    } else {
      newFees[index] = { ...newFees[index], [field]: value as any };
    }

    setFees(newFees);
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
      const hadAll = (fees[index].serviceAreaIds || []).includes("ALL");
      if (!hadAll) {
        values = ["ALL"];
      } else {
        values = values.filter((val: any) => val !== "ALL");
      }
    }
    
    if (values.length === 0) {
      values = ["ALL"];
    }

    handleFeeChange(index, "serviceAreaIds", values);
  };

  const handleDisplayAmountChange = (index: number, value: string) => {
    const newFees = [...fees];
    const isValid = /^[\$]?\d*(\.\d+)?[%]?$/.test(value);

    if (isValid || value === "") {
      newFees[index] = {
        ...newFees[index],
        displayAmount: value,
        amount: parseAmountToNumber(value),
      };
      setFees(newFees);
    }
  };

  const handleToggleActive = async (index: number) => {
    const fee = fees[index];
    const newStatus = !fee.isActive;

    // Update local state first for instant feedback
    const newFees = [...fees];
    newFees[index] = { ...newFees[index], isActive: newStatus };
    setFees(newFees);

    if (fee.id) {
      try {
        const response = await onUpdateFeeStructure({
          id: fee.id,
          is_active: newStatus,
        } as any);

        if (!response?.success) {
          // Revert local state on API failure
          const revertFees = [...newFees];
          revertFees[index] = { ...revertFees[index], isActive: fee.isActive };
          setFees(revertFees);
          toast.error(response?.message || "Failed to update status");
        }
      } catch (error) {
        console.error("Failed to toggle status:", error);
        toast.error("Failed to update status");
        // Revert local state on error
        const revertFees = [...newFees];
        revertFees[index] = { ...revertFees[index], isActive: fee.isActive };
        setFees(revertFees);
      }
    }
  };


  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newFees = fees.filter((fee) => !fee.id);
      const existingFees = fees.filter((fee) => fee.id);

      let newSuccessCount = 0;
      let newErrorCount = 0;
      let updateSuccessCount = 0;
      let updateErrorCount = 0;

      for (const fee of newFees) {
        if (fee.feeName.trim() && fee.amount > 0 && fee.serviceAreaIds) {
          const requestData: any = {
            fee_name: fee.feeName,
            amount: fee.amount,
            serviceAreaIds: fee.serviceAreaIds,
            applies_to: fee.appliesTo,
            applicable_user: fee.applicableUser,
            rule_key: fee.ruleKey,
            rule_operator: fee.ruleOperator,
            rule_value: fee.ruleValue,
            condition_value: fee.conditionValue,
            condition_unit: fee.conditionUnit,
            is_active: fee.isActive,
          };

          try {
            await onAddFeeStructure(requestData);
            newSuccessCount++;
          } catch (error) {
            newErrorCount++;
            console.error("Failed to save new fee:", error);
          }
        }
      }

      for (const fee of existingFees) {
        if (
          fee.id &&
          fee.feeName.trim() &&
          fee.amount > 0 &&
          fee.serviceAreaIds
        ) {
          const requestData: any = {
            id: fee.id,
            fee_name: fee.feeName,
            amount: fee.amount,
            serviceAreaIds: fee.serviceAreaIds,
            applies_to: fee.appliesTo,
            applicable_user: fee.applicableUser,
            rule_key: fee.ruleKey,
            rule_operator: fee.ruleOperator,
            rule_value: fee.ruleValue,
            condition_value: fee.conditionValue,
            condition_unit: fee.conditionUnit,
            is_active: fee.isActive,
          };

          try {
            await onUpdateFeeStructure(requestData);
            updateSuccessCount++;
          } catch (error) {
            updateErrorCount++;
            console.error("Failed to update fee:", error);
          }
        }
      }

      const messages = [];
      if (newSuccessCount > 0)
        messages.push(`${newSuccessCount} new fee(s) created`);
      if (updateSuccessCount > 0)
        messages.push(`${updateSuccessCount} fee(s) updated`);
      if (newErrorCount > 0)
        messages.push(`Failed to create ${newErrorCount} fee(s)`);
      if (updateErrorCount > 0)
        messages.push(`Failed to update ${updateErrorCount} fee(s)`);

      if (messages.length > 0) {
        // const summary = messages.join(", ");
        if (newSuccessCount > 0 || updateSuccessCount > 0) {
          // toast.success(summary);
        } else {
          // toast.error(summary);
        }
      }
    } catch (error) {
      console.error("Failed to save fees:", error);
      toast.error("Failed to save fee structure. Please try again.");
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
      <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-gray-200">
        <div className="flex md:justify-between items-center mb-6 flex-col md:flex-row justify-center gap-4 md:gap-0 text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-900">
            User Fee Structure
          </h2>
          <button
            onClick={handleAddFee}
            type="button"
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            Add Fee
          </button>
        </div>

        <form onSubmit={handleSaveAll} className="space-y-6">
          <div className="overflow-x-auto pb-4">
            <div className="min-w-[1000px]">
              <div className="hidden md:grid grid-cols-[1.2fr_0.8fr_0.8fr_1fr_1.5fr_0.8fr_0.8fr_50px_40px] gap-3 mb-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <div>Fee Name</div>
                <div>Amount</div>
                <div>Unit</div>
                <div>Service Area</div>
                <div>Rule (Key | Op | Value)</div>
                <div>Applies To</div>
                <div>Cond. Val</div>
                <div className="text-center">Active</div>
                <div className="w-10"></div>
              </div>

              {fees.length === 0 ? (
                <div className="text-center py-12 rounded-2xl text-gray-400">
                  No fee structure found. Click "Add Fee" to create one.
                </div>
              ) : (
                fees.map((fee, index) => (
                  <div
                    key={fee.id || `new-${index}`}
                    className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr_1.5fr_0.8fr_0.8fr_50px_40px] gap-3 items-center bg-gray-50/50 p-4 md:p-0 md:bg-transparent rounded-xl md:rounded-none border md:border-0 border-gray-100 mb-4 md:mb-0 my-4"
                  >
                    <input
                      type="text"
                      value={fee.feeName}
                      onChange={(e) =>
                        handleFeeChange(index, "feeName", e.target.value)
                      }
                      placeholder="Fee Name"
                      className={inputClasses}
                      required
                      disabled={isLoading}
                    />

                    <input
                      type="text"
                      value={fee.displayAmount || ""}
                      onChange={(e) =>
                        handleDisplayAmountChange(index, e.target.value)
                      }
                      placeholder="Amount"
                      className={inputClasses}
                      required
                      disabled={isLoading}
                    />

                    <select
                      value={fee.conditionUnit}
                      onChange={(e) =>
                        handleFeeChange(index, "conditionUnit", e.target.value)
                      }
                      className={selectClasses}
                      disabled={isLoading}
                    >
                      <option value="BDT">BDT</option>
                      <option value="KM">KM</option>
                      <option value="ORDER_AMOUNT">Order Amt</option>
                      {/* <option value="PERCENTAGE">%</option> */}
                    </select>

                    <SelectReact
                      isMulti
                      options={zoneOptions}
                      value={getSelectValue(fee.serviceAreaIds)}
                      onChange={(selected) => handleZoneChange(index, selected)}
                      className="w-full text-sm min-w-[150px]"
                      isDisabled={isLoading}
                      placeholder="Select Service Areas"
                    />

                    <div className="grid grid-cols-[1fr_45px_1fr] gap-1">
                      <input
                        type="text"
                        value={fee.ruleKey}
                        onChange={(e) =>
                          handleFeeChange(index, "ruleKey", e.target.value)
                        }
                        placeholder="Key"
                        className={`${inputClasses} px-2 py-2 text-xs`}
                        disabled={isLoading}
                      />
                      <select
                        value={fee.ruleOperator}
                        onChange={(e) =>
                          handleFeeChange(index, "ruleOperator", e.target.value)
                        }
                        className={`${selectClasses} px-1 py-2 text-xs`}
                        disabled={isLoading}
                      >
                        <option value="=">=</option>
                        <option value=">">&gt;</option>
                        <option value="<">&lt;</option>
                        <option value=">=">&gt;=</option>
                        <option value="<=">&lt;=</option>
                      </select>
                      <input
                        type="text"
                        value={fee.ruleValue}
                        onChange={(e) =>
                          handleFeeChange(index, "ruleValue", e.target.value)
                        }
                        placeholder="Val"
                        className={`${inputClasses} px-2 py-2 text-xs`}
                        disabled={isLoading}
                      />
                    </div>

                    <input
                      type="text"
                      value={fee.appliesTo}
                      onChange={(e) =>
                        handleFeeChange(index, "appliesTo", e.target.value)
                      }
                      placeholder="Category"
                      className={inputClasses}
                      disabled={isLoading}
                    />

                    <input
                      type="number"
                      value={fee.conditionValue || ""}
                      onChange={(e) =>
                        handleFeeChange(
                          index,
                          "conditionValue",
                          Number(e.target.value),
                        )
                      }
                      placeholder="Cond."
                      className={inputClasses}
                      disabled={isLoading}
                    />

                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(index)}
                        className={`w-10 h-6 rounded-full transition-colors relative ${fee.isActive ? "bg-green-500" : "bg-gray-300"}`}
                        disabled={isLoading}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${fee.isActive ? "right-1" : "left-1"}`}
                        />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => openDeleteModal(index)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Remove fee"
                      disabled={isLoading}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {fees.length > 0 && (
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-12 rounded-xl text-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || fees.length === 0}
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
        onConfirm={handleDeleteFee}
        title="Delete Fee Structure"
        description={`Are you sure you want to delete "${deleteModal.feeName}"? This action cannot be undone.`}
        isLoading={isLoading}
      />
    </>
  );
}
