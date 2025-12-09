
import CustomTable from "@/components/Dashboard/DataTable/DataTable";
import { useState } from "react";
import { supportAndDisputesData } from "./data/SupportData";
import { useSupportDisputeColumns } from "./SupportAndDisputesTable/SupportAndDisputesTable";
import FilterSection from "@/components/Shared/FilterSection/FilterSection";

export default function SupportAndDisputes() {
  const { columns, rows } = useSupportDisputeColumns(supportAndDisputesData);

  const [dateFilter, setDateFilter] = useState("");
  // const [activeFilter, setActiveFilter] = useState("");
  const [allFilter, setAllFilter] = useState("");

  const handleResetFilter = () => {
    setDateFilter("");
    // setActiveFilter("");
    setAllFilter("");
  };

  return (
    <div className="px-8 sm:p-6 bg-[#F5F7FA]">
      <div className="w-full mx-auto space-y-4 mb-6">

        {/* Header */}
        <div className="pt-2 sm:py-2">
          <h1 className="text-black text-2xl font-bold">Support & Disputes</h1>
        </div>

        {/* Filters */}
        <FilterSection
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        // activeFilter={activeFilter}
        // setActiveFilter={setActiveFilter}
        allFilter={allFilter}
        setAllFilter={setAllFilter}
        handleResetFilter={handleResetFilter}
      />
      </div>

      {/* TABLE */}
      <CustomTable columns={columns} data={rows} />
    </div>
  );
}
