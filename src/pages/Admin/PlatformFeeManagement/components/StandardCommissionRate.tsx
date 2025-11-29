import { useState } from "react";
import { Trash2 } from "lucide-react"; // Import Trash2 icon

// Define the structure for a single commission rule
interface CommissionRule {
  ruleName: string;
  percentage: string;
  serviceArea: string;
}

export default function StandardCommissionRate() {
  const [rules, setRules] = useState<CommissionRule[]>([
    // Initial data from the image
    { ruleName: "Standard Rate", percentage: "15", serviceArea: "All Zones" },
    { ruleName: "Weekend Rate", percentage: "18", serviceArea: "Urban Areas" },
    { ruleName: "Peak Hours", percentage: "20", serviceArea: "Downtown" },
    {
      ruleName: "Express Delivery",
      percentage: "22",
      serviceArea: "All Zones",
    },
  ]);

  const handleAddRule = () => {
    setRules([
      ...rules,
      { ruleName: "", percentage: "", serviceArea: "All Zones" },
    ]);
  };

  const handleRemoveRule = (index: number) => {
    const newRules = rules.filter((_, i) => i !== index);
    setRules(newRules);
  };

  const handleRuleChange = (
    index: number,
    field: keyof CommissionRule,
    value: string
  ) => {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], [field]: value };
    setRules(newRules);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving Standard Commission Rates:", rules);
    alert("Standard Commission Rates Saved (placeholder action)");
  };

  const inputClasses =
    "w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-yellow-500 focus:border-yellow-500";
  const selectClasses =
    "w-full px-4 py-3 border border-gray-300 rounded-lg text-base appearance-none bg-white focus:ring-yellow-500 focus:border-yellow-500";

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-gray-200">
      <div className="flex md:justify-between items-center mb-6 flex-col md:flex-row justify-center gap-4 md:gap-0 text-center md:text-left">
        <h2 className="text-2xl font-bold text-gray-900">
          Standard Commission Rate
        </h2>
        <button
          onClick={handleAddRule}
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg text-sm transition-colors cursor-pointer"
        >
          Add Rate
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Header Row (Optional for clarity) */}
        <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_40px] gap-4 mb-2 text-sm font-semibold text-gray-600">
          <div>Rule Name</div>
          <div>Percentage of Delivery Fee</div>
          <div>Service Area</div>
          <div className="w-10"></div>{" "}
          {/* Placeholder for the trash icon column */}
        </div>

        {/* Dynamic Rules Rows */}
        {rules.map((rule, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_40px] gap-4 items-center" // Added items-center for vertical alignment
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
            />
            <input
              type="number"
              value={rule.percentage}
              onChange={(e) =>
                handleRuleChange(index, "percentage", e.target.value)
              }
              placeholder="Percentage (e.g., 15)"
              className={inputClasses}
              required
            />
            <select
              value={rule.serviceArea}
              onChange={(e) =>
                handleRuleChange(index, "serviceArea", e.target.value)
              }
              className={selectClasses}
            >
              <option>All Zones</option>
              <option>Urban Areas</option>
              <option>Downtown</option>
              <option>Suburban</option>
            </select>
            <button
              type="button" // Important: type="button" to prevent form submission
              onClick={() => handleRemoveRule(index)}
              className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center cursor-pointer"
              aria-label="Remove rule"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}

        <div className="flex justify-center pt-4">
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
