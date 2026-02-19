/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface ContentTabsProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  tabs?: string[];
  disabled?: boolean;
}

const activeTabClass =
  "bg-yellow-100 border-yellow-500 text-gray-900 shadow-md";
const inactiveTabClass =
  "bg-white border-gray-300 text-gray-700 hover:bg-gray-50";

const ContentTabs: React.FC<ContentTabsProps> = ({
  activeTab,
  setActiveTab,
  tabs,
  disabled = false,
}) => {
  return (
    <div className="flex">
      <span className="flex flex-wrap gap-3 mb-8 rounded-full p-2">
        {tabs?.map((item) => (
          <button
            key={item}
            onClick={() => setActiveTab(item)}
            className={`
            px-6 py-3 rounded-full text-base font-medium border transition-all duration-200 cursor-pointer
            ${activeTab === item ? activeTabClass : inactiveTabClass}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
            disabled={disabled}
          >
            {item}
          </button>
        ))}
      </span>
    </div>
  );
};

export default ContentTabs;
