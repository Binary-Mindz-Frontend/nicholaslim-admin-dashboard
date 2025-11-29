import { useState } from "react";
import StandardCommissionRate from "./components/StandardCommissionRate";
import DriverCompensationRules from "./components/DriverCompensationRules";
import DeductionFees from "./components/DeductionFees";
import UserFeeStructure from "./components/UserFeeStructure";
import DynamicSurgePricing from "./components/DynamicSurgePricing";

export default function PlatformFeeManagement() {
  const [activeTab, setActiveTab] = useState<"user" | "driver">("user");

  const getTabClasses = (tab: "user" | "driver") =>
    `px-6 py-2 text-base font-medium rounded-full transition-colors ${
      activeTab === tab
        ? "bg-yellow-50 text-gray-900 border border-yellow-400 shadow-sm"
        : "text-gray-600 bg-white hover:bg-gray-50 border border-gray-300"
    }`;

  return (
    <div>
      <div className="bg-gray-50 px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Advertise Management
        </h1>

        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-10 ">
          <span className="rounded-full p-2 md:border border-black flex gap-2 flex-col md:flex-row justify-center">
            <button
              onClick={() => setActiveTab("driver")}
              className={getTabClasses("driver")}
            >
              Driver Commission & Deduction
            </button>

            <button
              onClick={() => setActiveTab("user")}
              className={getTabClasses("user")}
            >
              User Commision & Deduction
            </button>
          </span>
        </div>

        <div className="py-4">
          {activeTab === "driver" ? (
            <>
              <StandardCommissionRate />
              <DriverCompensationRules />
              <DeductionFees />
            </>
          ) : (
            <>
              <UserFeeStructure />
              <DynamicSurgePricing />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
