import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/Shared/LoadingSpinner/LoadingSpinner";
import DeleteConfirmationModal from "@/components/Shared/DeleteConfirmationModal/DeleteConfirmationModal";
import {
  DeductionFee,
} from "@/types/raiderDeductionFeeType";
import { useGetServiceZonesQuery } from "@/redux/features/serviceZone/serviceZoneApi";
import SelectReact from "react-select";

export default function DeductionFees({
  deductionFeesData,
  onAddDeductionFee,
  onUpdateDeductionFee,
  onDeleteDeductionFee,
}: any) {
  const [fees, setFees] = useState<DeductionFee[]>([]);
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

  useEffect(() => {
    if (deductionFeesData && Array.isArray(deductionFeesData)) {
      setIsDataLoading(true);
      const filteredFees = deductionFeesData
        .filter((fee) => fee.applicable_user === "RAIDER")
        .map((fee) => ({
          id: fee.id,
          deductionName: fee.deduction_name,
          amount: fee.amount.toString(), // Keep as string for input control
          type: fee.type,
          applicableUser: fee.applicable_user,
          serviceAreaIds: getServiceAreaIds(fee),
        }));

      setFees(filteredFees);
      setIsDataLoading(false);
    }
  }, [deductionFeesData]);

  const handleAddFee = () => {
    setFees([
      ...fees,
      {
        deductionName: "",
        amount: "",
        type: "Fixed Amount",
        applicableUser: "RAIDER",
        serviceAreaIds: ["ALL"],
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
        feeName: fee.deductionName || "Unnamed Fee",
      });
    } else {
      const newFees = fees.filter((_, i) => i !== index);
      setFees(newFees);
      toast.success("New fee draft removed");
    }
  };

  const handleDeleteFee = async () => {
    if (deleteModal.feeId === undefined || deleteModal.feeIndex === undefined) {
      toast.error("Invalid fee data");
      return;
    }

    setIsLoading(true);
    try {
      const response = await onDeleteDeductionFee(deleteModal.feeId);
      // Check for success property or standard response
      if (response?.success || response) {
        toast.success("Fee deleted successfully");
        const newFees = fees.filter((_, i) => i !== deleteModal.feeIndex);
        setFees(newFees);
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete fee");
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
    field: keyof DeductionFee,
    value: any,
  ) => {
    const newFees = [...fees];
    newFees[index] = { ...newFees[index], [field]: value };
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

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newFees = fees.filter((fee) => !fee.id);
      const existingFees = fees.filter((fee) => fee.id);

      // Save new fees
      for (const fee of newFees) {
        if (fee.deductionName.trim() && fee.amount) {
          await onAddDeductionFee({
            deductionName: fee.deductionName,
            amount: Number(fee.amount), // Converting string to Number for API
            type: fee.type,
            applicableUser: fee.applicableUser,
            serviceAreaIds: fee.serviceAreaIds,
          });
        }
      }

      // Update existing fees
      for (const fee of existingFees) {
        if (fee.id && fee.deductionName.trim() && fee.amount) {
          await onUpdateDeductionFee({
            id: fee.id,
            deductionName: fee.deductionName,
            amount: Number(fee.amount), // Converting string to Number for API
            type: fee.type,
            applicableUser: fee.applicableUser,
            serviceAreaIds: fee.serviceAreaIds,
          });
        }
      }

      toast.success("All changes saved successfully!");
    } catch (error: any) {
      console.error("Save Error:", error);
      toast.error(
        error?.data?.message || "Error saving fees. Please check your data.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ... (rest of your inputClasses and selectClasses)
  const inputClasses =
    "w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-100 disabled:cursor-not-allowed";
  const selectClasses =
    "w-full px-4 py-3 border border-gray-300 rounded-lg text-base appearance-none bg-white focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-100 disabled:cursor-not-allowed";

  if (isDataLoading)
    return (
      <div className="p-8">
        <LoadingSpinner />
      </div>
    );

  return (
    <>
      <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-200">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4 text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-900">Deduction Fees</h2>
          <button
            onClick={handleAddFee}
            type="button"
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg text-sm transition-colors"
            disabled={isLoading}
          >
            Add Deduction
          </button>
        </div>

        <form onSubmit={handleSaveAll} className="space-y-4">
          <div className="hidden md:grid grid-cols-[1fr_0.8fr_0.8fr_1.2fr_40px] gap-4 mb-2 text-sm font-semibold text-gray-600">
            <div>Deduction Name</div>
            <div>Amount</div>
            <div>Type</div>
            <div>Service Area</div>
            <div className="w-10"></div>
          </div>

          {fees.map((fee, index) => (
            <div
              key={fee.id || `new-${index}`}
              className="grid grid-cols-1 md:grid-cols-[1fr_0.8fr_0.8fr_1.2fr_40px] gap-4 items-center"
            >
              <input
                type="text"
                value={fee.deductionName}
                onChange={(e) =>
                  handleFeeChange(index, "deductionName", e.target.value)
                }
                placeholder="Name"
                className={inputClasses}
                required
              />
              <input
                type="number"
                step="any" // Allows decimals
                value={fee.amount}
                onChange={(e) =>
                  handleFeeChange(index, "amount", e.target.value)
                }
                placeholder="0.00"
                className={inputClasses}
                required
              />
              <select
                value={fee.type}
                onChange={(e) => handleFeeChange(index, "type", e.target.value)}
                className={selectClasses}
              >
                <option value="fixed_amount">Fixed Amount</option>
                <option value="percentage">Percentage</option>
              </select>
              <SelectReact
                isMulti
                options={zoneOptions}
                value={getSelectValue(fee.serviceAreaIds)}
                onChange={(selected) => handleZoneChange(index, selected)}
                className="w-full text-sm"
                isDisabled={isLoading}
                placeholder="Select Service Areas"
              />
              <button
                type="button"
                onClick={() => openDeleteModal(index)}
                className="text-red-500 hover:text-red-700 p-2 cursor-pointer"
                disabled={isLoading}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}

          {fees.length > 0 && (
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-12 rounded-xl text-lg disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                {isLoading ? "Saving..." : "Save All Changes"}
              </button>
            </div>
          )}
        </form>
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={handleDeleteFee}
        title="Delete Deduction Fee"
        description={`Are you sure you want to delete "${deleteModal.feeName}"?`}
        isLoading={isLoading}
      />
    </>
  );
}
