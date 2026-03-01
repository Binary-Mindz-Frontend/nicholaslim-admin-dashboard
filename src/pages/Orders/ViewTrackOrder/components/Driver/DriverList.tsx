import { useState } from "react";
import { useDriverColumns } from "./DriverTable";
import DriverFilter from "@/components/Drivers/DriverFilter/DriverFilter";
import CustomTable from "@/components/Dashboard/DataTable/DataTable";
import TablePagination from "@/pages/Dashboard/_components/TablePagination";


export default function DriverListTrack() {
  // Direct filter states (no temporary states needed)
  const [raiderId, setRaiderId] = useState<number | undefined>();
  const [raiderName, setRaiderName] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<string | undefined>();
  const [search, setSearch] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Filter reset function
  const handleResetFilter = () => {
    setRaiderId(undefined);
    setRaiderName("");
    setVerificationStatus(undefined);
    setSearch("");
    setCurrentPage(1); // Reset to page 1 when filters are reset
  };

  // Handler functions that also reset to page 1
  const handleRaiderIdChange = (value: number | undefined) => {
    setRaiderId(value);
    setCurrentPage(1);
  };

  const handleRaiderNameChange = (value: string) => {
    setRaiderName(value);
    setCurrentPage(1);
  };

  const handleVerificationStatusChange = (value: string | undefined) => {
    setVerificationStatus(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  // Get the driver columns and data with pagination support
  const { driverColumns, drivers, isLoading, isError, totalItems } = useDriverColumns({
    raiderId,
    raider_name: raiderName,
    raiderVerificationFromAdmin: verificationStatus,
    search,
    page: currentPage,
    limit: itemsPerPage,
  });

  // Handle loading state
  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <p className="text-lg">Loading drivers...</p>
    </div>
  );

  // Handle error state
  if (isError) return (
    <div className="flex justify-center items-center h-64">
      <p className="text-lg text-red-600">Error loading drivers. Please try again.</p>
    </div>
  );

  return (
    <div className="px-8 sm:p-6 bg-[#F5F7FA]">
      <div className="w-full mx-auto space-y-4 mb-6">
        {/* Header Section */}
        <div className="py-2">
          <h1 className="text-black text-2xl font-bold">Driver Management</h1>
        </div>

        {/* Category List Section */}
        {/* <div className="sm:py-3">
          <div className="flex items-center gap-2">
            <span className="text-[#6B6B6B] text-xl font-semibold">Driver List</span>
            <span className="bg-secondary text-gray-700 px-3 py-1 rounded-full text-base font-medium border border-[#969696]">
              {totalItems}
            </span>
          </div>
        </div> */}

        {/* Filter Section */}
        <DriverFilter
          raiderId={raiderId}
          setRaiderId={handleRaiderIdChange}
          raiderName={raiderName}
          setRaiderName={handleRaiderNameChange}
          verificationStatus={verificationStatus}
          setVerificationStatus={handleVerificationStatusChange}
          search={search}
          setSearch={handleSearchChange}
          handleResetFilter={handleResetFilter}
        />
      </div>

      {/* Custom Table Section */}
      {drivers.length > 0 ? (
        <>
          <CustomTable columns={driverColumns} data={drivers} />

          {/* Pagination Component */}
          <TablePagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={(page) => {
              console.log("Page changed to:", page); // Add this
              setCurrentPage(page);
            }}
          />
        </>
      ) : (
        <div className="flex justify-center items-center h-64 bg-white rounded-lg">
          <p className="text-lg text-gray-500">No drivers found</p>
        </div>
      )}
    </div>
  );
}