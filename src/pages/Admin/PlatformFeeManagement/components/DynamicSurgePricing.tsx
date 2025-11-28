import { useState } from "react";
import { Trash2 } from "lucide-react";

// --- Surge Pricing Data Types ---
interface SurgeRule {
  ruleName: string;
  multiplier: string;
  condition: string;
  timeRange: string;
}

// --- Shared Input Classes ---
const inputClasses =
  "w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-yellow-500 focus:border-yellow-500";
const selectClasses =
  "w-full px-4 py-3 border border-gray-300 rounded-lg text-base appearance-none bg-white focus:ring-yellow-500 focus:border-yellow-500";

export default function DynamicSurgePricing() {
  // --- State for Surge Rules ---
  const [surgeRules, setSurgeRules] = useState<SurgeRule[]>([
    // Initial data from the image
    {
      ruleName: "Peak Hours",
      multiplier: "1.5x",
      condition: "High Demand",
      timeRange: "11:30-1:30 PM",
    },
    {
      ruleName: "Order Rush",
      multiplier: "1.75x",
      condition: "Very High Demand",
      timeRange: "6:00 PM-8:00 PM",
    },
    {
      ruleName: "Weekend Premium",
      multiplier: "1.3x",
      condition: "Weekend",
      timeRange: "6:00 PM-8:00 PM",
    },
  ]);

  // --- Surge Rule Handlers ---
  const handleAddSurgeRule = () => {
    setSurgeRules([
      ...surgeRules,
      { ruleName: "", multiplier: "", condition: "High Demand", timeRange: "" },
    ]);
  };

  const handleRemoveSurgeRule = (index: number) => {
    setSurgeRules(surgeRules.filter((_, i) => i !== index));
  };

  const handleSurgeRuleChange = (
    index: number,
    field: keyof SurgeRule,
    value: string
  ) => {
    const newRules = [...surgeRules];
    newRules[index] = { ...newRules[index], [field]: value };
    setSurgeRules(newRules);
  };

  // Placeholder Save function
  const handleSaveSurge = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving Surge Rules:", surgeRules);
    alert("Dynamic Surge Rules Saved (placeholder action)");
  };

  const renderSurgeRuleRow = (rule: SurgeRule, index: number) => (
    <div
      key={index}
      className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr_40px] gap-4 items-center"
    >
      <input
        type="text"
        value={rule.ruleName}
        onChange={(e) =>
          handleSurgeRuleChange(index, "ruleName", e.target.value)
        }
        placeholder="Rule Name"
        className={inputClasses}
        required
      />
      <input
        type="text"
        value={rule.multiplier}
        onChange={(e) =>
          handleSurgeRuleChange(index, "multiplier", e.target.value)
        }
        placeholder="Price Multiplier"
        className={inputClasses}
        required
      />
      <select
        value={rule.condition}
        onChange={(e) =>
          handleSurgeRuleChange(index, "condition", e.target.value)
        }
        className={selectClasses}
      >
        <option>High Demand</option>
        <option>Very High Demand</option>
        <option>Weekend</option>
        <option>Bad Weather</option>
      </select>
      <input
        type="text"
        value={rule.timeRange}
        onChange={(e) =>
          handleSurgeRuleChange(index, "timeRange", e.target.value)
        }
        placeholder="Time Range"
        className={inputClasses}
        required
      />
      <button
        type="button"
        onClick={() => handleRemoveSurgeRule(index)}
        className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center"
        aria-label="Remove surge rule"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-200">
      <div className="flex md:justify-between items-center mb-6 flex-col md:flex-row justify-center gap-4 md:gap-0 text-center md:text-left">
        <h2 className="text-2xl font-bold text-gray-900">
          Dynamic Surge Pricing
        </h2>
        <button
          onClick={handleAddSurgeRule}
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg text-sm transition-colors"
        >
          Add Surge Rule
        </button>
      </div>

      <form onSubmit={handleSaveSurge} className="space-y-4">
        {/* Header Row (Hidden on mobile) */}
        <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_1fr_40px] gap-4 mb-2 text-sm font-semibold text-gray-600">
          <div>Rule Name</div>
          <div>Price Multiplier</div>
          <div>Condition</div>
          <div>Time Range</div>
          <div className="w-10"></div>
        </div>

        {/* Dynamic Surge Rules Rows */}
        {surgeRules.map(renderSurgeRuleRow)}

        <div className="flex justify-center pt-6">
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
