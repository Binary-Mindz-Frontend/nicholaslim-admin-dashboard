// app/driver-competition/page.tsx or components/driver-competition/DriverOrderCompetition.tsx
"use client";

import { useState } from "react";
import { FilterBar } from "./components/FilterBar";
import { WeightSliders } from "./components/WeightSliders";
import { OverviewCards } from "./components/OverviewCards";
import { TimeoutMaxDrivers } from "./components/TimeoutMaxDrivers";
import { ChangeLogTable } from "./components/ChangeLogTable";

interface Settings {
  challengeTimeout: number;
  maxDrivers: number;
  weights: { ranking: number; rating: number; follower: number };
}

const initialSettings: Settings = {
  challengeTimeout: 8,
  maxDrivers: 5,
  weights: { ranking: 80, rating: 30, follower: 70 },
};

export default function DriverOrderCompetition() {
  const [settings, setSettings] = useState<Settings>(initialSettings);

  const updateWeight = (key: keyof Settings["weights"], value: number) => {
    setSettings((prev) => ({
      ...prev,
      weights: { ...prev.weights, [key]: Math.max(0, Math.min(100, value)) },
    }));
  };

  return (
    <div className=" bg-slate-50 p-8">
      <div className="">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Driver Order Competition
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Configure how the system selects the winning driver when multiple
            drivers challenge an order.
          </p>
        </div>

        <FilterBar />
        <OverviewCards />
        <WeightSliders
          weights={settings.weights}
          onChange={updateWeight}
          onSave={() => console.log("Saved weights:", settings.weights)}
        />
        <TimeoutMaxDrivers
          timeout={settings.challengeTimeout}
          maxDrivers={settings.maxDrivers}
          onTimeoutChange={(v) =>
            setSettings((s) => ({ ...s, challengeTimeout: v }))
          }
          onMaxDriversChange={(v) =>
            setSettings((s) => ({ ...s, maxDrivers: v }))
          }
        />
        <ChangeLogTable />
      </div>
    </div>
  );
}
