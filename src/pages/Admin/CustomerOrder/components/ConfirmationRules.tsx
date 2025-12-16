import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface ConfirmationRulesProps {
  settings: {
    newCustomer: number;
    completedOrders: number;
    followerWeight: number;
  };
  onSettingChange: (key: 'newCustomer' | 'completedOrders' | 'followerWeight', value: number) => void;
  onSave: () => void;
  isLoading?: boolean;
}

export function ConfirmationRules({ 
  settings, 
  onSettingChange, 
  onSave, 
  isLoading = false 
}: ConfirmationRulesProps) {
  const handleInputChange = (key: 'newCustomer' | 'completedOrders' | 'followerWeight', value: string) => {
    const numValue = parseInt(value) || 0;
    onSettingChange(key, Math.max(0, numValue));
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-8">
      <h2 className="mb-8 text-lg font-semibold text-slate-900">
        Confirmation Rules
      </h2>

      <div className="space-y-8">
        {/* New Customer Percentage */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-700">
            New Customer Percentage
          </label>
          <div className="flex items-center gap-4">
            <Input
              type="number"
              min="0"
              max="100"
              value={settings.newCustomer}
              onChange={(e) => handleInputChange("newCustomer", e.target.value)}
              className="h-11 w-full border-slate-300 text-right text-base font-medium focus:border-slate-400"
              disabled={isLoading}
            />
            <span className="text-base font-medium text-slate-900">%</span>
          </div>
        </div>

        {/* Completed Orders Required */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-700">
            Completed Orders Required
          </label>
          <div className="flex items-center gap-4">
            <Input
              type="number"
              min="0"
              value={settings.completedOrders}
              onChange={(e) => handleInputChange("completedOrders", e.target.value)}
              className="h-11 w-full border-slate-300 text-right text-base font-medium focus:border-slate-400"
              disabled={isLoading}
            />
            <Plus className="h-6 w-6 text-slate-400" />
          </div>
        </div>

        {/* Follower Weight - Blue Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">
              Follower Weight
            </label>
            <span className="text-lg font-bold text-slate-900">
              {settings.followerWeight}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.followerWeight}
            onChange={(e) => onSettingChange("followerWeight", parseInt(e.target.value) || 0)}
            className="h-3 w-full cursor-pointer rounded-full bg-linear-to-r from-blue-600 to-blue-500 accent-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
            style={{
              background: `linear-gradient(to right, #2563eb ${settings.followerWeight}%, #e0e7ff ${settings.followerWeight}%, #e0e7ff 100%)`,
            }}
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-10 flex justify-center">
        <Button
          onClick={onSave}
          disabled={isLoading}
          className="bg-blue-600 px-8 py-2 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            "Save Change"
          )}
        </Button>
      </div>
    </section>
  );
}