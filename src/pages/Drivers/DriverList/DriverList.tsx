import CustomTable from "@/components/Dashboard/DataTable/DataTable";
import { useState } from 'react';
import { useDriverColumns } from "./DriverTable/DriverTable";
import DriverFilter from "@/components/Drivers/DriverFilter/DriverFilter";
import TablePagination from "@/pages/Dashboard/_components/TablePagination";

export default function DriverList() {
  // Temporary filter states (for input fields)
  const [tempRaiderId, setTempRaiderId] = useState<number | undefined>();
  const [tempRaiderName, setTempRaiderName] = useState("");
  const [tempVerificationStatus, setTempVerificationStatus] = useState<string | undefined>();

  // Applied filter states (for API calls)
  const [raiderId, setRaiderId] = useState<number | undefined>();
  const [raiderName, setRaiderName] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<string | undefined>();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Apply filters function
  const handleApplyFilters = () => {
    setRaiderId(tempRaiderId);
    setRaiderName(tempRaiderName);
    setVerificationStatus(tempVerificationStatus);
    setCurrentPage(1);
  };

  // Filter reset function
  const handleResetFilter = () => {
    setTempRaiderId(undefined);
    setTempRaiderName("");
    setTempVerificationStatus(undefined);
    setRaiderId(undefined);
    setRaiderName("");
    setVerificationStatus(undefined);
    setCurrentPage(1);
  };

  // Get the driver columns and data with pagination support
  const { driverColumns, drivers, isLoading, isError, totalItems } = useDriverColumns({
    raiderId,
    raider_name: raiderName,
    raiderVerificationFromAdmin: verificationStatus === "all" ? undefined : verificationStatus,
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
          <h1 className="text-black text-2xl font-bold">Driver List</h1>
        </div>

        {/* Category List Section */}
        <div className="sm:py-3">
          <div className="flex items-center gap-2">
            <span className="text-[#6B6B6B] text-xl font-semibold">Driver List</span>
            <span className="bg-secondary text-gray-700 px-3 py-1 rounded-full text-base font-medium border border-[#969696]">
              {drivers.length}
            </span>
          </div>
        </div>

        {/* Filter Section */}
        <DriverFilter
          raiderId={tempRaiderId}
          setRaiderId={setTempRaiderId}
          raiderName={tempRaiderName}
          setRaiderName={setTempRaiderName}
          verificationStatus={tempVerificationStatus}
          setVerificationStatus={setTempVerificationStatus}
          handleResetFilter={handleResetFilter}
          handleApplyFilters={handleApplyFilters}
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
            onPageChange={setCurrentPage}
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