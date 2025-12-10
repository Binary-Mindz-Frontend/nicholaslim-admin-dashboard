import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/Shared/LoadingSpinner/LoadingSpinner";
import DeleteConfirmationModal from "@/components/Shared/DeleteConfirmationModal/DeleteConfirmationModal";
import { FeeStructure, UserFeeStructureProps } from "@/types/userFeeStructureType";

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

  // Function to parse amount string to number
  const parseAmountToNumber = (amountStr: string): number => {
    if (!amountStr) return 0;
    
    // Remove any $, % signs and trim whitespace
    const cleaned = amountStr.replace(/[$,%]/g, '').trim();
    
    // Convert to number
    const num = parseFloat(cleaned);
    
    // Return 0 if not a valid number
    return isNaN(num) ? 0 : num;
  };

  // Transform API data to match component state
  useEffect(() => {
    if (feeStructureData) {
      setIsDataLoading(true);
      const filteredFees = feeStructureData
        .filter((fee) => fee.applicable_user === applicableUser)
        .map((fee) => ({
          id: fee.id,
          feeName: fee.fee_name,
          amount: fee.amount, // API returns number
          displayAmount: fee.amount.toString(), // For display
          serviceArea: fee.service_area,
          appliesTo: fee.applies_to,
          applicableUser: fee.applicable_user,
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
        serviceArea: "", 
        appliesTo: "ALL_ORDERS", 
        applicableUser: applicableUser 
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
      // If no ID, just remove from UI
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
    value: string | number | "ALL_ORDERS" | "ORDERLESS15" | "EXPRESS_ORDERS"
  ) => {
    const newFees = [...fees];
    
    if (field === "amount") {
      // Parse string to number
      const numValue = typeof value === 'string' ? parseAmountToNumber(value) : value;
      newFees[index] = { 
        ...newFees[index], 
        amount: numValue,
        displayAmount: typeof value === 'string' ? value : value.toString()
      };
    } else {
      newFees[index] = { ...newFees[index], [field]: value };
    }
    
    setFees(newFees);
  };

  const handleDisplayAmountChange = (index: number, value: string) => {
    const newFees = [...fees];
    
    // Validate input (allow numbers, decimals, $, %)
    const isValid = /^[\$]?\d*(\.\d+)?[%]?$/.test(value);
    
    if (isValid || value === "") {
      newFees[index] = { 
        ...newFees[index], 
        displayAmount: value,
        amount: parseAmountToNumber(value)
      };
      setFees(newFees);
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

      // Save new fees (without ID)
      for (const fee of newFees) {
        if (fee.feeName.trim() && fee.amount > 0 && fee.serviceArea.trim()) {
          try {
            await onAddFeeStructure({
              feeName: fee.feeName,
              amount: fee.amount, // Send as number
              serviceArea: fee.serviceArea,
              appliesTo: fee.appliesTo,
              applicableUser: fee.applicableUser,
            });
            newSuccessCount++;
          } catch (error) {
            newErrorCount++;
            console.error("Failed to save new fee:", error);
          }
        }
      }

      // Update existing fees (with ID)
      for (const fee of existingFees) {
        if (fee.id && fee.feeName.trim() && fee.amount > 0 && fee.serviceArea.trim()) {
          try {
            await onUpdateFeeStructure({
              id: fee.id,
              feeName: fee.feeName,
              amount: fee.amount, // Send as number
              serviceArea: fee.serviceArea,
              appliesTo: fee.appliesTo,
              applicableUser: fee.applicableUser,
            });
            updateSuccessCount++;
          } catch (error) {
            updateErrorCount++;
            console.error("Failed to update fee:", error);
          }
        }
      }

      // Show success/error messages
      const messages = [];
      if (newSuccessCount > 0) messages.push(`${newSuccessCount} new fee(s) created`);
      if (updateSuccessCount > 0) messages.push(`${updateSuccessCount} fee(s) updated`);
      if (newErrorCount > 0) messages.push(`Failed to create ${newErrorCount} fee(s)`);
      if (updateErrorCount > 0) messages.push(`Failed to update ${updateErrorCount} fee(s)`);

      if (messages.length > 0) {
        const summary = messages.join(", ");
        if (newSuccessCount > 0 || updateSuccessCount > 0) {
          toast.success(summary);
        } else {
          toast.error(summary);
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
          <h2 className="text-2xl font-bold text-gray-900">User Fee Structure</h2>
          <button
            onClick={handleAddFee}
            type="button"
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            Add Fee
          </button>
        </div>

        <form onSubmit={handleSaveAll} className="space-y-4">
          {/* Header Row */}
          <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_1fr_40px] gap-4 mb-2 text-sm font-semibold text-gray-600">
            <div>Fee Name</div>
            <div>Amount</div>
            <div>Service Area</div>
            <div>Applies to</div>
            <div className="w-10"></div>
          </div>

          {/* Dynamic Fees Rows */}
          {fees.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No fee structure found. Click "Add Fee" to create one.
            </div>
          ) : (
            fees.map((fee, index) => (
              <div
                key={fee.id || `new-${index}`}
                className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr_40px] gap-4 items-center"
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
                  onChange={(e) => handleDisplayAmountChange(index, e.target.value)}
                  placeholder="Amount (e.g., 3.99, 10%, $2.5)"
                  className={inputClasses}
                  required
                  disabled={isLoading}
                  pattern="^[\$]?\d+(\.\d+)?[%]?$"
                  title="Enter a valid amount (e.g., 3.99, 10%, $2.5)"
                />
                <input
                  type="text"
                  className={inputClasses}
                  value={fee.serviceArea || ""}
                  placeholder="Enter Service Area"
                  onChange={(e) =>
                    handleFeeChange(index, "serviceArea", e.target.value)
                  }
                  required
                  disabled={isLoading}
                />
                <select
                  value={fee.appliesTo}
                  onChange={(e) =>
                    handleFeeChange(
                      index,
                      "appliesTo",
                      e.target.value as "ALL_ORDERS" | "ORDERLESS15" | "EXPRESS_ORDERS"
                    )
                  }
                  className={selectClasses}
                  disabled={isLoading}
                >
                  <option value="ALL_ORDERS">All Orders</option>
                  <option value="ORDERLESS15">Orders &lt; $15</option>
                  <option value="EXPRESS_ORDERS">Express Orders</option>
                </select>
                
                {/* Delete Button Only */}
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

          {fees.length > 0 && (
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-12 rounded-xl text-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || fees.length === 0}
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
        onConfirm={handleDeleteFee}
        title="Delete Fee Structure"
        description={`Are you sure you want to delete "${deleteModal.feeName}"? This action cannot be undone.`}
        isLoading={isLoading}
      />
    </>
  );
}