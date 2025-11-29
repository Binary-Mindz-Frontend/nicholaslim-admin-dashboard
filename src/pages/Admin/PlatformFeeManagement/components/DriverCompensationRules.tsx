import { useState } from "react";
import { Trash2 } from "lucide-react"; // Import Trash2 icon

// Define the structure for a single compensation rule
interface CompensationRule {
  scenario: string;
  percentage: string;
  serviceAreaType: string;
}

export default function DriverCompensationRules() {
  const [rules, setRules] = useState<CompensationRule[]>([
    // Initial data from the image
    {
      scenario: "Customer Late Cancellation",
      percentage: "50",
      serviceAreaType: "% of Base Fare",
    },
    {
      scenario: "Parcel Delay",
      percentage: "10",
      serviceAreaType: "Fixed Amount",
    },
    {
      scenario: "Order Already Picked up",
      percentage: "75",
      serviceAreaType: "% of Base Fare",
    },
    {
      scenario: "App Technical Issue",
      percentage: "100",
      serviceAreaType: "% of Base Fare",
    },
  ]);

  const handleAddRule = () => {
    setRules([
      ...rules,
      { scenario: "", percentage: "", serviceAreaType: "% of Base Fare" },
    ]);
  };

  const handleRemoveRule = (index: number) => {
    const newRules = rules.filter((_, i) => i !== index);
    setRules(newRules);
  };

  const handleRuleChange = (
    index: number,
    field: keyof CompensationRule,
    value: string
  ) => {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], [field]: value };
    setRules(newRules);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving Driver Compensation Rules:", rules);
    alert("Driver Compensation Rules Saved (placeholder action)");
  };

  const inputClasses =
    "w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-yellow-500 focus:border-yellow-500";
  const selectClasses =
    "w-full px-4 py-3 border border-gray-300 rounded-lg text-base appearance-none bg-white focus:ring-yellow-500 focus:border-yellow-500";

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-gray-200">
      <div className="flex md:justify-between items-center mb-6 flex-col md:flex-row justify-center gap-4 md:gap-0 text-center md:text-left">
        <h2 className="text-2xl font-bold text-gray-900">
          Driver Compensation Rules
        </h2>
        <button
          onClick={handleAddRule}
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg text-sm transition-colors"
        >
          Add New Compensation Rule
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Header Row (Optional for clarity) */}
        <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_40px] gap-4 mb-2 text-sm font-semibold text-gray-600">
          <div>Scenario</div>
          <div>Percentage/Amount</div>
          <div>Type</div>
          <div className="w-10"></div>{" "}
          {/* Placeholder for the trash icon column */}
        </div>

        {/* Dynamic Rules Rows */}
        {rules.map((rule, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_40px] gap-4 items-center"
          >
            <input
              type="text"
              value={rule.scenario}
              onChange={(e) =>
                handleRuleChange(index, "scenario", e.target.value)
              }
              placeholder="Scenario"
              className={inputClasses}
              required
            />
            <input
              type="text"
              value={rule.percentage}
              onChange={(e) =>
                handleRuleChange(index, "percentage", e.target.value)
              }
              placeholder="Value"
              className={inputClasses}
              required
            />
            <select
              value={rule.serviceAreaType}
              onChange={(e) =>
                handleRuleChange(index, "serviceAreaType", e.target.value)
              }
              className={selectClasses}
            >
              <option>% of Base Fare</option>
              <option>Fixed Amount</option>
            </select>
            <button
              type="button"
              onClick={() => handleRemoveRule(index)}
              className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center"
              aria-label="Remove rule"
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
