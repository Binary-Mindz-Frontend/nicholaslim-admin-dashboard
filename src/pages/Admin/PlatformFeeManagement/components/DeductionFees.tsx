import { useState } from "react";
import { Trash2 } from "lucide-react"; // Import Trash2 icon

// Define the structure for a single deduction fee
interface DeductionFee {
  deductionName: string;
  amount: string;
  type: string;
}

export default function DeductionFees() {
  const [fees, setFees] = useState<DeductionFee[]>([
    // Initial data from the image
    { deductionName: "Maintenance Fee", amount: "$2", type: "Fixed Amount" },
    { deductionName: "Service Tax", amount: "2.5%", type: "Percentage" },
    { deductionName: "Platform Fee", amount: "$0.75", type: "Fixed Amount" },
    { deductionName: "Insurance", amount: "1.5%", type: "Percentage" },
  ]);

  const handleAddFee = () => {
    setFees([...fees, { deductionName: "", amount: "", type: "Fixed Amount" }]);
  };

  const handleRemoveFee = (index: number) => {
    const newFees = fees.filter((_, i) => i !== index);
    setFees(newFees);
  };

  const handleFeeChange = (
    index: number,
    field: keyof DeductionFee,
    value: string
  ) => {
    const newFees = [...fees];
    newFees[index] = { ...newFees[index], [field]: value };
    setFees(newFees);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving Deduction Fees:", fees);
    alert("Deduction Fees Saved (placeholder action)");
  };

  const inputClasses =
    "w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-yellow-500 focus:border-yellow-500";
  const selectClasses =
    "w-full px-4 py-3 border border-gray-300 rounded-lg text-base appearance-none bg-white focus:ring-yellow-500 focus:border-yellow-500";

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-200">
      <div className="flex md:justify-between items-center mb-6 flex-col md:flex-row justify-center gap-4 md:gap-0 text-center md:text-left">
        <h2 className="text-2xl font-bold text-gray-900">Deduction Fees</h2>
        <button
          onClick={handleAddFee}
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg text-sm transition-colors"
        >
          Add Deduction
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Header Row (Optional for clarity) */}
        <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_40px] gap-4 mb-2 text-sm font-semibold text-gray-600">
          <div>Deduction Name</div>
          <div>Amount</div>
          <div>Type</div>
          <div className="w-10"></div>{" "}
          {/* Placeholder for the trash icon column */}
        </div>

        {/* Dynamic Fees Rows */}
        {fees.map((fee, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_40px] gap-4 items-center"
          >
            <input
              type="text"
              value={fee.deductionName}
              onChange={(e) =>
                handleFeeChange(index, "deductionName", e.target.value)
              }
              placeholder="Deduction Name"
              className={inputClasses}
              required
            />
            <input
              type="text"
              value={fee.amount}
              onChange={(e) => handleFeeChange(index, "amount", e.target.value)}
              placeholder="Amount (e.g., $2 or 2.5%)"
              className={inputClasses}
              required
            />
            <select
              value={fee.type}
              onChange={(e) => handleFeeChange(index, "type", e.target.value)}
              className={selectClasses}
            >
              <option>Fixed Amount</option>
              <option>Percentage</option>
            </select>
            <button
              type="button"
              onClick={() => handleRemoveFee(index)}
              className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center"
              aria-label="Remove fee"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-12 rounded-xl text-lg transition-colors"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
