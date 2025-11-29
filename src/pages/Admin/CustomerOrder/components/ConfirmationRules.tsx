
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";

interface Settings {
  isNewCustomer: number;
  completedOrders: number;
  followerWeight: number;
}

export function ConfirmationRules() {
  const [settings, setSettings] = useState<Settings>({
    isNewCustomer: 10,
    completedOrders: 5,
    followerWeight: 80,
  });

  const update = (key: keyof Settings, value: number) => {
    setSettings((prev) => ({ ...prev, [key]: Math.max(0, value) }));
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-8">
      <h2 className="mb-8 text-lg font-semibold text-slate-900">
        Confirmation Rules
      </h2>

      <div className="space-y-8">
        {/* Is new customer */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-700">
            Is new customer
          </label>
          <div className="flex items-center gap-4">
            <Input
              type="number"
              value={settings.isNewCustomer}
              onChange={(e) =>
                update("isNewCustomer", Number(e.target.value) || 0)
              }
              className="h-11 w-full border-slate-300 text-right text-base font-medium focus:border-slate-400"
            />
            <span className="text-base font-medium text-slate-900">%</span>
          </div>
        </div>

        {/* Completed Orders */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-700">
            Completed Orders
          </label>
          <div className="flex items-center gap-4">
            <Input
              type="number"
              value={settings.completedOrders}
              onChange={(e) =>
                update("completedOrders", Number(e.target.value) || 0)
              }
              className="h-11 w-full border-slate-300 text-right text-base font-medium focus:border-slate-400"
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
            onChange={(e) => update("followerWeight", Number(e.target.value))}
            className="h-3 w-full cursor-pointer rounded-full bg-linear-to-r from-blue-600 to-blue-500 accent-blue-600"
            style={{
              background: `linear-gradient(to right, #2563eb ${settings.followerWeight}%, #e0e7ff ${settings.followerWeight}%, #e0e7ff 100%)`,
            }}
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-10 flex justify-center">
        <Button
          onClick={() => console.log("Saved:", settings)}
          className="bg-blue-600 px-8 py-2 text-white hover:bg-blue-700"
        >
          Save Change
        </Button>
      </div>
    </section>
  );
}
