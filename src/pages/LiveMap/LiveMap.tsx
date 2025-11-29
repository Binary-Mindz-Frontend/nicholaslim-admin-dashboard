
import { useState } from "react";
import RealTimeFleetMap from '@/components/Dashboard/RealTimeFleetMap/RealTimeFleetMap'
import FilterSection from "@/components/Admin/FilterSection/FilterSection";

export default function Livemap() {
  const [dateFilter, setDateFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [allFilter, setAllFilter] = useState("");

  const handleResetFilter = () => {
    setDateFilter("");
    setActiveFilter("");
    setAllFilter("");
  };

  return (
    <div className="px-8 sm:p-6 bg-[#F5F7FA]">
      <div className="w-full mx-auto space-y-4 mb-6">
        <div className="pt-2 sm:py-2">
          <h1 className="text-black text-2xl font-bold">Live Map / Fleet Tracking</h1>
        </div>

        {/* Filter Section */}
        <FilterSection
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        allFilter={allFilter}
        setAllFilter={setAllFilter}
        handleResetFilter={handleResetFilter}
      />
      </div>
      <RealTimeFleetMap />
    </div>
  );
}
