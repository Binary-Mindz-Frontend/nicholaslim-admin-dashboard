import CustomTable from "@/components/Dashboard/DataTable/DataTable";
import { useState } from 'react';
import { driversData } from "../data/DriverData";
import { useDriverColumns } from "./DriverTable/DriverTable";
import FilterSection from "@/components/Shared/FilterSection/FilterSection";



export default function  DriverList() {
  const { driverColumns, drivers } = useDriverColumns(driversData);
  const [dateFilter, setDateFilter] = useState('');
  // const [activeFilter, setActiveFilter] = useState('');
  const [allFilter, setAllFilter] = useState('');
  const handleResetFilter = () => {
    setDateFilter('');
    // setActiveFilter('');
    setAllFilter('');
  };


  return (
    <div className="px-8 sm:p-6 bg-[#F5F7FA]">
      <div className="w-full mx-auto space-y-4 mb-6">
        {/* Header Section */}
        <div className="py-2">
          <h1 className="text-black text-2xl font-bold">Driver List</h1>
        </div>

        {/* Category List Section */}
        <div className="sm:py-3">
          <div className="flex items-center gap-2">
            <span className="text-[#6B6B6B] text-xl font-semibold">Category List</span>
            <span className="bg-secondary text-gray-700 px-3 py-1 rounded-full text-base font-medium border border-[#969696]">
              {drivers.length}
            </span>
          </div>
        </div>

        {/* Filter Section */}
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

      <CustomTable columns={driverColumns} data={drivers} />


    </div>
  );
}