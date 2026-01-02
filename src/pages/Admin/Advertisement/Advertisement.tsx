import { useState } from "react";
import AdvertiseManagementTop from "./components/AddTop";
import PerformanceTrendsChart from "./components/PerformanceTrend";
import CreateNewCampaign from "./components/CreateNewCampaign";
import AdvertisementsTable from "./components/AdvertismentList";

export default function Advertisement() {
  const [activeTab, setActiveTab] = useState<"USER" | "RAIDER">("USER");

  const getTabClasses = (tab: "USER" | "RAIDER") =>
    `px-6 py-2 text-base font-medium rounded-full transition-colors cursor-pointer ${
      activeTab === tab
        ? "bg-yellow-50 text-gray-900 border border-yellow-400 shadow-sm"
        : "text-gray-600 bg-white hover:bg-gray-50 border border-gray-300"
    }`;

  return (
    <div className="bg-gray-50 px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Advertise Management
      </h1>

      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-10 ">
        <span className="rounded-full p-2 md:border border-black flex gap-2 flex-col md:flex-row justify-center">
          <button
            onClick={() => setActiveTab("USER")}
            className={getTabClasses("USER")}
          >
            Advertisement for USER
          </button>
          <button
            onClick={() => setActiveTab("RAIDER")}
            className={getTabClasses("RAIDER")}
          >
            Advertisement for RAIDER
          </button>
        </span>
      </div>

      <AdvertiseManagementTop activeTab={activeTab} />
      <PerformanceTrendsChart  activeTab={activeTab} />
      <div className="py-4">
        <CreateNewCampaign activeTab={activeTab}/>
      </div>
      {/* Pass activeTab to the AdvertisementsTable to filter the ads */}
      <AdvertisementsTable activeTab={activeTab} />
    </div>
  );
}
