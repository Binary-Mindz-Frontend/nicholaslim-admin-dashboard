import { useState } from "react";
import { Trash2 } from "lucide-react";

// --- Fee Structure Data Types ---
interface FeeRule {
  feeName: string;
  amount: string;
  serviceArea: string; // Type of amount (Fixed Amount/Percentage)
  appliesTo: string;
}

// --- Shared Input Classes ---
const inputClasses =
  "w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-yellow-500 focus:border-yellow-500";
const selectClasses =
  "w-full px-4 py-3 border border-gray-300 rounded-lg text-base appearance-none bg-white focus:ring-yellow-500 focus:border-yellow-500";

export default function UserFeeStructure() {
  // --- State for Fee Rules ---
  const [feeRules, setFeeRules] = useState<FeeRule[]>([
    // Initial data from the image
    {
      feeName: "Delivery Fee",
      amount: "$3.99",
      serviceArea: "Fixed Amount",
      appliesTo: "All Orders",
    },
    {
      feeName: "Service Fee",
      amount: "10%",
      serviceArea: "Percentage",
      appliesTo: "All Orders",
    },
    {
      feeName: "Small Order Fee",
      amount: "$2.5",
      serviceArea: "Fixed Amount",
      appliesTo: "Orders < $15",
    },
    {
      feeName: "Express Delivery",
      amount: "$4.99",
      serviceArea: "Fixed Amount",
      appliesTo: "Express Orders",
    },
  ]);

  // --- Fee Rule Handlers ---
  const handleAddFeeRule = () => {
    setFeeRules([
      ...feeRules,
      {
        feeName: "",
        amount: "",
        serviceArea: "Fixed Amount",
        appliesTo: "All Orders",
      },
    ]);
  };

  const handleRemoveFeeRule = (index: number) => {
    setFeeRules(feeRules.filter((_, i) => i !== index));
  };

  const handleFeeRuleChange = (
    index: number,
    field: keyof FeeRule,
    value: string
  ) => {
    const newRules = [...feeRules];
    newRules[index] = { ...newRules[index], [field]: value };
    setFeeRules(newRules);
  };

  // Placeholder Save function
  const handleSaveFees = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving Fee Rules:", feeRules);
    alert("User Fee Rules Saved (placeholder action)");
  };

  // --- Helper Render Function for Rules ---
  const renderFeeRuleRow = (rule: FeeRule, index: number) => (
    <div
      key={index}
      className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr_40px] gap-4 items-center"
    >
      <input
        type="text"
        value={rule.feeName}
        onChange={(e) => handleFeeRuleChange(index, "feeName", e.target.value)}
        placeholder="Fee Name"
        className={inputClasses}
        required
      />
      <input
        type="text"
        value={rule.amount}
        onChange={(e) => handleFeeRuleChange(index, "amount", e.target.value)}
        placeholder="Amount"
        className={inputClasses}
        required
      />
      <select
        value={rule.serviceArea}
        onChange={(e) =>
          handleFeeRuleChange(index, "serviceArea", e.target.value)
        }
        className={selectClasses}
      >
        <option>Fixed Amount</option>
        <option>Percentage</option>
      </select>
      <select
        value={rule.appliesTo}
        onChange={(e) =>
          handleFeeRuleChange(index, "appliesTo", e.target.value)
        }
        className={selectClasses}
      >
        <option>All Orders</option>
        <option>Orders &lt; $15</option>
        <option>Express Orders</option>
      </select>
      <button
        type="button"
        onClick={() => handleRemoveFeeRule(index)}
        className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center cursor-pointer"
        aria-label="Remove fee rule"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-gray-200">
      <div className="flex md:justify-between items-center mb-6 flex-col md:flex-row justify-center gap-4 md:gap-0 text-center md:text-left">
        <h2 className="text-2xl font-bold text-gray-900">User Fee Structure</h2>
        <button
          onClick={handleAddFeeRule}
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg text-sm transition-colors cursor-pointer"
        >
          Add Fee
        </button>
      </div>

      <form onSubmit={handleSaveFees} className="space-y-4">
        {/* Header Row (Hidden on mobile) */}
        <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_1fr_40px] gap-4 mb-2 text-sm font-semibold text-gray-600">
          <div>Fee Name</div>
          <div>Amount</div>
          <div>Type</div>
          <div>Applies to</div>
          <div className="w-10"></div>
        </div>

        {/* Dynamic Fee Rules Rows */}
        {feeRules.map(renderFeeRuleRow)}

        <div className="flex justify-center pt-6">
          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-12 rounded-xl text-lg transition-colors cursor-pointer"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
