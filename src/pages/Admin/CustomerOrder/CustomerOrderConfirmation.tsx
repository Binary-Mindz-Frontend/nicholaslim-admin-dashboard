// app/customer-order-confirmation/page.tsx
"use client";

import { ConfirmationRatioChart } from "./components/ConfirmationRatioChart";
import { ConfirmationRules } from "./components/ConfirmationRules";
import { FilterBar } from "./components/FilterBar";
import { OverviewCards } from "./components/OverviewCards";

export default function CustomerOrderConfirmation() {
  return (
    <div className=" bg-slate-50 p-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Customer Order Confirmation
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Overview of how orders are automatically confirmed based on customer
            trust level.
          </p>
        </div>

        <FilterBar />
        <OverviewCards />
        <ConfirmationRules />
        <ConfirmationRatioChart />
      </div>
    </div>
  );
}
